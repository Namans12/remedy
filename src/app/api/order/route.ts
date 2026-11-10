import { consumeLimit } from '@/lib/store';
import { paypal, localOnly, failure } from '@/lib/paypal';
import { saveOrder } from '@/lib/store';
import { randomUUID } from 'node:crypto';
export async function POST(req:Request){
 if(!localOnly(req)) return Response.json({error:'Available only on localhost.'},{status:403});
 try{if(!await consumeLimit('order',12,3600000))return Response.json({error:'Demo limit reached. Please try again later.'},{status:429});const u=new URL(process.env.APP_ORIGIN || req.url);const order=await paypal('/v2/checkout/orders','POST',{intent:'CAPTURE',purchase_units:[{description:'Demo: three ceramic mugs',amount:{currency_code:'USD',value:'72.00'}}],payment_source:{paypal:{experience_context:{return_url:`${u.origin}/?checkout=approved`,cancel_url:`${u.origin}/?checkout=cancelled`,user_action:'PAY_NOW'}}}},randomUUID());await saveOrder(order.id);const approve=order.links?.find((l:{rel:string})=>l.rel==='payer-action'||l.rel==='approve')?.href;if(!approve)return Response.json({error:'PayPal returned no approval link.'},{status:502});const destination=new URL(approve);if(destination.protocol!=='https:' || !['www.sandbox.paypal.com','sandbox.paypal.com'].includes(destination.hostname))return Response.json({error:'PayPal returned an unexpected checkout address.'},{status:502});return Response.json({id:order.id,approveUrl:approve})}catch(e){return failure(e)}
}
