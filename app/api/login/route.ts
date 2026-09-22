import { NextRequest, NextResponse } from "next/server";
import { createSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/auth";

function safeRedirectPath(value: FormDataEntryValue | null): string {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = form.get("password");
  const from = safeRedirectPath(form.get("from"));

  if (typeof password !== "string" || password !== process.env.DASHBOARD_PASSWORD) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("error", "1");
    loginUrl.searchParams.set("from", from);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(from, req.url), { status: 303 });
  response.cookies.set(SESSION_COOKIE_NAME, await createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
