// src/app/feedback/[id]/page.tsx
export const runtime = "nodejs";

import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getThreadById } from "@/actions/feedback";
import ThreadDetailClient from "./_client";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const data = await getThreadById(id);
  if (!data) notFound();

  const { userId } = await auth();

  const initialThread = {
    id: data.id,
    title: data.title,
    body: data.body,
    createdAt: data.createdAt.toISOString(),
    // ⬇️ pastikan string (bukan string | null)
    authorName: data.Author.clerkName ?? "Anonymous",
    authorAvatar: data.Author.clerkProfileUrl,
    authorRole: "MEMBER" as const, // jika mau, ambil role asli dari DB
    repliesCount: data._count.Reply,
    category: data.category,
    viewsCount: data.viewsCount,
  };

  const initialReplies = data.Reply.map((r) => ({
    id: r.id,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
    // ⬇️ pastikan string (bukan string | null)
    authorName: r.Author.clerkName ?? "Anonymous",
    authorAvatar: r.Author.clerkProfileUrl,
    authorRole: "MEMBER" as const, // bisa diperkaya dengan role
    canEdit: !!userId && r.Author.clerkId === userId,
  }));

  const canEditThread = !!userId && data.Author.clerkId === userId;
  const canReply = !!userId;

  return (
    <ThreadDetailClient
      initialThread={initialThread}
      initialReplies={initialReplies}
      canEditThread={canEditThread}
      canReply={canReply}
      threadId={id}
    />
  );
}
