"use client";
// Hiện số người đăng ký, tự kiểm tra mỗi phút và nhảy số khi có người mới.
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { countAt } from "@/lib/subscribers";
import { UI } from "@/lib/ui";

const LOCALE = { vi: "vi-VN", en: "en-US", es: "es-ES", ja: "ja-JP", zh: "zh-CN" } as const;

export default function SubscriberCount({ lang, initial, variant = "plain" }: { lang: Lang; initial: number; variant?: "plain" | "pill" }) {
  const [n, setN] = useState(initial);
  const [bump, setBump] = useState(false);
  const last = useRef(initial);

  useEffect(() => {
    const tick = () => {
      const v = countAt(new Date());
      if (v !== last.current) {
        if (v > last.current) {
          setBump(true);
          setTimeout(() => setBump(false), 900);
        }
        last.current = v;
        setN(v);
      }
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`subs subs-${variant}${bump ? " bump" : ""}`} aria-live="polite">
      <b>{n.toLocaleString(LOCALE[lang])}</b> {UI[lang].subs}
    </span>
  );
}
