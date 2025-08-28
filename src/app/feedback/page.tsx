export const runtime = "nodejs";

import { unstable_cache } from "next/cache";
import { listThreadsWithBody } from "@/lib/db/prisma/feedback";
import FeedbackClient from "./_client";

function makeExcerpt(body: string, max = 160) {
  const plain = body.replace(/\s+/g, " ").trim(); // simplifikasi
  return plain.length <= max ? plain : plain.slice(0, max).trimEnd() + "…";
}

// Cache data list di Next dengan TAG "threads:list"
const getThreadsCached = unstable_cache(
  async () => {
    const rows = await listThreadsWithBody();
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      excerpt: makeExcerpt(row.body, 160), // ⬅️ kirim excerpt ke client
      authorName: row.User?.clerkName ?? "Anonymous",
      authorAvatar: row.User?.clerkProfileUrl ?? null,
      authorRole: "MEMBER" as const,
      category: row.category,             // label akan dipetakan di client
      views: row.viewsCount,
      repliesCount: row._count.Reply,
      createdAt: row.createdAt.toISOString(),
    }));
  },
  ["threads:list"],
  { revalidate: 120 },
);

export default async function Page() {
  const initialThreads = await getThreadsCached();
  return <FeedbackClient initialThreads={initialThreads} />;
}
