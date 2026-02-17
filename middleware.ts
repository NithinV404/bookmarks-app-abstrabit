import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    // Check if user is authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

// Protect the dashboard and api routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
