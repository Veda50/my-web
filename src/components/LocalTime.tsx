"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  locale?: string;              // mis. "en-US" | "id-ID"
  hour12?: boolean;             // true => 12-hour, false => 24-hour
  intervalMs?: number;          // update period
  placeholder?: string;         // isi saat SSR / sebelum mount
};

export default function LocalTime({
  locale = "en-US",
  hour12 = false,
  intervalMs = 60_000,
  placeholder = "—:—",
}: Props) {
  const [value, setValue] = useState<string>(placeholder);

  // Formatter disimpan agar konsisten
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12,
      }),
    [locale, hour12]
  );

  useEffect(() => {
    const tick = () => setValue(formatter.format(new Date()));
    tick(); // set awal setelah mount
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [formatter, intervalMs]);

  // suppressHydrationWarning: biar React tak protes kalau konten berbeda dari SSR
  return <span suppressHydrationWarning>{value}</span>;
}
