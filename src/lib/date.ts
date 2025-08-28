export const DATE_LOCALE = "id-ID";
export const DATE_TZ = "Asia/Jakarta";

export function formatDmy(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    day: "2-digit",
    month: "numeric",
    year: "numeric",
    timeZone: DATE_TZ,
  }).format(d);
}

export function timeAgo(iso: string) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const hrs = Math.floor(diffMs / 36e5);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDmy(iso); // fallback deterministik
}
