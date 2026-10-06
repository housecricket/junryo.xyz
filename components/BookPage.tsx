import { AMAZON_URL, LINKEDIN_URL, RELEASED, content, type Content, type Lang } from "@/lib/content";
import { COVERS } from "@/lib/site";
import Link from "next/link";
import { AVAILABLE, chapterPath, loadChapter, type ReadLang } from "@/lib/chapters";
import { UI } from "@/lib/ui";
import Countdown from "./Countdown";
import { ReadMarks } from "./ReadingAids";
import Html from "./Html";
import LangSwitcher from "./LangSwitcher";
import Portrait, { type Who } from "./Portrait";
import { ArrowIcon, BookIcon, Flag, LegendDot, MailIcon, OpenBookIcon } from "./Icons";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

// Ba phần của mục lục: [khoá tiêu đề, số chương]
const PARTS = [
  ["p1", 4],
  ["p2", 5],
  ["p3", 5],
] as const;

function chapter(c: Content, i: number) {
  return { title: c.c[i], theory: c.th[i] };
}

/** Chương n mở bằng ngôn ngữ nào: ưu tiên ngôn ngữ đang xem, rồi tiếng Anh, rồi tiếng Việt */
function readTarget(lang: Lang, n: number): { href: string; in: ReadLang } | null {
  const order: ReadLang[] = lang === "vi" ? ["vi"] : lang === "en" ? ["en", "vi"] : ["en", "vi"];
  for (const l of order) if (AVAILABLE[l].includes(n)) return { href: chapterPath(l, n), in: l };
  return null;
}

export default function BookPage({ lang }: { lang: Lang }) {
  const c = content[lang];
  const x = UI[lang];
  let n = 0;
  // Chương sắp ra: lấy câu mồi từ phần "Tuần sau" của chương mới nhất (bản tiếng Việt)
  const upcoming = RELEASED < 14 ? RELEASED + 1 : null;
  const upHook = lang === "vi" && upcoming ? loadChapter("vi", RELEASED).teaser?.hook ?? "" : "";

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
              <span className="eyebrow">{x.weekK}</span>
              <span className="ns-title">
                {x.chapter} {upcoming} · {c.c[upcoming - 1]}
              </span>
              {upHook && <span className="ns-hook" dangerouslySetInnerHTML={{ __html: upHook }} />}
            </div>
            <div className="ns-a">
              <Countdown lang={lang} />
              <a className="btn primary" href={LINKEDIN_URL} {...ext}>
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
                ["tat", "Trần Thắng Tất", c.r1, c.d1],
                ["sy", "Nguyễn Lực Sỹ", c.r2, c.d2],
                ["trung", "Trung", c.r3, c.d3],
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
            <span>
              <OpenBookIcon style={{ width: "1.15rem", height: "1.15rem", color: "var(--ink)" }} />
              {c.ready}
            </span>
            <span>
              <i className="dot o" />
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
                    return (
                      <li key={i} className={out ? "out" : undefined} data-ch={i + 1}>
                        <span className="n">{String(i + 1).padStart(2, "0")}</span>
                        <span className="t">
                          {target ? (
                            <Link href={target.href} className="tl">
                              <Html html={ch.title} />
                              <span className="rd" title={c.ready}>
                                <OpenBookIcon />
                              </span>
                              {target.in !== lang && (
                                <span className="in-lang" title={c.other_lang[target.in]}>
                                  <Flag lang={target.in} />
                                </span>
                              )}
                            </Link>
                          ) : (
                            <Html html={ch.title} />
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
          <ReadMarks label={x.read} />
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
              <p>{c.ex_more}</p>
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
                <a className="btn ghostw" href={LINKEDIN_URL} {...ext}>
                  <span>{c.o2b}</span> <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <span>© 2026 · @dangtrunganh</span>
          <span>{c.ft}</span>
        </div>
      </footer>
    </>
  );
}
