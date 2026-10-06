import Link from "next/link";
import { LINKEDIN_URL, content } from "@/lib/content";
import { chapterPath, type ReadLang } from "@/lib/chapters";
import { PATHS } from "@/lib/site";
import type { Quote } from "@/lib/quotes";
import { ArrowIcon } from "./Icons";
import AuthorLink from "./AuthorLink";

const T = {
  vi: { k: "Câu đáng nhớ", read: (n: number) => `Đọc chương ${n}`, sub: "Đăng ký bản tin trên LinkedIn", ch: "Chương" },
  en: { k: "Lines worth keeping", read: (n: number) => `Read Chapter ${n}`, sub: "Subscribe on LinkedIn", ch: "Chapter" },
  es: { k: "Frases para recordar", read: (n: number) => `Leer el capítulo ${n}`, sub: "Suscribirse en LinkedIn", ch: "Capítulo" },
} as const;

export default function QuotePage({ lang, q }: { lang: ReadLang; q: Quote }) {
  const t = T[lang];
  const c = content[lang];
  return (
    <>
      <nav className="wrap reader-bar">
        <Link href={PATHS[lang]} className="back">
          ← {c.title}
        </Link>
      </nav>
      <main className="wrap quote-page">
        <div className="eyebrow">
          {t.k} · {t.ch} {q.n} – {q.chapterTitle}
        </div>
        <blockquote>“{q.text}”</blockquote>
        <div className="row">
          <Link className="btn primary" href={chapterPath(lang, q.n)}>
            {t.read(q.n)} →
          </Link>
          <a className="btn ghost" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
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
