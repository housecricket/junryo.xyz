"use client";
// Khi người đọc bản EN/ES/JA/ZH mở một chương chưa dịch sang ngôn ngữ của họ (link có #from-en / #from-es / #from-ja / #from-zh),
// hiện một dòng báo bằng ngôn ngữ của họ.
//   Trang tiếng Việt (reading="vi"): đón người đọc từ bản EN, ES, JA, ZH
//   Trang tiếng Anh  (reading="en"): chỉ đón người đọc bản tiếng Nhật, tiếng Trung (hai bản này ưu tiên mở bản tiếng Anh)
import { useEffect, useState } from "react";
import { followUrl } from "@/lib/content";
import { BASE_PATH } from "@/lib/site";
import { Flag } from "./Icons";

type From = "en" | "es" | "ja" | "zh";
type Reading = "vi" | "en";

const TEXT: Record<From, { msg: Partial<Record<Reading, string>>; back: string; sub: string; home: string }> = {
  en: {
    msg: { vi: "This chapter hasn’t been translated into English yet. You’re reading the Vietnamese original." },
    back: "Back to the English edition",
    sub: "Get notified when it’s translated",
    home: "/en/",
  },
  es: {
    msg: { vi: "Este capítulo aún no está traducido al español. Estás leyendo el original en vietnamita." },
    back: "Volver a la edición en español",
    sub: "Avísame cuando esté traducido",
    home: "/es/",
  },
  ja: {
    msg: {
      vi: "この章はまだ日本語に訳されていません。いまお読みいただいているのは、ベトナム語の原書です。",
      en: "この章はまだ日本語に訳されていません。いまお読みいただいているのは、英語版です。",
    },
    back: "日本語版に戻る",
    sub: "新しい章の知らせを受け取る",
    home: "/ja/",
  },
  zh: {
    msg: {
      vi: "本章还没有翻译成中文。你现在读的是越南文原版。",
      en: "本章还没有翻译成中文。你现在读的是英文版。",
    },
    back: "返回中文版",
    sub: "关注新章节更新",
    home: "/zh/",
  },
};

export default function TranslationNotice({ reading = "vi" }: { reading?: Reading }) {
  const [from, setFrom] = useState<From | null>(null);
  useEffect(() => {
    const f = window.location.hash.match(/^#from-(en|es|ja|zh)$/)?.[1] as From | undefined;
    if (f && TEXT[f].msg[reading]) setFrom(f);
  }, [reading]);
  if (!from) return null;
  const t = TEXT[from];
  return (
    <aside className="wrap translation-note" lang={from === "zh" ? "zh-CN" : from}>
      <div className="in">
        <Flag lang={reading} />
        <p>{t.msg[reading]}</p>
        <a href={`${BASE_PATH}${t.home}#muc-luc`}>← {t.back}</a>
        <a href={followUrl(from)} target="_blank" rel="noopener noreferrer">
          {t.sub} ↗
        </a>
      </div>
    </aside>
  );
}
