"use client";
// Mọi link mở chương bằng ngôn ngữ khác đều kèm #from-<ngôn ngữ đang xem>. Trang chương đọc dấu này và hiện một dòng báo bằng ngôn ngữ của người đọc:
//   - chương chưa dịch sang ngôn ngữ của họ: "chương này chưa dịch, bạn đang đọc bản …"
//   - chương đã có bằng ngôn ngữ của họ (họ tự chọn đọc bản khác): "bạn đang đọc chương này bằng …", kèm link về đúng chương ấy ở bản của họ
//   Trang tiếng Việt (reading="vi"): đón người đọc từ bản EN, ES, JA, ZH
//   Trang tiếng Anh  (reading="en"): chỉ đón người đọc bản tiếng Nhật, tiếng Trung (hai bản này ưu tiên mở bản tiếng Anh)
import { useEffect, useState } from "react";
import { followUrl } from "@/lib/content";
import { BASE_PATH } from "@/lib/site";
import { chapterPathOf, type AnyLang } from "@/lib/paths";
import { Flag } from "./Icons";

type From = AnyLang;
type Reading = AnyLang;

// Tên ngôn ngữ, viết bằng ngôn ngữ của người đọc
const NAME: Record<From, Partial<Record<Reading, string>>> = {
  vi: { en: "tiếng Anh", es: "tiếng Tây Ban Nha" },
  en: { vi: "Vietnamese (the original)", es: "Spanish" },
  es: { vi: "vietnamita (el original)", en: "inglés" },
  ja: { vi: "ベトナム語の原書", en: "英語版", es: "スペイン語版" },
  zh: { vi: "越南文原版", en: "英文版", es: "西班牙文版" },
};
const CHOSEN: Record<From, (name: string) => string> = {
  vi: (x) => `Bạn đang đọc chương này bằng ${x}.`,
  en: (x) => `You’re reading this chapter in ${x}.`,
  es: (x) => `Estás leyendo este capítulo en ${x}.`,
  ja: (x) => `この章を${x}で読んでいます。`,
  zh: (x) => `你正在读本章的${x}。`,
};

const TEXT: Record<From, { msg: Partial<Record<Reading, string>>; back: string; sub: string; home: string }> = {
  vi: { msg: {}, back: "Về bản tiếng Việt", sub: "", home: "/" },
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

export default function TranslationNotice({ reading = "vi", n, have = [] }: { reading?: Reading; n: number; have?: From[] }) {
  const [from, setFrom] = useState<From | null>(null);
  const haveKey = have.join(",");
  useEffect(() => {
    const f = window.location.hash.match(/^#from-(vi|en|es|ja|zh)$/)?.[1] as From | undefined;
    if (!f || f === reading) return;
    if (haveKey.split(",").includes(f) ? NAME[f][reading] : TEXT[f].msg[reading]) setFrom(f);
  }, [reading, haveKey]);
  if (!from) return null;
  const t = TEXT[from];
  const chosen = have.includes(from);
  if (chosen) {
    return (
      <aside className="wrap translation-note" lang={from === "zh" ? "zh-CN" : from}>
        <div className="in">
          <Flag lang={reading} />
          <p>{CHOSEN[from](NAME[from][reading] ?? "")}</p>
          <a href={`${BASE_PATH}${chapterPathOf(from, n)}`}>← {t.back}</a>
        </div>
      </aside>
    );
  }
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
