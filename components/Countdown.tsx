"use client";
// Đếm ngược tới lúc chương mới ra đủ: mốc "release" của chương đang mở dần, hoặc 23:59 Chủ nhật.
import { useEffect, useState } from "react";
import { RELEASE, UI } from "@/lib/ui";
import type { Lang } from "@/lib/content";

function nextRelease(now: Date) {
  // Tính theo giờ Việt Nam: dời đồng hồ +7 giờ, tìm Chủ nhật 23:59 kế tiếp, rồi dời lại
  const off = RELEASE.utcOffset * 3600_000;
  const v = new Date(now.getTime() + off);
  let t = Date.UTC(v.getUTCFullYear(), v.getUTCMonth(), v.getUTCDate(), RELEASE.hour, RELEASE.minute);
  t += ((RELEASE.weekday - v.getUTCDay() + 7) % 7) * 86400_000;
  if (t <= v.getTime()) t += 7 * 86400_000;
  return new Date(t - off);
}

export default function Countdown({ lang, target }: { lang: Lang; target?: string }) {
  const ui = UI[lang];
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const t = target && new Date(target) > now ? new Date(target) : nextRelease(now);
      setLeft(t.getTime() - now.getTime());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

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
