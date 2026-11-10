import 'server-only';
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Pool } from 'pg';

type Order={id:string;capture_id:string|null;capture_status:string|null;created_at:string};
type Refund={capture_id:string;request_id:string;amount:number;status:string;refund_id:string|null};
const dbUrl=process.env.DATABASE_URL;

const pool=dbUrl?new Pool({connectionString:dbUrl}):null;
let sqlite:DatabaseSync|null=null;
if(!pool){mkdirSync(join(process.cwd(),'.data'),{recursive:true});sqlite=new DatabaseSync(join(process.cwd(),'.data','remedy.sqlite'));sqlite.exec('PRAGMA journal_mode=WAL');}
let ready:Promise<void>|undefined;
async function init(){if(process.env.NODE_ENV==='production'&&!dbUrl)throw new Error('DATABASE_URL is required in production.');if(!ready)ready=(async()=>{const sql=`CREATE TABLE IF NOT EXISTS rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, capture_id TEXT, capture_status TEXT, created_at TEXT NOT NULL); CREATE TABLE IF NOT EXISTS refunds (capture_id TEXT PRIMARY KEY, request_id TEXT NOT NULL UNIQUE, amount INTEGER NOT NULL, status TEXT NOT NULL, refund_id TEXT, updated_at TEXT NOT NULL);`;if(pool)await pool.query(sql);else sqlite!.exec(sql)})();await ready}
async function query<T>(sql:string,params:(string|number|null)[]=[]):Promise<{rows:T[];changes:number}>{await init();if(pool){let index=0;const q=sql.replace(/\?/g,()=>`$${++index}`);const result=await pool.query(q,params);return {rows:result.rows as T[],changes:result.rowCount??0}}const statement=sqlite!.prepare(sql);if(/^\s*(SELECT|WITH)/i.test(sql) || /\bRETURNING\b/i.test(sql))return {rows:statement.all(...params) as T[],changes:0};const result=statement.run(...params);return {rows:[],changes:Number(result.changes)}}
export async function saveOrder(id:string){await query('INSERT INTO orders(id,created_at) VALUES (?,?) ON CONFLICT(id) DO NOTHING',[id,new Date().toISOString()])}
export async function getOrder(id:string){return (await query<Order>('SELECT * FROM orders WHERE id = ?',[id])).rows[0]}
export async function latestOrder(){return (await query<Order>('SELECT * FROM orders ORDER BY created_at DESC LIMIT 1')).rows[0]}
export async function saveCapture(id:string,capture:string,status:string){await query('UPDATE orders SET capture_id=?, capture_status=? WHERE id=?',[capture,status,id])}
export async function refundFor(id:string){return (await query<Refund>('SELECT * FROM refunds WHERE capture_id=?',[id])).rows[0]}
export async function reserveRefund(id:string,req:string,amount:number){return (await query('INSERT INTO refunds(capture_id,request_id,amount,status,updated_at) VALUES (?,?,?,?,?) ON CONFLICT(capture_id) DO NOTHING',[id,req,amount,'EXECUTING',new Date().toISOString()])).changes===1}
export async function updateRefund(id:string,status:string,refundId:string|null){await query('UPDATE refunds SET status=?,refund_id=?,updated_at=? WHERE capture_id=?',[status,refundId,new Date().toISOString(),id])}

// Shared fixed-window limit across application replicas when using PostgreSQL.
export async function consumeLimit(name:string,max:number,windowMs:number){
 const bucket=`${name}:${Math.floor(Date.now()/windowMs)}`;
 const result=await query<{count:number}>('INSERT INTO rate_limits(bucket,count) VALUES (?,1) ON CONFLICT(bucket) DO UPDATE SET count=rate_limits.count+1 RETURNING count',[bucket]);
 return Number(result.rows[0]?.count??max+1)<=max;
}
