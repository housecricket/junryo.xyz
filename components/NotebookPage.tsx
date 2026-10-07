import Link from "next/link";
import { LINKEDIN_URL, content } from "@/lib/content";
import { chapterPath, notebook, type ReadLang } from "@/lib/chapters";
import { PATHS } from "@/lib/site";
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
              <span className="nb-n">
                {t.ch} {e.n}
              </span>
              <Link href={chapterPath(lang, e.n)} className="nb-t">
                {e.title}
              </Link>
            </div>
            <div className="nb-body" dangerouslySetInnerHTML={{ __html: e.html }} />
          </section>
        ))}
        <div className="row">
          <a className="btn primary" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
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
