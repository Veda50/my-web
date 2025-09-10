import "server-only";

import type { ThreadListType } from "@/constant/prismaQuery";

type State = { data: ThreadListType[] | null; updatedAt: number };
const state: State = { data: null, updatedAt: 0 };

export function getThreadListData(): ThreadListType[] {
  return state.data ?? [];
}
export function setThreadListCache(list: ThreadListType[]): void {
  state.data = list;
  state.updatedAt = Date.now();
}
export function clearThreadListCache(): void {
  state.data = null;
  state.updatedAt = 0;
}
export function isThreadListCacheStale(ttlMs: number): boolean {
  if (!state.data) return true;
  return Date.now() - state.updatedAt > ttlMs;
}
