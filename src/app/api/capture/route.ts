import { consumeLimit } from '@/lib/store';
import { paypal, localOnly, failure } from '@/lib/paypal';
import { getOrder, saveCapture } from '@/lib/store';
export async function POST(req:Request){
 if(!localOnly(req))return Response.json({error:'Available only on localhost.'},{status:403});
 try{if(!await consumeLimit('capture',30,3600000))return Response.json({error:'Demo limit reached. Please try again later.'},{status:429});const {orderId}=await req.json();if(typeof orderId!=='string'||!await getOrder(orderId))return Response.json({error:'Unknown demo order.'},{status:400});let order=await paypal(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);if(order.status==='APPROVED')order=await paypal(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,'POST',{},`capture-${orderId}`);const capture=order.purchase_units?.[0]?.payments?.captures?.[0];if(!capture)return Response.json({error:order.status==='PAYER_ACTION_REQUIRED' || order.status==='CREATED' ? 'The buyer has not approved this sandbox order yet. Start a new test payment if checkout cannot be resumed.' : `PayPal reports order status ${order.status}; no capture is available yet.`},{status:409});await saveCapture(orderId,capture.id,capture.status);return Response.json({orderId,captureId:capture.id,status:capture.status})}catch(e){return failure(e)}
}
