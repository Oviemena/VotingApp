import { NextRequest, NextResponse } from 'next/server';
import {
  publicRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT
} from "@/routes";
import fetchSession from './lib/fetchSession';

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  let session = null;
  session = await fetchSession();
  try {
    session = await fetchSession();
  } catch (error) {
    console.error('Error fetching session:', error);
  }

  const isLoggedIn = !!session;

  console.log('Incoming request:', nextUrl.pathname);
  const dynamicRoutePattern = /^\/[a-zA-Z0-9-_]+$/;
  if (dynamicRoutePattern.test(nextUrl.pathname)) {
    // Perform validation or authentication
    if (!isLoggedIn && !isPublicRoute) {
      // If the user is not authenticated, redirect to the login page
      return NextResponse.redirect(new URL('/auth/login', nextUrl));
    }
  }

  // If user is not logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    console.log('No session found, redirecting to login.');
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  // If user is logged in and trying to access an auth route (like login)
  if (isLoggedIn && isAuthRoute) {
    console.log('User is logged in, redirecting to default page.');
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  console.log('Session is valid or accessing public route, proceeding to next middleware.');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
