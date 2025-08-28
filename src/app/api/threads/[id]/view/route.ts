export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/config/prisma";

type RouteContext = { params: { id: string } };

export async function POST(req: NextRequest, ctx: RouteContext) {
  const threadId = Number(ctx.params.id);
  if (!Number.isFinite(threadId)) {
    return NextResponse.json({ error: "Invalid thread id" }, { status: 400 });
  }

  const cookieKey = `tv:${threadId}`;
  const hasCookie = req.cookies.get(cookieKey);

  if (hasCookie) {
    // optional: kembalikan count terkini
    const row = await prisma.thread.findUnique({
      where: { id: threadId },
      select: { viewsCount: true },
    });
    return NextResponse.json({ counted: false, views: row?.viewsCount ?? 0 });
  }

  // atomic increment + ambil nilai terkini
  const updated = await prisma.thread.update({
    where: { id: threadId },
    data: { viewsCount: { increment: 1 } },
    select: { viewsCount: true },
  });

  const res = NextResponse.json({ counted: true, views: updated.viewsCount });
  // set cookie 24 jam
  res.cookies.set(cookieKey, "1", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
  });
  return res;
}
