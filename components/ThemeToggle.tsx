"use client";
// Nút chuyển chế độ đọc đêm / ban ngày. Lựa chọn lưu trong trình duyệt người đọc.
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/content";

const LABEL = {
  vi: { dark: "Bật chế độ đọc đêm", light: "Tắt chế độ đọc đêm" },
  en: { dark: "Switch to night mode", light: "Switch to day mode" },
  es: { dark: "Activar modo noche", light: "Activar modo día" },
} as const;

export default function ThemeToggle({ lang }: { lang: Lang }) {
  const [dark, setDark] = useState(false);
  // Vào trang chương: áp lại lựa chọn đọc đêm đã lưu
  useEffect(() => {
    let d = false;
    try {
      d = localStorage.getItem("mptcl:theme") === "dark";
    } catch {}
    if (d) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    setDark(d);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) document.documentElement.setAttribute("data-theme", "dark");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("mptcl:theme", next ? "dark" : "light");
    } catch {}
  };

  const label = dark ? LABEL[lang].light : LABEL[lang].dark;
  return (
    <button type="button" className="theme-btn" onClick={toggle} aria-label={label} title={label} aria-pressed={dark}>
      <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      </svg>
      <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
