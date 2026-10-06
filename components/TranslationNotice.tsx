"use client";
// Khi người đọc bản EN/ES mở một chương chỉ có tiếng Việt (link có #from-en / #from-es),
// hiện một dòng báo bằng ngôn ngữ của họ.
import { useEffect, useState } from "react";
import { LINKEDIN_URL } from "@/lib/content";
import { BASE_PATH } from "@/lib/site";
import { Flag } from "./Icons";

const TEXT = {
  en: {
    msg: "This chapter hasn’t been translated into English yet. You’re reading the Vietnamese original.",
    back: "Back to the English edition",
    sub: "Get notified when it’s translated",
    home: "/en/",
  },
  es: {
    msg: "Este capítulo aún no está traducido al español. Estás leyendo el original en vietnamita.",
    back: "Volver a la edición en español",
    sub: "Avísame cuando esté traducido",
    home: "/es/",
  },
} as const;

export default function TranslationNotice() {
  const [from, setFrom] = useState<"en" | "es" | null>(null);
  useEffect(() => {
    const h = window.location.hash;
    if (h === "#from-en" || h === "#from-es") setFrom(h.slice(6) as "en" | "es");
  }, []);
  if (!from) return null;
  const t = TEXT[from];
  return (
    <aside className="wrap translation-note" lang={from}>
      <div className="in">
        <Flag lang="vi" />
        <p>{t.msg}</p>
        <a href={`${BASE_PATH}${t.home}#muc-luc`}>← {t.back}</a>
        <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          {t.sub} ↗
        </a>
      </div>
    </aside>
  );
}
