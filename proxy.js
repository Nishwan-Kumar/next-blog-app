
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const token = await getToken({ req });
  const isAuth = !!token;
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminPage) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // REMOVE the check that kicks out non-admins if you want 
    // regular users to access their own dashboard!
  }
  return NextResponse.next();
}