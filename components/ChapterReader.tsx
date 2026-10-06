import Link from "next/link";
import { AMAZON_URL, LINKEDIN_URL, content } from "@/lib/content";
import { AVAILABLE, chapterPath, draftNumber, loadChapter, pdfUrl, type Chapter, type ReadLang } from "@/lib/chapters";
import { ProgressMeter } from "./WritingStatus";
import { PATHS, SITE_URL } from "@/lib/site";
import { UI as UIX } from "@/lib/ui";
import Countdown from "./Countdown";
import SubscriberCount from "./SubscriberCount";
import { countAt } from "@/lib/subscribers";
import { buildNow } from "@/lib/schedule";
import Quotes from "./Quotes";
import ReadingAids from "./ReadingAids";
import TranslationNotice from "./TranslationNotice";
import AuthorLink from "./AuthorLink";
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
  const isDraft = !!chapter.draft;
  const prev = isDraft ? list[list.length - 1] ?? null : i > 0 ? list[i - 1] : null;
  // Chương đang viết (bản tiếng Việt) để mời đọc trước từ thẻ "Tuần sau"
  const dn = draftNumber("vi");
  const dInfo = dn ? loadChapter("vi", dn).draft : null;
  const next = i < list.length - 1 ? list[i + 1] : null;
  const pdf = pdfUrl(lang, chapter.n);
  const home = PATHS[lang];
  const x = UIX[lang];
  const subs0 = countAt(buildNow());

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

      {lang === "vi" && <TranslationNotice />}

      <header className="reader-head wrap">
        <div className="eyebrow">
          {c[partOf(chapter.n)]}
          {isDraft && <span className="draft-tag">{x.writing}</span>}
        </div>
        <div className="chap-n">
          {t.chapter} {chapter.n}
        </div>
        <h1>{chapter.title}</h1>
        <div className="rule" aria-hidden="true" />
        {isDraft && chapter.draft && (
          <>
            <p className="draft-note">{x.draftNote}</p>
          </>
        )}
        {pdf && !isDraft && (
          <a className="btn ghost pdf" href={pdf} {...ext}>
            {t.pdf} <ArrowIcon />
          </a>
        )}
      </header>

      <article className={`reader wrap${isDraft ? " is-draft" : ""}`} dangerouslySetInnerHTML={{ __html: chapter.html }} />

      {isDraft && chapter.draft && (
        <div className="wrap tz-outer">
          <section className="teaser draft-end">
            <div className="eyebrow">{x.writing}</div>
            <h2>{x.reachedEnd}</h2>
            <div className="tz-draft">
              <ProgressMeter percent={chapter.draft.percent} label={x.writing} />
            </div>
            <Countdown lang={lang} target={chapter.draft?.release ?? dInfo?.release} />
            <SubscriberCount lang={lang} initial={subs0} />
            <p className="desc small">{t.soonP}</p>
            <div className="row">
              <a className="btn primary" href={LINKEDIN_URL} {...ext}>
                {t.sub} <ArrowIcon />
              </a>
              <a className="btn ghost" href={AMAZON_URL} {...ext}>
                {t.buy} <ArrowIcon />
              </a>
            </div>
          </section>
        </div>
      )}

      {!isDraft && <Quotes
        lang={lang}
        quotes={chapter.quotes}
        url={SITE_URL + chapterPath(lang, chapter.n)}
        source={`${c.title} · ${t.chapter} ${chapter.n}`}
      />}

      {/* Chương kế tiếp: đã có thì mời đọc tiếp, chưa có thì "Tuần sau" + đếm ngược */}
      {(() => {
        const tz = chapter.teaser;
        const nn = tz?.n ?? chapter.n + 1;
        const nTitle = tz?.title ?? c.c[chapter.n];
        if (chapter.n >= 14 || isDraft) return null;
        const draftHere = !next && dn === nn && dInfo;
        return (
          <div className="wrap tz-outer">
          <section className={`teaser${next ? "" : " soon"}`}>
            <div className="eyebrow">{next || (lang === "en" && AVAILABLE.vi.includes(nn)) ? x.nextK : draftHere ? x.thisWeek : x.weekK}</div>
            <div className="tz-n">
              {t.chapter} {nn}
            </div>
            <h2>{nTitle}</h2>
            {tz?.hook && <p className="hook" dangerouslySetInnerHTML={{ __html: tz.hook }} />}
            {tz?.desc && <p className="desc" dangerouslySetInnerHTML={{ __html: tz.desc }} />}
            {next ? (
              <div className="row">
                <Link className="btn primary" href={chapterPath(lang, next)}>
                  {x.readN(next)} →
                </Link>
              </div>
            ) : lang === "en" && AVAILABLE.vi.includes(nn) ? (
              <>
                <p className="desc small">The English translation is on its way. The Vietnamese original is already out.</p>
                <div className="row">
                  <Link className="btn primary" href={chapterPath("vi", nn)}>
                    Read Chapter {nn} in Vietnamese →
                  </Link>
                  <a className="btn ghost" href={LINKEDIN_URL} {...ext}>
                    {t.sub} <ArrowIcon />
                  </a>
                </div>
              </>
            ) : (
              <>
                {draftHere && (
                  <div className="tz-draft">
                    <span className="k">{x.writing}</span>
                    <ProgressMeter percent={dInfo!.percent} label={x.writing} />
                    <Link className="lnk" href={chapterPath("vi", nn)}>
                      {x.readDraft} →
                    </Link>
                  </div>
                )}
                <Countdown lang={lang} target={chapter.draft?.release ?? dInfo?.release} />
                <SubscriberCount lang={lang} initial={subs0} />
                <p className="desc small">{t.soonP}</p>
                <div className="row">
                  <a className="btn primary" href={LINKEDIN_URL} {...ext}>
                    {t.sub} <ArrowIcon />
                  </a>
                  <a className="btn ghost" href={AMAZON_URL} {...ext}>
                    {t.buy} <ArrowIcon />
                  </a>
                </div>
              </>
            )}
          </section>
          </div>
        );
      })()}

      {prev && (
        <nav className="wrap pager" aria-label={t.prev}>
          <Link className="pg prev" href={chapterPath(lang, prev)}>
            <span className="k">← {t.prev}</span>
            <span className="v">
              {t.chapter} {prev} · {c.c[prev - 1]}
            </span>
          </Link>
        </nav>
      )}

      <ReadingAids lang={lang} n={chapter.n} buyLabel={t.buy} subLabel={t.sub} />

      <footer className="reader-foot">
        <div className="wrap">
          <AuthorLink />
          <span>{c.ft}</span>
        </div>
      </footer>
    </>
  );
}
