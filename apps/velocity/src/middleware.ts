import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import redis from "@/lib/redisClient";

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '15 m'),
    analytics: true // TODO: Search what it is 
})

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/')) {
        const ip = request.headers.get('x-real-ip')
            || request.headers.get('x-forwarded-for')?.split(',')[0]
            || "global";

        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json({ error: 'Too many requests, please try again later.' }, { status: 429 })
        }
    }

    const isPublicFrontend = pathname === '/velocity/login';
    const isLoginRoute = pathname === '/api/login';

    const token =
        request.cookies.get('accessToken')?.value ||
        (request.headers.get('authorization')?.startsWith('Bearer ')
            ? request.headers.get('authorization')!.substring(7)
            : '');

    if (isPublicFrontend && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!token && !isPublicFrontend && !isLoginRoute) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ message: 'Please login' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/velocity/login', request.nextUrl));
    }
    return NextResponse.next();
}


export const config = {
    matcher: [
        '/velocity/login',
        '/velocity/user/:path*',
        '/velocity/settings',
        '/api/logout',
        '/api/refresh-token',
        '/api/result',
        '/api/imagekit-auth',
        '/api/user/:path*',
        '/api/login',
    ],
};
