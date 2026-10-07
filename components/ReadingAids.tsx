"use client";
// Thanh tiến độ đọc, thanh mời đăng ký khi đọc quá nửa chương, và ghi nhớ chương đã đọc.
import { useEffect, useState } from "react";
import { AMAZON_URL, followUrl, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { track } from "@/lib/analytics";

const KEY_READ = "mptcl:read";
const KEY_HIDE = "mptcl:bar-hidden";

export function getRead(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_READ) || "[]");
  } catch {
    return [];
  }
}

export default function ReadingAids({ lang, n, buyLabel, subLabel }: { lang: Lang; n: number; buyLabel: string; subLabel: string }) {
  const ui = UI[lang];
  const [p, setP] = useState(0);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let dismissed = false;
    const sent = new Set<number>();
    try {
      dismissed = sessionStorage.getItem(KEY_HIDE) === "1";
    } catch {}
    const art = document.querySelector<HTMLElement>(".reader");
    const onScroll = () => {
      if (!art) return;
      const r = art.getBoundingClientRect();
      const total = art.offsetHeight - window.innerHeight * 0.6;
      const v = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
      setP(v);
      if (!dismissed) setHidden(v < 0.5 || v > 0.98);
      // Ghi nhận người đọc đã đọc tới 25% / 50% / 90% chương
      for (const m of [25, 50, 90]) {
        if (v * 100 >= m && !sent.has(m)) {
          sent.add(m);
          track("read_progress", { chapter: n, percent: m, lang });
        }
      }
      if (v > 0.9) {
        const read = getRead();
        if (!read.includes(n)) {
          try {
            localStorage.setItem(KEY_READ, JSON.stringify([...read, n]));
          } catch {}
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [n, lang]);

  const close = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(KEY_HIDE, "1");
    } catch {}
  };

  return (
    <>
      <div className="progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${p})` }} />
      </div>
      <div className="sticky-cta" hidden={hidden} role="complementary">
        <div className="wrap in">
          <p>{ui.barText}</p>
          <div className="act">
            <a className="btn primary" href={followUrl(lang)} target="_blank" rel="noopener noreferrer">
              {subLabel}
            </a>
            <a className="btn ghostw" href={AMAZON_URL} target="_blank" rel="noopener noreferrer">
              {buyLabel}
            </a>
            <button type="button" className="x" onClick={close} aria-label={ui.close}>
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/** Đánh dấu chương đã đọc trong mục lục (đọc từ trình duyệt của người xem) */
export function ReadMarks({ label }: { label: string }) {
  useEffect(() => {
    getRead().forEach((n) => {
      const li = document.querySelector(`.part li[data-ch="${n}"]`);
      if (li) {
        li.classList.add("is-read");
        li.querySelector(".n")?.setAttribute("title", label);
      }
    });
  }, [label]);
  return null;
}
