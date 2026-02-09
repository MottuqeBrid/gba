import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "gba_secret_key_2026_unity_service",
);

// Define public routes that don't need any protection
const publicRoutes = [
  "/",
  "/about",
  "/events",
  "/gallery",
  "/members",
  "/terms",
  "/privacy",
];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. Always allow public static assets
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // 2. Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      console.log(payload);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch (error) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 3. Prevent logged-in users from visiting auth pages
  if (authRoutes.includes(pathname)) {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/", request.url));
      } catch (error) {
        // Token invalid, allow visiting auth pages
        return NextResponse.next();
      }
    }
  }

  // 4. Default: Allow all other routes (Public)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
