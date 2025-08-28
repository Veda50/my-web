"use server";
import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/config/prisma";
import { redirect } from "next/navigation";

export const ensureUser = async (): Promise<string> => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const cu = await currentUser();
  if (!cu) redirect("/sign-in");

  const rec = await prisma.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      clerkName: cu.firstName ?? cu.fullName ?? userId,
      clerkProfileUrl: cu.imageUrl ?? null,
    },
    update: {
      clerkName: cu.firstName ?? cu.fullName ?? userId,
      clerkProfileUrl: cu.imageUrl ?? null,
    },
    select: { clerkId: true },
  });

  return rec.clerkId;
};

export const validateUser = async (): Promise<string> => {
  return ensureUser();
};
