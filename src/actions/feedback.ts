"use server";
import "server-only";

import {
  listThreads,
  findThreadById,
  createNewThread,
  createNewReply,
  updateThreadByAuthor,
  updateReplyByAuthor,
  softDeleteThreadByAuthor,
  hardDeleteThreadByAuthor,
  deleteReplyByAuthor,
} from "@/lib/db/prisma/feedback";

import {
  getThreadListData,
  setThreadListCache,
  clearThreadListCache,
  isThreadListCacheStale,
} from "@/lib/db/inMemory/feedback";

import type {
  NewReplyType,
  NewThreadType,
  ThreadListType,
  ThreadDetailType,
} from "@/constant/prismaQuery";

import { cacheTtl } from "@/constant";
import { validateUser } from "./user";
import { z } from "zod";
import { revalidateTag } from "next/cache";

/* ========================= READ ========================= */

export const getAllThreads = async (): Promise<ThreadListType[]> => {
  // in-memory cache lokal proses (boleh tetap ada untuk dev/SSR single instance)
  if (!isThreadListCacheStale(cacheTtl)) {
    return getThreadListData();
  }

  const threads = await listThreads();
  setThreadListCache(threads);
  return threads;
};

export const getThreadById = async (threadId: number): Promise<ThreadDetailType | null> => {
  return await findThreadById(threadId);
};

/* ======================= VALIDATORS ====================== */

const ThreadCreateSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(200, "Judul maksimal 200 karakter"),
  body:  z.string().min(1, "Konten tidak boleh kosong"),
  category: z.enum(["FEATURES", "BUGS", "GENERAL", "FEEDBACK"]).optional(),
});

const ReplyCreateSchema = z.object({
  threadId: z.number().int().positive("threadId tidak valid"),
  body:     z.string().min(1, "Balasan tidak boleh kosong"),
});

const ThreadEditSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  body:  z.string().min(1).optional(),
  category: z.enum(["FEATURES", "BUGS", "GENERAL", "FEEDBACK"]).optional(),
}).refine(d => d.title || d.body || d.category, { message: "Tidak ada perubahan" });

const ReplyEditSchema = z.object({
  body: z.string().min(1, "Balasan tidak boleh kosong"),
});

/* ======================== CREATE ========================= */

export const createThread = async (data: Pick<NewThreadType, "title" | "body"> & { category?: "FEATURES"|"BUGS"|"GENERAL"|"FEEDBACK" }) => {
  const userId = await validateUser();
  const parsed = ThreadCreateSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Payload tidak valid");

  const created = await createNewThread({ ...parsed.data, authorId: userId });
  // Invalidate caches
  clearThreadListCache();
  revalidateTag("threads:list");

  return created; // { id }
};

export const createReply = async (data: Pick<NewReplyType, "threadId" | "body">) => {
  const userId = await validateUser();
  const parsed = ReplyCreateSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Payload tidak valid");

  const created = await createNewReply({ ...parsed.data, authorId: userId });
  // Invalidate caches (list menampilkan _count.Reply)
  clearThreadListCache();
  revalidateTag("threads:list");

  return created;
};

/* ========================= UPDATE ======================== */

export const editThread = async (threadId: number, payload: { title?: string; body?: string; category?: "FEATURES"|"BUGS"|"GENERAL"|"FEEDBACK" }) => {
  const userId = await validateUser();
  const parsed = ThreadEditSchema.safeParse(payload);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Payload tidak valid");

  const updated = await updateThreadByAuthor(threadId, userId, parsed.data);
  clearThreadListCache();
  revalidateTag("threads:list");

  return updated;
};

export const editReply = async (replyId: number, payload: { body: string }) => {
  const userId = await validateUser();
  const parsed = ReplyEditSchema.safeParse(payload);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Payload tidak valid");

  const updated = await updateReplyByAuthor(replyId, userId, parsed.data);
  clearThreadListCache();
  revalidateTag("threads:list");

  return updated;
};

/* ========================= DELETE ======================== */
/**
 * Soft delete default (isActive=false). Jika ingin hapus permanen, set opts.hard=true.
 */
export const deleteThread = async (threadId: number, opts?: { hard?: boolean }) => {
  const userId = await validateUser();
  if (opts?.hard) {
    await hardDeleteThreadByAuthor(threadId, userId);
  } else {
    await softDeleteThreadByAuthor(threadId, userId);
  }
  clearThreadListCache();
  revalidateTag("threads:list");
  return { ok: true as const };
};

export const deleteReply = async (replyId: number) => {
  const userId = await validateUser();
  await deleteReplyByAuthor(replyId, userId);
  clearThreadListCache();
  revalidateTag("threads:list");
  return { ok: true as const };
};
