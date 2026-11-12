import { NextRequest, NextResponse } from 'next/server';
import { checkoutParams, demoConfig, issueSession, sessionCookie, sessionSeconds, validCredentials } from '@/lib/demo-auth';
import { localOnly } from '@/lib/paypal';
import { readUtf8Body, RequestInputError } from '@/lib/request';
import { consumeLimit } from '@/lib/store';

const noStore = { 'Cache-Control': 'no-store' };

export async function POST(request: NextRequest) {
  if (!localOnly(request)) {
    return new NextResponse('Access denied.', { status: 403, headers: noStore });
  }
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.redirect(new URL('/', request.url), { status: 303, headers: noStore });
  }
  const config = demoConfig();
  if (!config) return new NextResponse('Demo is not configured.', { status: 503, headers: noStore });
  if (!/^application\/x-www-form-urlencoded(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) {
    return new NextResponse('Open the Remedy sign-in page to continue.', { status: 415, headers: noStore });
  }

  const destination = new URL('/sign-in', config.origin);
  try {
    const fields = new URLSearchParams(await readUtf8Body(request, 4096));
    destination.search = checkoutParams(fields.get('checkout'), fields.get('token')).toString();
    if (!validCredentials(fields.get('username') ?? '', fields.get('password') ?? '', config.password)) {
      const allowed = await consumeLimit('auth-failure', 100, 60000);
      destination.searchParams.set('error', allowed ? 'credentials' : 'limit');
      return NextResponse.redirect(destination, { status: 303, headers: noStore });
    }

    destination.pathname = '/';
    const response = NextResponse.redirect(destination, { status: 303, headers: noStore });
    response.cookies.set(sessionCookie, issueSession(config.password), {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: sessionSeconds,
    });
    return response;
  } catch (error) {
    if (error instanceof RequestInputError) {
      return new NextResponse(error.message, { status: error.status, headers: noStore });
    }
    destination.searchParams.set('error', 'unavailable');
    return NextResponse.redirect(destination, { status: 303, headers: noStore });
  }
}
