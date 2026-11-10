import 'server-only';
import { getPayPalConfig } from './env';
import { RequestInputError } from './request';
export class PayPalError extends Error { constructor(public status:number, public details:unknown){super('PayPal request failed')} }
export async function paypal(path:string, method='GET', body?:unknown, requestId?:string){
 const c=getPayPalConfig();
 const tokenResponse=await fetch(`${c.baseUrl}/v1/oauth2/token`,{method:'POST',headers:{Authorization:`Basic ${Buffer.from(`${c.clientId}:${c.clientSecret}`).toString('base64')}`,'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store',signal:AbortSignal.timeout(15000)});
 if(!tokenResponse.ok) throw new PayPalError(tokenResponse.status,'Sandbox authentication failed');
 const {access_token}=await tokenResponse.json();
 const response=await fetch(`${c.baseUrl}${path}`,{method,headers:{Authorization:`Bearer ${access_token}`,'Content-Type':'application/json',Prefer:'return=representation',...(requestId?{'PayPal-Request-Id':requestId}:{})},...(body===undefined?{}:{body:JSON.stringify(body)}),cache:'no-store',signal:AbortSignal.timeout(15000)});
 const raw=await response.text(); let data; try{data=JSON.parse(raw)}catch{data={message:raw.slice(0,300)}}
 if(!response.ok) throw new PayPalError(response.status,data); return data;
}
export function localOnly(req:Request){
 const host=req.headers.get('host')??'';
 if(process.env.NODE_ENV==='production'){
  const configured=process.env.APP_ORIGIN;
  if(!configured)return false;
  try {const app=new URL(configured);const source=req.headers.get('origin');return app.protocol==='https:' && host.toLowerCase()===app.host.toLowerCase() && (req.method==='GET' ? !source||source===app.origin : source===app.origin)} catch {return false}
 }
 const origin=req.headers.get('origin');
 const localHost=/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(host);
 if(!localHost)return false;
 if(!origin)return true;
 try { const source=new URL(origin); return ['http:','https:'].includes(source.protocol) && source.host.toLowerCase()===host.toLowerCase(); } catch { return false; }
}
export function failure(e:unknown){if(e instanceof RequestInputError)return Response.json({error:e.message},{status:e.status});console.error('Request failed',e instanceof PayPalError ? `PayPal ${e.status}` : e instanceof Error ? e.message : 'unknown');return Response.json({error:e instanceof PayPalError ? `PayPal sandbox returned ${e.status}. Check the sandbox account and try again.` : 'Something went wrong. Check the server logs.'},{status:e instanceof PayPalError?502:500})}
