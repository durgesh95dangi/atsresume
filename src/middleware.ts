import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    console.log('Middleware: Checking request for', request.nextUrl.pathname);
    console.log('Middleware: Session cookie present:', !!session);

    // Define protected routes
    const protectedRoutes = ['/dashboard', '/settings'];
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        if (!session) {
            console.log('Middleware: No session, redirecting to sign-in');
            return NextResponse.redirect(new URL('/auth/sign-in', request.url));
        }

        // Verify session
        try {
            await decrypt(session);
        } catch (error) {
            // Invalid session
            console.error('Middleware: Session verification failed', error);
            return NextResponse.redirect(new URL('/auth/sign-in', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
