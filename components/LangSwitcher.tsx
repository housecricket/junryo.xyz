"use client";
import { useEffect } from "react";
import Link from "next/link";
import { LANGS, type Lang } from "@/lib/content";
import { PATHS } from "@/lib/site";
import { Flag } from "./Icons";

// LANGS chỉ gồm các bản công khai: bản tiếng Nhật, tiếng Trung (ẩn) không có cờ. Trên trang /ja/, /zh/ vẫn hiện cờ để quay về bản khác.
const NAMES: Record<Lang, string> = { vi: "Tiếng Việt", en: "English", es: "Español", ja: "日本語", zh: "简体中文" };

/** Ghi nhớ ngôn ngữ người đọc tự chọn, để trang chủ không tự chuyển nữa */
function remember(l: Lang) {
  try {
    localStorage.setItem("mptcl:lang", l);
  } catch {}
}

export default function LangSwitcher({ current }: { current: Lang }) {
  // Trang chủ luôn nền trắng; đọc đêm chỉ dùng trong trang chương
  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
  }, []);
  return (
    <nav className="wrap lang" aria-label="Ngôn ngữ / Language / Idioma">
      <div role="group">
        {LANGS.map((l) => (
          <Link
            key={l}
            href={PATHS[l]}
            hrefLang={l}
            title={NAMES[l]}
            aria-label={NAMES[l]}
            aria-current={l === current ? "page" : undefined}
            className="lang-btn"
            onClick={() => remember(l)}
          >
            <Flag lang={l} />
          </Link>
        ))}
      </div>
    </nav>
  );
}
