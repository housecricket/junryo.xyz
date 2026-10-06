import Link from "next/link";
import { AMAZON_URL, LINKEDIN_URL, content } from "@/lib/content";
import { AVAILABLE, chapterPath, pdfUrl, type Chapter, type ReadLang } from "@/lib/chapters";
import { PATHS } from "@/lib/site";
import { ArrowIcon } from "./Icons";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

const UI = {
  vi: {
    contents: "Mục lục",
    chapter: "Chương",
    pdf: "Tải bản PDF",
    prev: "Chương trước",
    next: "Chương sau",
    soonK: "Sắp ra mắt",
    soonP: "Chương mới lên LinkedIn mỗi tuần. Đăng ký để nhận ngay khi có, hoặc đặt mua sách trên Amazon.",
    sub: "Đăng ký trên LinkedIn",
    buy: "Đặt mua trên Amazon",
  },
  en: {
    contents: "Contents",
    chapter: "Chapter",
    pdf: "Download PDF",
    prev: "Previous chapter",
    next: "Next chapter",
    soonK: "Coming soon",
    soonP: "A new chapter lands on LinkedIn every week. Subscribe to get it first, or get the book on Amazon.",
    sub: "Subscribe on LinkedIn",
    buy: "Buy on Amazon",
  },
} as const;

function partOf(n: number) {
  return n <= 4 ? "p1" : n <= 9 ? "p2" : "p3";
}

export default function ChapterReader({ lang, chapter }: { lang: ReadLang; chapter: Chapter }) {
  const t = UI[lang];
  const c = content[lang];
  const list = AVAILABLE[lang];
  const i = list.indexOf(chapter.n);
  const prev = i > 0 ? list[i - 1] : null;
  const next = i < list.length - 1 ? list[i + 1] : null;
  const pdf = pdfUrl(lang, chapter.n);
  const home = PATHS[lang];

  return (
    <>
      <nav className="wrap reader-bar" aria-label={t.contents}>
        <Link href={`${home}#muc-luc`} className="back">
          ← {t.contents}
        </Link>
        <Link href={home} className="brand">
          {c.title}
        </Link>
      </nav>

      <header className="reader-head wrap">
        <div className="eyebrow">{c[partOf(chapter.n)]}</div>
        <div className="chap-n">
          {t.chapter} {chapter.n}
        </div>
        <h1>{chapter.title}</h1>
        <div className="rule" aria-hidden="true" />
        {pdf && (
          <a className="btn ghost pdf" href={pdf} {...ext}>
            {t.pdf} <ArrowIcon />
          </a>
        )}
      </header>

      <article className="reader wrap" dangerouslySetInnerHTML={{ __html: chapter.html }} />

      <nav className="wrap pager" aria-label={`${t.prev} / ${t.next}`}>
        {prev ? (
          <Link className="pg prev" href={chapterPath(lang, prev)}>
            <span className="k">← {t.prev}</span>
            <span className="v">
              {t.chapter} {prev} · {c.c[prev - 1]}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pg next" href={chapterPath(lang, next)}>
            <span className="k">{t.next} →</span>
            <span className="v">
              {t.chapter} {next} · {c.c[next - 1]}
            </span>
          </Link>
        ) : chapter.n < 14 ? (
          <div className="pg soon">
            <span className="k">{t.soonK}</span>
            <span className="v">
              {t.chapter} {chapter.n + 1} · {c.c[chapter.n]}
            </span>
            <p>{t.soonP}</p>
            <div className="row">
              <a className="btn primary" href={LINKEDIN_URL} {...ext}>
                {t.sub} <ArrowIcon />
              </a>
              <a className="btn ghost" href={AMAZON_URL} {...ext}>
                {t.buy} <ArrowIcon />
              </a>
            </div>
          </div>
        ) : null}
      </nav>

      <footer className="reader-foot">
        <div className="wrap">
          <span>© 2026 · @dangtrunganh</span>
          <span>{c.ft}</span>
        </div>
      </footer>
    </>
  );
}
