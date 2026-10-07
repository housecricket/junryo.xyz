import { AMAZON_URL, content, followUrl, type Content, type Lang } from "@/lib/content";
import { COVERS } from "@/lib/site";
import Link from "next/link";
import { AVAILABLE, RELEASED, chapterPath, draftNumber, loadChapter, notebook, notebookPath, releasedCount, type ReadLang } from "@/lib/chapters";
import { SIDE_STORIES } from "@/lib/sidestories";
import BonusSignup from "./BonusSignup";
import { ProgressMeter } from "./WritingStatus";
import { UI, isCJK, jaCh } from "@/lib/ui";
import Countdown from "./Countdown";
import SubscriberCount from "./SubscriberCount";
import { countAt } from "@/lib/subscribers";
import { buildNow } from "@/lib/schedule";
import Html from "./Html";
import AuthorLink from "./AuthorLink";
import LangSwitcher from "./LangSwitcher";
import Portrait, { type Who } from "./Portrait";
import { ArrowIcon, BookIcon, ClockIcon, Flag, LegendDot, MailIcon, OpenBookIcon } from "./Icons";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// Bốn phần của mục lục: [khoá tiêu đề, số chương]
const PARTS = [
  ["p1", 4],
  ["p2", 5],
  ["p3", 6],
  ["p4", 5],
] as const;
const TOTAL_CHAPTERS = PARTS.reduce((a, [, n]) => a + n, 0);

function chapter(c: Content, i: number) {
  return { title: c.c[i], theory: c.th[i] };
}

/** Chương n mở bằng ngôn ngữ nào: ưu tiên ngôn ngữ đang xem, rồi tiếng Anh, rồi tiếng Việt */
function readTarget(lang: Lang, n: number): { href: string; in: ReadLang } | null {
  const order: ReadLang[] = lang === "vi" ? ["vi"] : lang === "en" ? ["en", "vi"] : lang === "ja" ? ["ja", "en", "vi"] : lang === "zh" ? ["zh", "en", "vi"] : ["es", "en", "vi"];
  for (const l of order) if (AVAILABLE[l].includes(n)) return { href: chapterPath(l, n), in: l };
  return null;
}

// Các bản công khai; bản ẩn (ja, zh) không bao giờ hiện trên mục lục của bản khác
const PUBLIC_LANGS: ReadLang[] = ["vi", "en", "es"];
/** Các ngôn ngữ khác (ngoài ngôn ngữ đang xem và ngôn ngữ của link chính) đã có trọn chương n */
function alsoIn(lang: Lang, n: number, exclude?: ReadLang): ReadLang[] {
  return PUBLIC_LANGS.filter((l) => l !== lang && l !== exclude && AVAILABLE[l].includes(n));
}
// Chú thích cho cờ nhỏ ở mục lục
const ALSO_LEGEND: Record<Lang, string> = {
  vi: "Đã có bằng ngôn ngữ khác",
  en: "Also available in",
  es: "También disponible en",
  ja: "ほかの言語でも読めます",
  zh: "也可以读其他语言版本",
};

