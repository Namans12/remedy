import { consumeLimit, getOrder } from '@/lib/store';
import { localOnly, paypal, failure } from '@/lib/paypal';
import { readJsonObject } from '@/lib/request';

export async function POST(req: Request) {
 if (!localOnly(req)) return Response.json({error:'Access denied.'},{status:403});
 try {
  if (!await consumeLimit('order-resume', 30, 3600000)) return Response.json({error:'Demo limit reached. Please try again later.'},{status:429});
  const {orderId} = await readJsonObject(req);
  const stored = typeof orderId === 'string' ? await getOrder(orderId) : undefined;
  if (!stored || stored.capture_id) return Response.json({error:'An uncaptured demo order is required.'},{status:400});
  const order = await paypal(`/v2/checkout/orders/${encodeURIComponent(stored.id)}`);
  if (order.status === 'APPROVED' || order.status === 'COMPLETED') return Response.json({error:'This order has already been approved. Select Check or complete payment.'},{status:409});
  const approval = order.links?.find((link: {rel:string}) => link.rel === 'payer-action' || link.rel === 'approve')?.href;
  if (!approval || !['CREATED','PAYER_ACTION_REQUIRED'].includes(order.status)) return Response.json({error:'PayPal cannot resume this checkout. Create a new test payment.'},{status:409});
  const url = new URL(approval);
  if (url.protocol !== 'https:' || !['www.sandbox.paypal.com','sandbox.paypal.com'].includes(url.hostname)) return Response.json({error:'PayPal returned an unexpected checkout address.'},{status:502});
  return Response.json({approveUrl:url.href});
 } catch (error) { return failure(error); }
}
