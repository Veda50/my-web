export const runtime = "nodejs";

import { unstable_cache } from "next/cache";
import { listThreads } from "@/lib/db/prisma/feedback";
import FeedbackClient from "./_client";

// Cache data list di Next dengan TAG "threads:list"
const getThreadsCached = unstable_cache(
  async () => {
    const rows = await listThreads();
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      authorName: row.Author?.clerkName ?? "Anonymous",
      authorAvatar: row.Author?.clerkProfileUrl ?? null,
      authorRole: "MEMBER" as const,              // bisa diperkaya jika kamu expose role
      category: row.category,
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