const EXTRAS = {
  vi: { eb: "Ngoài các chương", nbh: "Sổ tay của Thắng Tất", nbp: (k: number, n: number) => `${k} điều Thắng Tất ghi lại sau ${n} chương đầu, gom về một trang. Dày thêm mỗi thứ Hai.`, nbb: "Mở sổ tay", sh: "Truyện bên lề", sp: "Quà riêng cho người đăng ký email: những câu chuyện ngoài các chương chính, không đăng trên web, không đăng trên LinkedIn.", sb: "" },
  en: { eb: "Beyond the chapters", nbh: "Thắng Tất’s Notebook", nbp: (k: number, n: number) => `${k} lessons Thắng Tất wrote down across the first ${n} chapters, gathered on one page. It grows every Monday.`, nbb: "Open the notebook", sh: "", sp: "", sb: "" },
  es: { eb: "Más allá de los capítulos", nbh: "Cuaderno de Thắng Tất", nbp: (k: number, n: number) => `${k} lecciones que Thắng Tất anotó en los primeros ${n} capítulos, reunidas en una página. Crece cada lunes.`, nbb: "Abrir el cuaderno", sh: "", sp: "", sb: "" },
  ja: { eb: "各章のほかに", nbh: "タットの手帳", nbp: (k: number, n: number) => `タットが第${n}章までに書き留めた${k}つのことを、一ページにまとめました。日本語版の章が増えるたびに書き足されます。`, nbb: "手帳を開く", sh: "", sp: "", sb: "" },
  zh: { eb: "章节之外", nbh: "胜必的笔记本", nbp: (k: number, n: number) => `胜必在前${n}章里记下的${k}条心得，收在同一页上。中文版每多译出一章，就会再添几条。`, nbb: "翻开笔记本", sh: "", sp: "", sb: "" },
} as const;

// Tên ba nhân vật; bản tiếng Nhật phiên âm katakana, bản tiếng Trung dùng tên Hán (陈胜必, 阮力士, 忠哥)
const CAST_NAMES = {
  default: ["Trần Thắng Tất", "Nguyễn Lực Sỹ", "Trung"],
  ja: ["チャン・タン・タット", "グエン・ルック・シー", "チュン"],
  zh: ["陈胜必", "阮力士", "忠哥"],
} as const;

