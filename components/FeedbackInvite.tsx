import type { AnyLang } from "@/lib/paths";
import { FEEDBACK_URL } from "@/lib/content";

const TEXT: Record<AnyLang, { k: string; h: string; p: string; b: string; n: string }> = {
  vi: { k: "Gửi tác giả", h: "Chương này gợi cho bạn điều gì?", p: "Một dòng thôi cũng được. Tôi đọc hết từng lời gửi về, và nếu bạn đồng ý, vài lời có thể sẽ được in trong sách.", b: "Viết vài dòng", n: "Chưa đến một phút · Không cần đăng nhập" },
  en: { k: "Write to the author", h: "What did this chapter bring to mind?", p: "One line is enough. I read every note, and with your permission, a few may appear in the printed book.", b: "Write a few lines", n: "Under a minute · No sign-in needed" },
  es: { k: "Escríbele al autor", h: "¿Qué te hizo pensar este capítulo?", p: "Basta con una línea. Leo cada mensaje y, si me das permiso, algunos podrían aparecer en el libro impreso.", b: "Escribir unas líneas", n: "Menos de un minuto · Sin registrarte" },
  ja: { k: "著者へのメッセージ", h: "この章で、何を思い浮かべましたか？", p: "一行だけでも構いません。届いた言葉はすべて読んでいます。許可をいただければ、本に掲載させていただくこともあります。", b: "ひとこと書く", n: "1分もかかりません・登録不要" },
  zh: { k: "写给作者", h: "这一章让你想到了什么？", p: "一句话就够了。每一条我都会读。如果你同意，其中一些可能会印进书里。", b: "写几句话", n: "不到一分钟 · 无需登录" },
};

export default function FeedbackInvite({ lang, n }: { lang: AnyLang; n: number }) {
  if (!FEEDBACK_URL) return null;
  const t = TEXT[lang];
  const sep = FEEDBACK_URL.includes("?") ? "&" : "?";
  const href = `${FEEDBACK_URL}${sep}chapter=${n}&lang=${lang}`;
  return (
    <div className="wrap fb-outer">
      <aside className="fb" aria-label={t.k}>
        <div className="fb-q" aria-hidden="true">“</div>
        <div className="fb-body">
          <div className="eyebrow">{t.k}</div>
          <h3>{t.h}</h3>
          <p>{t.p}</p>
          <div className="fb-row">
            <a className="btn ghost" href={href} target="_blank" rel="noopener noreferrer">{t.b} →</a>
            <span className="fb-note">{t.n}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
