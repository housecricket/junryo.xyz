"use client";
// Tiến độ chương đang lên dần + trạng thái theo khung giờ trong lib/schedule.ts.
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { TZ_OFFSET_MIN, inWindow, nextWindowStart } from "@/lib/schedule";

export function ProgressMeter({ percent, label }: { percent: number; label?: string }) {
  return (
    <span className="meter" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span className="bar">
        <span style={{ width: `${percent}%` }} />
      </span>
      <b>{percent}%</b>
    </span>
  );
}

/** "18:30 hôm nay" / "6:30 ngày mai", theo giờ Việt Nam */
function when(lang: Lang, now: Date, t: Date) {
  const ui = UI[lang];
  const vnDay = (d: Date) => Math.floor((d.getTime() / 60000 + TZ_OFFSET_MIN) / 1440);
  const m = Math.round(t.getTime() / 60000 + TZ_OFFSET_MIN) % 1440;
  const hhmm = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
  return `${hhmm} ${vnDay(t) === vnDay(now) ? ui.today : ui.tomorrow}${ui.tz}`;
}

export default function WritingStatus({
  lang,
  percent,
  words,
  total,
  compact,
}: {
  lang: Lang;
  percent: number;
  words?: number;
  total?: number;
  compact?: boolean;
}) {
  const ui = UI[lang];
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const live = now !== null && inWindow(now);

  return (
    <div className={`wstatus${live ? " live" : ""}${compact ? " compact" : ""}`}>
      <ProgressMeter percent={percent} label={ui.writing} />
      <span className="state">
        <i className="pulse" aria-hidden="true" />
        {now === null ? ui.writing : live ? ui.live : ui.idle(when(lang, now, nextWindowStart(now)))}
      </span>
      {!compact && words !== undefined && total !== undefined && <span className="words">{ui.words(words, total)}</span>}
    </div>
  );
}
