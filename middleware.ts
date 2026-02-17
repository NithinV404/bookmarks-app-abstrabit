import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const middleware = withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow access if token exists
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Protect the dashboard and api routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
