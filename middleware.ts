import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, hashPin } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath =
    path.startsWith("/login") || path.startsWith("/api/auth/");

  const configuredPin = process.env.APP_PIN;
  if (!configuredPin) {
    if (isPublicPath) return NextResponse.next();
    return NextResponse.redirect(new URL("/login?setup=1", request.url));
  }

  const expectedCookie = await hashPin(configuredPin);
  const hasAccess = request.cookies.get(AUTH_COOKIE)?.value === expectedCookie;

  if (!hasAccess && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasAccess && path.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
