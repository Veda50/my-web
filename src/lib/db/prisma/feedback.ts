import prisma from "@/lib/config/prisma";
import type { ThreadListType, ThreadDetailType } from "@/constant/prismaQuery";

const userPublicSelect = {
  clerkId: true,
  clerkName: true,
  clerkProfileUrl: true,
  role: true,
};

export async function listThreads(): Promise<ThreadListType[]> {
  const rows = await prisma.thread.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      category: true,
      viewsCount: true,
      User: { select: userPublicSelect },
      _count: { select: { Reply: true } },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    createdAt: r.createdAt,
    Author: {
      clerkId: r.User?.clerkId ?? "",
      clerkName: r.User?.clerkName ?? "Anonymous",
      clerkProfileUrl: r.User?.clerkProfileUrl ?? null,
    },
    _count: r._count,
    category: r.category,
    viewsCount: r.viewsCount ?? 0,
  }));
}

type ListWithBodyRow = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  category: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
  viewsCount: number;
  User: { clerkId: string; clerkName: string | null; clerkProfileUrl: string | null } | null;
  _count: { Reply: number };
};

export async function listThreadsWithBody(): Promise<ListWithBodyRow[]> {
  return prisma.thread.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      category: true,
      viewsCount: true,
      User: { select: userPublicSelect },
      _count: { select: { Reply: true } },
    },
  }) as unknown as ListWithBodyRow[];
}

/* ==================== DETAIL ==================== */
export async function findThreadById(threadId: number): Promise<ThreadDetailType | null> {
  const row = await prisma.thread.findUnique({
    where: { id: threadId, isActive: true },
    select: {
      id: true,
      title: true,
      body: true,
      createdAt: true,
      category: true,
      viewsCount: true,
      User: { select: userPublicSelect },
      Reply: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          body: true,
          createdAt: true,
          User: { select: userPublicSelect },
        },
      },
      _count: { select: { Reply: true } },
    },
  });

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.createdAt,
    Author: {
      clerkId: row.User?.clerkId ?? "",
      clerkName: row.User?.clerkName ?? "Anonymous",
      clerkProfileUrl: row.User?.clerkProfileUrl ?? null,
    },
    Reply: row.Reply.map((r) => ({
      id: r.id,
      body: r.body,
      createdAt: r.createdAt,
      Author: {
        clerkId: r.User?.clerkId ?? "",
        clerkName: r.User?.clerkName ?? "Anonymous",
        clerkProfileUrl: r.User?.clerkProfileUrl ?? null,
      },
    })),
    _count: row._count,
    category: row.category,
    viewsCount: row.viewsCount ?? 0,
  };
}

/* ==================== CREATE/UPDATE/DELETE (tidak diubah) ==================== */
export async function createNewThread(input: {
  title: string;
  body: string;
  authorId: string;
  category?: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
}) {
  return prisma.thread.create({
    data: {
      title: input.title,
      body: input.body,
      authorId: input.authorId,
      category: input.category ?? "GENERAL",
    },
    select: { id: true },
  });
}

export async function createNewReply(input: { threadId: number; body: string; authorId: string }) {
  return prisma.reply.create({
    data: {
      threadId: input.threadId,
      body: input.body,
      authorId: input.authorId,
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      User: { select: userPublicSelect },
    },
  });
}

export async function updateThreadByAuthor(
  threadId: number,
  authorClerkId: string,
  payload: { title?: string; body?: string; category?: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK" },
) {
  return prisma.thread.update({
    where: { id: threadId, authorId: authorClerkId },
    data: {
      ...(payload.title ? { title: payload.title } : {}),
      ...(payload.body ? { body: payload.body } : {}),
      ...(payload.category ? { category: payload.category } : {}),
    },
    select: { id: true },
  });
}

export async function updateReplyByAuthor(replyId: number, authorClerkId: string, payload: { body: string }) {
  return prisma.reply.update({
    where: { id: replyId, authorId: authorClerkId },
    data: { body: payload.body },
    select: { id: true },
  });
}

export async function softDeleteThreadByAuthor(threadId: number, authorClerkId: string) {
  await prisma.thread.update({
    where: { id: threadId, authorId: authorClerkId },
    data: { isActive: false },
  });
}

export async function hardDeleteThreadByAuthor(threadId: number, authorClerkId: string) {
  await prisma.thread.delete({
    where: { id: threadId, authorId: authorClerkId },
  });
}

export async function deleteReplyByAuthor(replyId: number, authorClerkId: string) {
  await prisma.reply.delete({
    where: { id: replyId, authorId: authorClerkId },
  });
}
