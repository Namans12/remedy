import { NextRequest, NextResponse } from 'next/server';
import { checkoutParams, demoConfig, sessionCookie, validBasicAuth, validSession } from '@/lib/demo-auth';
import { consumeLimit } from '@/lib/store';

const noStore = { 'Cache-Control': 'no-store' };

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== 'production') return NextResponse.next();
  const config = demoConfig();
  if (!config) return new NextResponse('Demo is not configured.', { status: 503, headers: noStore });

  const path = request.nextUrl.pathname;
  if (path === '/sign-in' || path === '/api/sign-in') return NextResponse.next();

  const authorization = request.headers.get('authorization');
  if (validSession(request.cookies.get(sessionCookie)?.value, config.password)
      || validBasicAuth(authorization, config.password)) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }

  if (path === '/api' || path.startsWith('/api/')) {
    if (authorization) {
      try {
        if (!await consumeLimit('auth-failure', 100, 60000)) {
          return NextResponse.json({ error: 'Too many sign-in attempts. Try again shortly.' }, {
            status: 429, headers: { ...noStore, 'Retry-After': '60' },
          });
        }
      } catch {
        return NextResponse.json({ error: 'Demo access is temporarily unavailable.' }, { status: 503, headers: noStore });
      }
    }
    return NextResponse.json({ error: 'Sign in to the sandbox demo.' }, { status: 401, headers: noStore });
  }

  const signIn = new URL('/sign-in', config.origin);
  const query = request.nextUrl.searchParams;
  signIn.search = checkoutParams(query.get('checkout'), query.get('token')).toString();
  return NextResponse.redirect(signIn, { headers: noStore });
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
