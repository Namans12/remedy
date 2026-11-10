import { consumeLimit } from '@/lib/store';
import { randomUUID } from 'node:crypto';
import { paypal, localOnly, failure, PayPalError } from '@/lib/paypal';
import { getOrder, refundFor, reserveRefund, updateRefund } from '@/lib/store';
export async function POST(req:Request){
 if(!localOnly(req))return Response.json({error:'Available only on localhost.'},{status:403});
 try{if(!await consumeLimit('refund',12,3600000))return Response.json({error:'Demo limit reached. Please try again later.'},{status:429});const {orderId,approved}=await req.json();const order=typeof orderId==='string'?await getOrder(orderId):undefined;if(!order?.capture_id||order.capture_status!=='COMPLETED'||approved!==true)return Response.json({error:'A completed demo capture and explicit approval are required.'},{status:400});const capture=order.capture_id;const existing=await refundFor(capture);if(existing)return Response.json({status:existing.status,refundId:existing.refund_id,duplicate:true});
 const current=await paypal(`/v2/payments/captures/${encodeURIComponent(capture)}`);if(current.status!=='COMPLETED'||current.amount?.value!=='72.00'||current.amount?.currency_code!=='USD')return Response.json({error:'Capture is no longer eligible for the demo refund.'},{status:409});
 const requestId=randomUUID();if(!await reserveRefund(capture,requestId,2400))return Response.json({error:'A refund is already in progress.'},{status:409});
 try{const result=await paypal(`/v2/payments/captures/${encodeURIComponent(capture)}/refund`,'POST',{amount:{currency_code:'USD',value:'24.00'}},requestId);await updateRefund(capture,result.status,result.id);return Response.json({status:result.status,refundId:result.id,duplicate:false})}catch(e){await updateRefund(capture,e instanceof PayPalError&&e.status>=400&&e.status<500?'FAILED':'UNKNOWN',null);throw e}
 }catch(e){return failure(e)}
}
