import Link from "next/link";
import { AMAZON_URL, JA_FOLLOW, NOTE_URL, WECHAT_URL, ZH_FOLLOW, content, followUrl, isHidden } from "@/lib/content";
import { AVAILABLE, chapterPath, draftNumber, loadChapter, pdfUrl, type Chapter, type ReadLang } from "@/lib/chapters";
import { ProgressMeter } from "./WritingStatus";
import { PATHS, SITE_URL } from "@/lib/site";
import { UI as UIX, isCJK, jaCh } from "@/lib/ui";
import Countdown from "./Countdown";
import SubscriberCount from "./SubscriberCount";
import { countAt } from "@/lib/subscribers";
import { buildNow } from "@/lib/schedule";
import Quotes from "./Quotes";
import { quotePath } from "@/lib/quotes";
import ReadingAids from "./ReadingAids";
import ThemeToggle from "./ThemeToggle";
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
    soonP: "Chương mới lên LinkedIn mỗi tuần. Đăng ký để nhận ngay khi có, hoặc đặt trước sách trên Amazon (phát hành 31/12/2026).",
    sub: "Đăng ký trên LinkedIn",
    buy: "Đặt trước trên Amazon",
    transP: "",
    readVi: (n: number, _l?: ReadLang) => `Đọc chương ${n} →`,
  },
  en: {
    contents: "Contents",
    chapter: "Chapter",
    pdf: "Download PDF",
    prev: "Previous chapter",
    next: "Next chapter",
    soonK: "Coming soon",
    soonP: "A new chapter lands on LinkedIn every week. Subscribe to get it first, or pre-order the book on Amazon (out December 31, 2026).",
    sub: "Subscribe on LinkedIn",
    buy: "Pre-order on Amazon",
    transP: "The English translation is on its way. The Vietnamese original is already out.",
    readVi: (n: number, _l?: ReadLang) => `Read Chapter ${n} in Vietnamese →`,
  },
  es: {
    contents: "Índice",
    chapter: "Capítulo",
    pdf: "Descargar PDF",
    prev: "Capítulo anterior",
    next: "Capítulo siguiente",
    soonK: "Próximamente",
    soonP: "Cada semana llega un capítulo nuevo a LinkedIn. Suscríbete para leerlo primero, o reserva el libro en Amazon (sale el 31 de diciembre de 2026).",
    sub: "Suscribirse en LinkedIn",
    buy: "Reservar en Amazon",
    transP: "La traducción al español está en camino. El original en vietnamita ya está publicado.",
    readVi: (n: number, _l?: ReadLang) => `Leer el capítulo ${n} en vietnamita →`,
  },
  ja: {
    contents: "目次",
    chapter: "章",
    pdf: "PDFをダウンロード",
    prev: "前の章",
    next: "次の章",
    soonK: "近日公開",
    soonP: NOTE_URL
      ? "新しい章はnoteでお知らせします。英語版の本は2026年12月31日発売、Amazonで予約できます。"
      : "日本語版の連載はnoteで準備中です。それまではLinkedInのニュースレターで、英語版とベトナム語の原書の新しい章をお届けします。",
    sub: JA_FOLLOW,
    buy: "英語版をAmazonで予約",
    transP: "日本語訳は準備中です。続きはひと足先に、ほかの言語版で読めます。",
    readVi: (n: number, l?: ReadLang) => (l === "en" ? `第${n}章を英語版で読む →` : `第${n}章をベトナム語の原書で読む →`),
  },
  zh: {
    contents: "目录",
    chapter: "章",
    pdf: "下载PDF",
    prev: "上一章",
    next: "下一章",
    soonK: "即将推出",
    soonP: WECHAT_URL
      ? "新章节会在微信公众号上第一时间发布。英文版图书将于2026年12月31日出版，可在Amazon预订。"
      : "中文版的微信公众号正在筹备中。在此之前，LinkedIn通讯会推送英文版和越南文原版的新章节。",
    sub: ZH_FOLLOW,
    buy: "在Amazon预订英文版",
    transP: "中文版正在翻译中。后续章节可以先读其他语言的版本。",
    readVi: (n: number, l?: ReadLang) => (l === "en" ? `阅读第${n}章英文版 →` : `阅读第${n}章越南文原版 →`),
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
  const dLang: ReadLang = draftNumber(lang) ? lang : "vi";
  const dn = draftNumber(dLang);
  const dInfo = dn ? loadChapter(dLang, dn).draft : null;
  const next = i < list.length - 1 ? list[i + 1] : null;
  const pdf = pdfUrl(lang, chapter.n);
  const home = PATHS[lang];
  const x = UIX[lang];
  const subs0 = countAt(buildNow());
  // Bản ẩn (ja, zh): nút theo dõi trỏ tới note / WeChat (chưa có thì LinkedIn), không hiện số người đăng ký LinkedIn
  const cjk = isCJK(lang); // ja, zh: số chương 第N章, không hiện số người đăng ký
  const hidden = isHidden(lang);
  const follow = followUrl(lang);
  /** "Chương 3" / 「第3章」 */
  const chN = (k: number) => (cjk ? jaCh(k) : <>{t.chapter} {k}</>);
  // Chương kế chưa dịch: bản tiếng Nhật, tiếng Trung mở bản tiếng Anh nếu có, các bản khác giữ như cũ (tiếng Việt)
  const altFor = (k: number): ReadLang => (hidden && AVAILABLE.en.includes(k) ? "en" : "vi");

  return (
    <>
      <nav className="wrap reader-bar" aria-label={t.contents}>
        <Link href={`${home}#muc-luc`} className="back">
          ← {t.contents}
        </Link>
        <span className="right">
          <Link href={home} className="brand">
            {c.title}
          </Link>
          <ThemeToggle lang={lang} />
        </span>
      </nav>

      <TranslationNotice
        reading={lang}
        n={chapter.n}
        have={(["vi", "en", "es", "ja", "zh"] as ReadLang[]).filter((l) => AVAILABLE[l].includes(chapter.n))}
      />

      <header className="reader-head wrap">
        <div className="eyebrow">
          {c[partOf(chapter.n)]}
          {isDraft && <span className="draft-tag">{x.writing}</span>}
        </div>
        <div className="chap-n">{chN(chapter.n)}</div>
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
            {!cjk && <SubscriberCount lang={lang} initial={subs0} />}
            <p className="desc small">{t.soonP}</p>
            <div className="row">
              <a className="btn primary" href={follow} {...ext}>
                {t.sub} <ArrowIcon />
              </a>
              <a className="btn ghost" href={AMAZON_URL} {...ext}>
                {t.buy} <ArrowIcon />
              </a>
            </div>
          </section>
        </div>
      )}

      {!isDraft && (
        <Quotes
          lang={lang}
          quotes={chapter.quotes.map((text, k) => ({
            text,
            // Bản tiếng Nhật, tiếng Trung không có trang câu trích: chia sẻ link chương
            path: lang === "ja" || lang === "zh" ? chapterPath(lang, chapter.n) : quotePath(lang, `${chapter.n}-${k + 1}`),
          }))}
          source={
            lang === "zh" ? `《${c.title}》${jaCh(chapter.n)}` : cjk ? `『${c.title}』${jaCh(chapter.n)}` : `${c.title} · ${t.chapter} ${chapter.n}`
          }
          siteUrl={SITE_URL}
        />
      )}

      {/* Chương kế tiếp: đã có thì mời đọc tiếp, chưa có thì "Tuần sau" + đếm ngược */}
      {(() => {
        const tz = chapter.teaser;
        const nn = tz?.n ?? chapter.n + 1;
        const nTitle = tz?.title ?? c.c[chapter.n];
        if (chapter.n >= 20 || isDraft) return null;
        const draftHere = !next && dn === nn && dInfo;
        return (
          <div className="wrap tz-outer">
          <section className={`teaser${next ? "" : " soon"}`}>
            <div className="eyebrow">{next || (lang !== "vi" && !AVAILABLE[lang].includes(nn) && AVAILABLE.vi.includes(nn)) ? x.nextK : draftHere ? x.thisWeek : x.weekK}</div>
            <div className="tz-n">{chN(nn)}</div>
            <h2>{nTitle}</h2>
            {tz?.hook && <p className="hook" dangerouslySetInnerHTML={{ __html: tz.hook }} />}
            {tz?.desc && <p className="desc" dangerouslySetInnerHTML={{ __html: tz.desc }} />}
            {next ? (
              <div className="row">
                <Link className="btn primary" href={chapterPath(lang, next)}>
                  {x.readN(next)} →
                </Link>
              </div>
            ) : lang !== "vi" && !AVAILABLE[lang].includes(nn) && AVAILABLE.vi.includes(nn) ? (
              <>
                <p className="desc small">{t.transP}</p>
                <div className="row">
                  <Link className="btn primary" href={hidden ? `${chapterPath(altFor(nn), nn)}#from-${lang}` : chapterPath("vi", nn)}>
                    {t.readVi(nn, altFor(nn))}
                  </Link>
                  <a className="btn ghost" href={follow} {...ext}>
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
                    <Link className="lnk" href={chapterPath(dLang, nn)}>
                      {x.readDraft} →
                    </Link>
                  </div>
                )}
                <Countdown lang={lang} target={chapter.draft?.release ?? dInfo?.release} />
                {!cjk && <SubscriberCount lang={lang} initial={subs0} />}
                <p className="desc small">{t.soonP}</p>
                <div className="row">
                  <a className="btn primary" href={follow} {...ext}>
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
              {cjk ? `${jaCh(prev)}\u3000${c.c[prev - 1]}` : <>{t.chapter} {prev} · {c.c[prev - 1]}</>}
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
