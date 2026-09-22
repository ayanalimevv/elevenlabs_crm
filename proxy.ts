import { NextRequest, NextResponse } from "next/server";
import { isValidSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

export const config = {
  matcher: [
    "/((?!api/webhook|api/login|api/logout|login|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (await isValidSessionCookieValue(cookie)) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
