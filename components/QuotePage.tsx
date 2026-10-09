import Link from "next/link";
import { LINKEDIN_URL, content } from "@/lib/content";
import { chapterPath, notebookPath } from "@/lib/chapters";
import { PATHS, SITE_URL } from "@/lib/site";
import { quotePath, type QuoteDetail, type QuoteLang } from "@/lib/quotes";
import { ArrowIcon } from "./Icons";
import AuthorLink from "./AuthorLink";
import Html from "./Html";
import ShareQuote from "./ShareQuote";

const T = {
  vi: {
    k: "Sổ tay của Thắng Tất",
    ch: "Chương",
    read: (n: number) => `Đọc chương ${n}`,
    story: "Câu chuyện phía sau",
    open: "Mở đầu chương",
    th: "Góc lý thuyết",
    cont: "Đọc tiếp",
    more: (n: number) => `Cũng trong sổ tay chương ${n}`,
    share: "Chia sẻ lên LinkedIn",
    done: "Đã chép câu trích, dán vào bài đăng",
    prev: "Câu trước",
    next: "Câu sau",
    all: "Mở cả sổ tay",
    subH: "Mỗi tuần một chương mới",
    subP: "Câu chuyện về mười phần trăm công việc mà AI agent chưa làm thay được, ra mắt mỗi thứ Hai.",
    sub: "Đăng ký bản tin trên LinkedIn",
  },
  en: {
    k: "Thắng Tất’s Notebook",
    ch: "Chapter",
    read: (n: number) => `Read Chapter ${n}`,
    story: "The story behind it",
    open: "How the chapter opens",
    th: "Theory corner",
    cont: "Keep reading",
    more: (n: number) => `Also in the Chapter ${n} notebook`,
    share: "Share on LinkedIn",
    done: "Quote copied, paste it into your post",
    prev: "Previous",
    next: "Next",
    all: "Open the whole notebook",
    subH: "A new chapter every week",
    subP: "A story about the ten percent of work AI agents still can’t do for us, out every Monday.",
    sub: "Subscribe on LinkedIn",
  },
  es: {
    k: "Cuaderno de Thắng Tất",
    ch: "Capítulo",
    read: (n: number) => `Leer el capítulo ${n}`,
    story: "La historia detrás",
    open: "Así empieza el capítulo",
    th: "Rincón teórico",
    cont: "Seguir leyendo",
    more: (n: number) => `También en el cuaderno del capítulo ${n}`,
    share: "Compartir en LinkedIn",
    done: "Cita copiada, pégala en tu publicación",
    prev: "Anterior",
    next: "Siguiente",
    all: "Abrir el cuaderno completo",
    subH: "Un capítulo nuevo cada semana",
    subP: "Una historia sobre el diez por ciento del trabajo que los agentes de IA aún no pueden hacer por nosotros. Cada lunes.",
    sub: "Suscribirse en LinkedIn",
  },
} as const;

export default function QuotePage({ lang, q }: { lang: QuoteLang; q: QuoteDetail }) {
  const t = T[lang];
  const c = content[lang];
  const read = chapterPath(lang, q.n);
  return (
    <>
      <nav className="wrap reader-bar">
        <Link href={PATHS[lang]} className="back">
          ← {c.title}
        </Link>
      </nav>
      <main className="qp">
        {/* Câu trích + lời giải thích, cạnh tranh minh hoạ của chương */}
        <header className={q.art ? "wrap qp-hero has-art" : "wrap qp-hero"}>
          <div className="qp-text">
            <div className="eyebrow">
              {t.k} · {t.ch} {q.n} – {q.chapterTitle}
            </div>
            <blockquote>“{q.text}”</blockquote>
            {q.note && <Html as="p" className="qp-note" html={q.note} />}
            <div className="row">
              <Link className="btn primary" href={read}>
                {t.read(q.n)} →
              </Link>
              <ShareQuote text={q.text} source={`${c.title} · ${t.ch} ${q.n}`} path={quotePath(lang, q.slug)} siteUrl={SITE_URL} label={t.share} done={t.done} />
            </div>
          </div>
          {q.art && (
            <figure className="qp-fig">
              <img src={q.art.src} alt={q.art.alt} />
              <figcaption>{q.art.alt}</figcaption>
            </figure>
          )}
        </header>

        {/* Chương này kể chuyện gì */}
        {(q.hook || q.desc) && (
          <section className="wrap qp-story">
            <div className="eyebrow">{t.story}</div>
            <h2>
              {t.ch} {q.n} – {q.chapterTitle}
            </h2>
            {q.hook && <Html as="p" className="hook" html={q.hook} />}
            {q.desc && <Html as="p" html={q.desc} />}
            {c.th[q.n - 1] && (
              <p className="qp-th">
                <span>{t.th}</span>
                <Html html={c.th[q.n - 1]} />
              </p>
            )}
            {q.excerpt.length > 0 && (
              <figure className="qp-open">
                <figcaption>{t.open}</figcaption>
                {q.excerpt.map((h, k) => (
                  <Html key={k} as="p" html={h} />
                ))}
                <Link className="more-link" href={read}>
                  {t.cont} →
                </Link>
              </figure>
            )}
            {q.excerpt.length === 0 && (
              <Link className="more-link" href={read}>
                {t.read(q.n)} →
              </Link>
            )}
          </section>
        )}

        {/* Các câu khác trong cùng chương */}
        {q.siblings.length > 0 && (
          <section className="wrap qp-more">
            <div className="eyebrow">{t.more(q.n)}</div>
            <ul>
              {q.siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={quotePath(lang, s.slug)}>“{s.text}”</Link>
                </li>
              ))}
            </ul>
            <Link className="more-link" href={notebookPath(lang)}>
              {t.all} →
            </Link>
          </section>
        )}

        {/* Câu trước / câu sau */}
        <nav className="wrap qp-pager">
          {q.prev ? (
            <Link href={quotePath(lang, q.prev.slug)} className="prev">
              <span>← {t.prev}</span>“{q.prev.text}”
            </Link>
          ) : (
            <span />
          )}
          {q.next && (
            <Link href={quotePath(lang, q.next.slug)} className="next">
              <span>{t.next} →</span>“{q.next.text}”
            </Link>
          )}
        </nav>

        <section className="wrap">
          <div className="qp-sub">
            <div>
              <h2>{t.subH}</h2>
              <p>{t.subP}</p>
            </div>
            <a className="btn primary" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              {t.sub} <ArrowIcon />
            </a>
          </div>
        </section>
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
