import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'node:crypto';

// A shared-password gate for an invitation-only sandbox demo, not merchant authentication.
export function proxy(req:NextRequest){
 if(process.env.NODE_ENV!=='production') return NextResponse.next();
 const password=process.env.DEMO_PASSWORD;
 if(!password || password.length<16 || !process.env.DATABASE_URL || !process.env.APP_ORIGIN) return new NextResponse('Demo is not configured.',{status:503});
 const auth=req.headers.get('authorization')||'';
 let candidate=''; try{candidate=Buffer.from(auth.replace(/^Basic /i,''),'base64').toString('utf8')}catch{}
 const expected=`judge:${password}`;
 const digest=(s:string)=>createHash('sha256').update(s).digest();
 if(!auth.startsWith('Basic ')||!timingSafeEqual(digest(candidate),digest(expected)))return new NextResponse('Sign in to the sandbox demo.',{status:401,headers:{'WWW-Authenticate':'Basic realm="Remedy demo", charset="UTF-8"','Cache-Control':'no-store'}});
 return NextResponse.next();
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
