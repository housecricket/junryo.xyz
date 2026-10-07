import Link from "next/link";
import { NOTE_URL, WECHAT_URL, content, followUrl } from "@/lib/content";
import { chapterPath, notebook, type ReadLang } from "@/lib/chapters";
import { PATHS } from "@/lib/site";
import { isCJK, jaCh } from "@/lib/ui";
import { ArrowIcon } from "./Icons";
import AuthorLink from "./AuthorLink";

export const NB_T = {
  vi: {
    k: "Phụ lục mở",
    h: "Sổ tay của Thắng Tất",
    p: "Những điều Thắng Tất ghi lại sau mỗi chương, gom về một chỗ. Trang này dày thêm mỗi sáng thứ Hai, khi một chương mới đủ trang.",
    ch: "Chương",
    read: "Đọc chương",
    sub: "Đăng ký bản tin để nhận chương mới",
    count: (k: number) => `${k} điều đã ghi`,
  },
  en: {
    k: "An open appendix",
    h: "Thắng Tất’s Notebook",
    p: "Everything Thắng Tất wrote down at the end of each chapter, gathered in one place. This page grows every Monday, when a new chapter is complete.",
    ch: "Chapter",
    read: "Read the chapter",
    sub: "Subscribe for new chapters",
    count: (k: number) => `${k} lessons so far`,
  },
  es: {
    k: "Un apéndice abierto",
    h: "Cuaderno de Thắng Tất",
    p: "Todo lo que Thắng Tất anotó al final de cada capítulo, reunido en un solo lugar. Esta página crece cada lunes, cuando un nuevo capítulo está completo.",
    ch: "Capítulo",
    read: "Leer el capítulo",
    sub: "Suscríbete para recibir los nuevos capítulos",
    count: (k: number) => `${k} lecciones hasta ahora`,
  },
  ja: {
    k: "読者のための付録",
    h: "タットの手帳",
    p: "各章の終わりにタットが書き留めたことを、一か所にまとめました。日本語版の章が増えるたびに、このページも少しずつ厚くなっていきます。",
    ch: "章",
    read: "この章を読む",
    sub: NOTE_URL ? "noteで新しい章を受け取る" : "note準備中・いまはLinkedInで購読",
    count: (k: number) => `書き留めたこと ${k}項目`,
  },
  zh: {
    k: "写给读者的附录",
    h: "胜必的笔记本",
    p: "胜必在每一章结尾记下的东西，都收在这一页里。中文版每多译出一章，这一页就会厚上一点。",
    ch: "章",
    read: "阅读本章",
    sub: WECHAT_URL ? "在微信公众号接收新章节" : "公众号筹备中·暂可在LinkedIn订阅",
    count: (k: number) => `已记下 ${k} 条`,
  },
} as const;

export default function NotebookPage({ lang }: { lang: ReadLang }) {
  const t = NB_T[lang];
  const c = content[lang];
  const entries = notebook(lang);
  const total = entries.reduce((a, e) => a + e.count, 0);
  return (
    <>
      <nav className="wrap reader-bar">
        <Link href={PATHS[lang]} className="back">
          ← {c.title}
        </Link>
      </nav>
      <main className="wrap notebook-page">
        <div className="eyebrow">{t.k}</div>
        <h1>{t.h}</h1>
        <p className="lead">{t.p}</p>
        <p className="nb-count">{t.count(total)}</p>
        {entries.map((e) => (
          <section className="nb-ch" key={e.n}>
            <div className="nb-head">
              <span className="nb-n">{isCJK(lang) ? jaCh(e.n) : <>{t.ch} {e.n}</>}</span>
              <Link href={chapterPath(lang, e.n)} className="nb-t">
                {e.title}
              </Link>
            </div>
            <div className="nb-body" dangerouslySetInnerHTML={{ __html: e.html }} />
          </section>
        ))}
        <div className="row">
          <a className="btn primary" href={followUrl(lang)} target="_blank" rel="noopener noreferrer">
            {t.sub} <ArrowIcon />
          </a>
        </div>
      </main>
      <footer className="reader-foot">
        <div className="wrap">
          <AuthorLink />
          <span>{c.ft}</span>
        </div>
      </footer>
    </>
  );
}
