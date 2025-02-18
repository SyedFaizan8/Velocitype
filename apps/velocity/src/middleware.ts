import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isApiRoute = pathname.startsWith('/api/');
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
        if (isApiRoute) {
            return NextResponse.json({ message: 'Unauthorized request' }, { status: 401 });
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
        '/api/profile/:username*',
        '/api/logout',
        '/api/refresh-token',
        '/api/result',
        '/api/imagekit-auth',
        '/api/user/:path*',
        '/api/login',
    ],
};
