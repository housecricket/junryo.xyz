"use client";
// Đếm ngược tới lần ra chương kế tiếp (thứ Hai 8:00 giờ Việt Nam).
import { useEffect, useState } from "react";
import { RELEASE, UI } from "@/lib/ui";
import type { Lang } from "@/lib/content";

function nextRelease(now: Date) {
  // Mốc theo UTC: 8:00 UTC+7 = 1:00 UTC
  const t = new Date(now);
  t.setUTCHours(RELEASE.hour - RELEASE.utcOffset, 0, 0, 0);
  const add = (RELEASE.weekday - t.getUTCDay() + 7) % 7;
  t.setUTCDate(t.getUTCDate() + add);
  if (t <= now) t.setUTCDate(t.getUTCDate() + 7);
  return t;
}

export default function Countdown({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setLeft(nextRelease(new Date()).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Trước khi trình duyệt chạy script: hiện lịch cố định
  if (left === null) return <span className="cd">{ui.when}</span>;

  const s = Math.floor(left / 1000);
  const parts = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
  return (
    <span className="cd" title={ui.when}>
      <span className="cd-k">{ui.outIn}</span>
      {parts.map((v, i) => (
        <span className="cd-u" key={i}>
          <b>{String(v).padStart(2, "0")}</b>
          <small>{ui.units[i]}</small>
        </span>
      ))}
    </span>
  );
}
