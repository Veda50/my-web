// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware((auth, req: NextRequest) => {
  const url = req.nextUrl.pathname;

  const res = NextResponse.next();

  // Hapus noindex header di production
  if (process.env.NODE_ENV === "production") {
    res.headers.delete("X-Robots-Tag");
    res.headers.set("X-Robots-Tag", "index, follow");
  }

  const hasLang = req.cookies.get("language");
  if (!hasLang && !url.startsWith("/api")) {
    const al = (req.headers.get("accept-language") || "").toLowerCase();

    const language = al.includes("id") ? "ID" : "EN";

    res.cookies.set("language", language, {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365, // 1 tahun
    });
  }

  return res;
});

// Matcher kamu sudah oke & cukup ketat
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};