export default function BookPage({ lang }: { lang: Lang }) {
  const c = content[lang];
  const x = UI[lang];
  const subs0 = countAt(buildNow());
  // Bản ẩn (ja, zh): theo dõi qua note / WeChat (chưa có thì LinkedIn); không hiện số người đăng ký LinkedIn
  const cjk = isCJK(lang);
  const follow = followUrl(lang);
  const names = cjk ? CAST_NAMES[lang] : CAST_NAMES.default;
  let n = 0;
  // Chương sắp ra: lấy câu mồi từ phần "Tuần sau" của chương mới nhất (bản tiếng Việt)
  // Mỗi bản có nhịp riêng: tiếng Anh chậm 1 chương, tiếng Tây Ban Nha chậm 2 chương so với tiếng Việt
  const rel = releasedCount(lang);
  const nbEntries = notebook(lang);
  const nbTotal = nbEntries.reduce((a, e) => a + e.count, 0);
  const upcoming = rel < TOTAL_CHAPTERS ? rel + 1 : null;
  const upHook = upcoming && rel > 0 ? loadChapter(lang, rel).teaser?.hook ?? "" : "";
  // Bản tiếng Anh / Tây Ban Nha: bao nhiêu chương đã có bằng chính ngôn ngữ này
  const nativeCount = rel;
  // Có chương đã ra bằng tiếng Việt mà bản này chưa có (không tính chương đang lên dần)?
  const hasAlt = Array.from({ length: RELEASED }, (_, k) => k + 1).some((k) => k > rel && k !== draftNumber(lang));
  const translated = rel >= RELEASED;
  // Chương đang viết (bản nháp tiếng Việt)
  // Chương đang lên dần: ưu tiên bản của ngôn ngữ đang xem, không có thì bản tiếng Việt
  const dLang: ReadLang = draftNumber(lang) ? lang : "vi";
  const dn = draftNumber(dLang);
  const dInfo = dn ? loadChapter(dLang, dn).draft : null;
  const draftHref = dn ? chapterPath(dLang, dn) + (dLang === lang ? "" : `#from-${lang}`) : "";
  // Những ngôn ngữ khác xuất hiện trong mục lục (để làm chú thích)
  const alsoLangs = PUBLIC_LANGS.filter((l) =>
    Array.from({ length: RELEASED }, (_, k) => k + 1).some((k) => alsoIn(lang, k, readTarget(lang, k)?.in).includes(l)),
  );

  return (
    <>
      <LangSwitcher current={lang} />

      {/* Mở đầu: tên sách, câu hỏi, nút mua, bìa */}
      <header className="hero">
        <div className="wrap grid">
          <div>
            <Html as="div" className="eyebrow" html={c.eyebrow} />
            <Html as="h1" html={c.h1} />
            <div className="rule" aria-hidden="true" />
            <Html as="p" className="q" html={c.q} />
            <div className="cta">
              <a className="btn primary" href={AMAZON_URL} {...ext}>
                {c.buy}
              </a>
              <a className="btn ghost" href="#doc-thu">
                {c.read}
              </a>
            </div>
            <Html as="p" className="note" html={c.note} />
            {!cjk && (
              <p className="note">
                <SubscriberCount lang={lang} initial={subs0} />
              </p>
            )}
          </div>
          <figure className="cover">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={COVERS[lang]} alt={c.alt} width={720} height={1080} />
          </figure>
        </div>
      </header>

      {/* Chương sắp ra + đếm ngược */}
      {upcoming && (
        <section className="next-strip">
          <div className="wrap in">
            <div className="ns-t">
              <span className="eyebrow">{dn === upcoming ? x.thisWeek : x.weekK}</span>
              <span className="ns-title">
                {cjk ? `${jaCh(upcoming)}\u3000${c.c[upcoming - 1]}` : <>{x.chapter} {upcoming} · {c.c[upcoming - 1]}</>}
              </span>
              {upHook && <span className="ns-hook" dangerouslySetInnerHTML={{ __html: upHook }} />}
              {!translated && <span className="ns-hook ns-status">{x.status(rel, RELEASED)}</span>}
              {dn === upcoming && dInfo && (
                <span className="ns-draft">
                  <span className="k">{x.writing}</span>
                  <ProgressMeter percent={dInfo.percent} label={x.writing} />
                  <Link className="lnk" href={draftHref}>
                    {x.readDraft} →
                  </Link>
                </span>
              )}
            </div>
            <div className="ns-a">
              <Countdown lang={lang} target={dInfo?.release} />
              {!cjk && <SubscriberCount lang={lang} initial={subs0} variant="pill" />}
              <a className="btn primary" href={follow} {...ext}>
                {c.sub} <ArrowIcon />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Lưới 90/10 */}
      <div className="band">
        <div className="wrap grid">
          <div className="dots" aria-hidden="true">
            {Array.from({ length: 100 }, (_, i) => (
              <i key={i} className={i >= 90 ? "h" : undefined} />
            ))}
          </div>
          <div>
            <Html as="blockquote" html={c.quote} />
            <ul className="leg">
              <li>
                <LegendDot />
                <Html html={c.leg1} />
              </li>
              <li>
                <LegendDot on />
                <Html html={c.leg2} />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Câu chuyện */}
      <section className="s">
        <div className="wrap two">
          <div className="head">
            <Html as="div" className="eyebrow" html={c.st_eb} />
            <Html as="h2" html={c.st_h} />
          </div>
          <div className="prose">
            <Html as="p" html={c.st1} />
            <Html as="p" html={c.st2} />
            <Html as="p" html={c.st3} />
          </div>
        </div>
      </section>

      {/* Nhân vật và cấu trúc chương */}
      <section className="s" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="head">
            <Html as="div" className="eyebrow" html={c.ca_eb} />
            <Html as="h2" html={c.ca_h} />
          </div>
          <div className="cast">
            {(
              [
                ["tat", names[0], c.r1, c.d1],
                ["sy", names[1], c.r2, c.d2],
                ["trung", names[2], c.r3, c.d3],
              ] as const
            ).map(([who, name, role, desc]) => (
              <article className="person" key={name}>
                <Portrait who={who as Who} />
                <div className="role">{role}</div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
          <div className="anat">
            {(
              [
                [c.a1k, c.a1h, c.a1p],
                [c.a2k, c.a2h, c.a2p],
                [c.a3k, c.a3h, c.a3p],
              ] as const
            ).map(([k, h, p]) => (
              <div key={k}>
                <span className="k">{k}</span>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mục lục */}
      <section className="s toc" id="muc-luc">
        <div className="wrap">
          <div className="head">
            <Html as="div" className="eyebrow" html={c.toc_eb} />
            <Html as="h2" html={c.toc_h} />
          </div>
          <div className="legend">
            {nativeCount > 0 && (
              <span>
                <OpenBookIcon style={{ width: "1.15rem", height: "1.15rem", color: "var(--ink)" }} />
                {translated ? c.ready : x.legendNative}
              </span>
            )}
            {hasAlt && (
              <span className="dim">
                <Flag lang="vi" />
                {x.legendAlt}
              </span>
            )}
            {dInfo && (
              <span>
                <span className="meter mini" aria-hidden="true">
                  <span className="bar">
                    <span style={{ width: "40%" }} />
                  </span>
                </span>
                {x.writing}
              </span>
            )}
            {alsoLangs.length > 0 && (
              <span>
                <span className="also lg" aria-hidden="true">
                  {alsoLangs.map((l) => (
                    <Flag key={l} lang={l} />
                  ))}
                </span>
                {ALSO_LEGEND[lang]}
              </span>
            )}
            <span className="soon-swatch">
              <ClockIcon style={{ width: "1.1rem", height: "1.1rem" }} />
              {c.soon}
            </span>
          </div>
          <div className="parts">
            {PARTS.map(([key, count]) => (
              <div className="part" key={key}>
                <h3>{c[key]}</h3>
                <ol>
                  {Array.from({ length: count }, () => {
                    const i = n++;
                    const ch = chapter(c, i);
                    const out = i < RELEASED;
                    const target = out ? readTarget(lang, i + 1) : null;
                    const alt = !!target && target.in !== lang; // chưa dịch sang ngôn ngữ đang xem
                    const href = target ? (alt ? `${target.href}#from-${lang}` : target.href) : "";
                    const drafting = dn === i + 1 && dInfo && (dLang === lang || !out);
                    if (drafting) {
                      return (
                        <li key={i} className="drafting" data-ch={i + 1}>
                          <span className="n">{String(i + 1).padStart(2, "0")}</span>
                          <span className="t">
                            <Link href={draftHref} className="tl" hrefLang={dLang}>
                              <Html html={ch.title} />
                              {dLang !== lang && (
                                <span className="in-lang dim" title={c.other_lang.vi}>
                                  <Flag lang="vi" />
                                </span>
                              )}
                            </Link>
                            {alsoIn(lang, i + 1, dLang).length > 0 && (
                              <span className={dLang !== lang ? "also dim" : "also"}>
                                {alsoIn(lang, i + 1, dLang).map((l) => (
                                  <Link key={l} href={`${chapterPath(l, i + 1)}#from-${lang}`} hrefLang={l} title={c.other_lang[l]} aria-label={c.other_lang[l]}>
                                    <Flag lang={l} />
                                  </Link>
                                ))}
                              </span>
                            )}
                          </span>
                          <span className="dr">
                            <ProgressMeter percent={dInfo.percent} label={x.writing} />
                            <span>{x.writing}</span>
                          </span>
                          <Html className="th" html={ch.theory} />
                        </li>
                      );
                    }
                    return (
                      <li key={i} className={out ? (alt ? "out alt" : "out") : undefined} data-ch={i + 1}>
                        <span className="n">{String(i + 1).padStart(2, "0")}</span>
                        <span className="t">
                          {target ? (
                            <Link href={href} className="tl" hrefLang={target.in}>
                              <Html html={ch.title} />
                              {alt ? (
                                <span className="in-lang dim" title={c.other_lang[target.in]}>
                                  <Flag lang={target.in} />
                                </span>
                              ) : (
                                <span className="rd" title={c.ready}>
                                  <OpenBookIcon />
                                </span>
                              )}
                            </Link>
                          ) : null}
                          {target && alsoIn(lang, i + 1, target.in).length > 0 && (
                            <span className={alt ? "also dim" : "also"}>
                              {alsoIn(lang, i + 1, target.in).map((l) => (
                                <Link key={l} href={`${chapterPath(l, i + 1)}#from-${lang}`} hrefLang={l} title={c.other_lang[l]} aria-label={c.other_lang[l]}>
                                  <Flag lang={l} />
                                </Link>
                              ))}
                            </span>
                          )}
                          {!target && (
                            <>
                              <Html html={ch.title} />
                              <span className="soon-ic" title={c.soon}>
                                <ClockIcon />
                              </span>
                            </>
                          )}
                        </span>
                        <Html className="th" html={ch.theory} />
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
          <Html as="p" className="ending" html={c.ending} />
        </div>
      </section>

      {/* Đọc thử chương 1 */}
      <section className="s" id="doc-thu">
        <div className="wrap">
          <article className="excerpt">
            <div className="chap">{c.ex_eb}</div>
            <h2>{c.ex_h}</h2>
            <p className="sub">{c.ex_sub}</p>
            <div className="body fade">
              {c.excerpt.map((p, i) => (
                <Html as="p" key={i} html={p} />
              ))}
            </div>
            <div className="more">
              <p>{c.ex_more.replace("{n}", String(rel))}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".8rem", justifyContent: "center" }}>
                <Link className="btn primary" href={readTarget(lang, 1)!.href}>
                  {c.cont}
                </Link>
                <a className="btn ghost" href={AMAZON_URL} {...ext}>
                  {c.full}
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Sổ tay và truyện bên lề */}
      <section className="s extras">
        <div className="wrap">
          <div className="eyebrow">{EXTRAS[lang].eb}</div>
          <div className="grid2" style={{ marginTop: "1.2rem" }}>
            <div className="card">
              <h3>{EXTRAS[lang].nbh}</h3>
              <p>{EXTRAS[lang].nbp(nbTotal, nbEntries.length)}</p>
              <Link className="btn ghost" href={notebookPath(lang)}>
                {EXTRAS[lang].nbb} →
              </Link>
            </div>
            {lang === "vi" && (
              <div className="card">
                <h3>{EXTRAS.vi.sh}</h3>
                <p>{EXTRAS.vi.sp}</p>
                <ul className="side">
                  {SIDE_STORIES.map((s) => (
                    <li key={s.n}>
                      <span className="lock" aria-hidden="true">{s.n}</span>
                      <div>
                        <b>{s.title}</b> · {s.who}
                        <span>{s.hook}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <BonusSignup />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mua sách và đăng ký */}
      <section className="final">
        <div className="wrap grid">
          <div>
            <div className="eyebrow" style={{ color: "var(--band-muted)" }}>
              {c.f_eb}
            </div>
            <h2 style={{ marginTop: ".9rem" }}>{c.f_h}</h2>
            <p>{c.f_p}</p>
          </div>
          <div className="opts">
            <div className="opt">
              <div className="oi">
                <BookIcon />
              </div>
              <div className="ob">
                <span className="k">{c.o1k}</span>
                <Html className="v" html={c.o1v} />
                <a className="btn primary" href={AMAZON_URL} {...ext}>
                  <span>{c.o1b}</span> <ArrowIcon />
                </a>
              </div>
            </div>
            <div className="opt">
              <div className="oi">
                <MailIcon />
              </div>
              <div className="ob">
                <span className="k">{c.o2k}</span>
                <Html className="v" html={c.o2v} />
                {!cjk && <SubscriberCount lang={lang} initial={subs0} />}
                <a className="btn ghostw" href={follow} {...ext}>
                  <span>{c.o2b}</span> <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <AuthorLink />
          <span>{c.ft}</span>
        </div>
      </footer>
    </>
  );
}
