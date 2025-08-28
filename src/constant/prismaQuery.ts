import type { Prisma } from "@prisma/client";

/** Data minimal untuk user pada payload yang diekspos ke UI */
export type UserPublic = {
  clerkId: string;
  clerkName: string | null;
  clerkProfileUrl: string | null;
};

/** Payload create (dipakai di server actions) */
export type NewThreadType = { title: string; body: string };
export type NewReplyType = { threadId: number; body: string };

/** Bentuk data LIST thread (listThreads) */
export type ThreadListType = {
  id: number;
  title: string;
  createdAt: Date;
  Author: {
    clerkId: string;
    clerkName: string | null;
    clerkProfileUrl: string | null;
  };
  _count: { Reply: number };
  category: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
  viewsCount: number;
};

/** Bentuk data reply dengan user (untuk detail) */
export type ReplyType = {
  id: number;
  body: string;
  createdAt: Date;
  Author: {
    clerkId: string;
    clerkName: string | null;
    clerkProfileUrl: string | null;
  };
};

/** Bentuk data DETAIL thread (findThreadById) */
export type ThreadDetailType = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
  Author: {
    clerkId: string;
    clerkName: string;
    clerkProfileUrl: string | null;
  };
  Reply: ReplyType[];
  _count: { Reply: number };
  category: "FEATURES" | "BUGS" | "GENERAL" | "FEEDBACK";
  viewsCount: number;
};

export type ThreadId = number;
export type ReplyId = number;
