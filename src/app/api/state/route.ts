import { consumeLimit, latestOrder, refundFor, updateRefund } from '@/lib/store';
import { localOnly, paypal, fetchOrder, isOrderGone } from '@/lib/paypal';
export async function GET(req:Request){
 if(!localOnly(req))return Response.json({error:'Access denied.'},{status:403});
 try{if(!await consumeLimit('state',120,60000))return Response.json({error:'Too many status checks. Please wait a minute and try again.'},{status:429});const order=await latestOrder();let refund=order?.capture_id?await refundFor(order.capture_id):undefined;let refundCheck:'not-needed'|'updated'|'unavailable'='not-needed';
 if(refund?.refund_id && ['PENDING','EXECUTING'].includes(refund.status)){
  try{const current=await paypal(`/v2/payments/refunds/${encodeURIComponent(refund.refund_id)}`);if(typeof current.status!=='string')throw new Error('Missing refund status');await updateRefund(refund.capture_id,current.status,refund.refund_id);refund=await refundFor(refund.capture_id);refundCheck='updated'}catch{refundCheck='unavailable'}
 }
 // For an order that has not been captured, report PayPal's current view so the UI can offer the right next step.
 // Only a confirmed 404/VOIDED is "unavailable"; a timeout or error stays "unknown" and never discards the order.
 let orderCheck:{availability:'not-needed'|'available'|'unavailable'|'unknown';status:string|null}={availability:'not-needed',status:null};
 if(order&&!order.capture_id){
  try{const current=await Promise.race([fetchOrder(order.id),new Promise<never>((_,reject)=>setTimeout(()=>reject(new Error('order check timed out')),4000))]);orderCheck=isOrderGone(current)?{availability:'unavailable',status:current?.status??null}:{availability:'available',status:typeof current.status==='string'?current.status:null}}catch{orderCheck={availability:'unknown',status:null}}
 }
 return Response.json({order:order??null,refund:refund??null,refundCheck,orderCheck})}catch{return Response.json({error:'Could not load payment state.'},{status:503})}
}
