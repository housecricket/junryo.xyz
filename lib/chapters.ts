// Đọc các chương từ content/chapters/<ngôn ngữ>/<số>.md lúc build.
//
// Hai loại chương:
// 1. Đã phát hành: số chương nằm trong PUBLISHED, PDF đặt trong public/pdf/.
// 2. Lên lịch: file .md có phần đầu
//      ---
//      start: 2026-10-05T00:00:00+07:00     ← 0:00 thứ Hai, bắt đầu mở dần
//      release: 2026-10-12T00:00:00+07:00   ← 0:00 thứ Hai tuần sau, phát hành đủ chương
//      ---
//    Trước "start": chưa hiện. Từ "start" đến "release": mỗi khung giờ trong lib/schedule.ts
//    mở thêm một phần. Từ "release": thành chương đã phát hành, PDF (content/pdf/) được chép ra.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { BASE_PATH } from "./site";
import { buildNow, revealFraction } from "./schedule";

export type ReadLang = "vi" | "en" | "es" | "ja" | "zh";

/** Các chương đã phát hành cố định */
const PUBLISHED: Record<ReadLang, number[]> = {
  vi: [1, 2, 3, 4],
  en: [1, 2, 3], // bản tiếng Anh chậm hơn tiếng Việt 1 chương
  es: [1, 2], // bản tiếng Tây Ban Nha chậm hơn tiếng Việt 2 chương
  ja: [1], // bản tiếng Nhật (ẩn): mới dịch chương 1
  zh: [1, 2], // bản tiếng Trung giản thể (ẩn): đã dịch chương 1–2
};

/** File PDF trong public/pdf/ */
export const PDF_FILES: Record<ReadLang, Record<number, string>> = {
  vi: { 1: "chuong-1.pdf", 2: "chuong-2.pdf", 3: "chuong-3.pdf", 4: "chuong-4.pdf", 5: "chuong-5.pdf", 6: "chuong-6.pdf", 7: "chuong-7.pdf", 8: "chuong-8.pdf", 9: "chuong-9.pdf" },
  en: { 1: "chapter-1-en.pdf" },
  es: {},
  ja: {},
  zh: {},
};

const dir = (lang: ReadLang) => path.join(process.cwd(), "content", "chapters", lang);

/** Đọc phần đầu file giữa hai dòng --- */
export function frontMatter(md: string): { meta: Record<string, string>; body: string } {
  const m = md.match(/^---\n([\s\S]*?)\n---\n+/);
  if (!m) return { meta: {}, body: md };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-z_]+):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  return { meta, body: md.slice(m[0].length) };
}

type Sched = { n: number; start: Date; release: Date };

/** Các chương có lịch (start/release) trong một ngôn ngữ */
export function scheduled(lang: ReadLang): Sched[] {
  if (!fs.existsSync(dir(lang))) return [];
  const out: Sched[] = [];
  for (const f of fs.readdirSync(dir(lang))) {
    const n = Number(f.replace(/\.md$/, ""));
    if (!n) continue;
    const { meta } = frontMatter(fs.readFileSync(path.join(dir(lang), f), "utf8"));
    if (meta.start && meta.release) out.push({ n, start: new Date(meta.start), release: new Date(meta.release) });
  }
  return out.sort((a, b) => a.n - b.n);
}

const NOW = buildNow();

/** Các chương đã đọc được trọn vẹn (đã phát hành + chương có lịch đã tới giờ phát hành) */
const available = (l: ReadLang) =>
  [...new Set([...PUBLISHED[l], ...scheduled(l).filter((s) => NOW >= s.release).map((s) => s.n)])].sort((a, b) => a - b);
export const AVAILABLE: Record<ReadLang, number[]> = { vi: available("vi"), en: available("en"), es: available("es"), ja: available("ja"), zh: available("zh") };

/** Số chương đã phát hành liên tiếp từ chương 1, theo ngôn ngữ */
export function releasedCount(lang: ReadLang): number {
  let k = 0;
  while (AVAILABLE[lang].includes(k + 1)) k++;
  return k;
}
/** Số chương tiếng Việt đã phát hành (bản gốc, luôn đi trước) */
export const RELEASED = releasedCount("vi");

/** Chương đang mở dần (đã tới "start", chưa tới "release") */
export function draftNumber(lang: ReadLang): number | null {
  const s = scheduled(lang).find((x) => NOW >= x.start && NOW < x.release);
  return s ? s.n : null;
}

/** Các chương có trang đọc: đã phát hành + chương đang mở dần */
export function readablePages(lang: ReadLang): number[] {
  const d = draftNumber(lang);
  return d ? [...AVAILABLE[lang], d] : AVAILABLE[lang];
}

/** Đường dẫn trang đọc của một chương */
export function chapterPath(lang: ReadLang, n: number) {
  return lang === "vi" ? `/chuong/${n}/` : lang === "en" ? `/en/chapter/${n}/` : lang === "ja" ? `/ja/shou/${n}/` : lang === "zh" ? `/zh/zhang/${n}/` : `/es/capitulo/${n}/`;
}

/** Link PDF, chỉ khi chương đã phát hành và file có thật trong public/pdf/ */
export function pdfUrl(lang: ReadLang, n: number) {
  const f = PDF_FILES[lang][n];
  if (!f || !AVAILABLE[lang].includes(n)) return null;
  if (!fs.existsSync(path.join(process.cwd(), "public", "pdf", f))) return null;
  return `${BASE_PATH}/pdf/${f}`;
}

export type Teaser = { n: number; title: string; hook: string; desc: string };
export type Draft = {
  percent: number;
  words: number;
  total: number;
  release: string;
};
export type Chapter = {
  n: number;
  title: string;
  html: string;
  teaser: Teaser | null;
  quotes: string[];
  draft: Draft | null;
};

const inline = (s: string) => marked.parseInline(s, { async: false }) as string;

/** Đọc phần "Tuần sau" cuối chương: tên chương kế, câu mồi, đoạn mô tả */
function parseTeaser(md: string): Teaser | null {
  const m = md.match(/\n## (?:Tuần sau|Next Week|La próxima semana|来週|下周)\n([\s\S]*)$/);
  if (!m) return null;
  const parts = m[1].split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  // "**Chương 2 – Người nhập cư**" hoặc tiếng Nhật/Trung "**第2章　新参者**" / "**第2章　外乡人**" (khoảng trắng toàn góc sau 第N章)
  const head =
    parts[0]?.match(/^\*\*(?:Chương|Chapter|Capítulo) (\d+) [–-] (.+)\*\*$/) ?? parts[0]?.match(/^\*\*第(\d+)章\u3000(.+)\*\*$/);
  if (!head) return null;
  const rest = parts.slice(1).filter((p) => !p.startsWith("**")); // bỏ đoạn kêu gọi LinkedIn/Amazon
  return {
    n: Number(head[1]),
    title: head[2],
    hook: rest[0] ? inline(rest[0].replace(/^\*(.+)\*$/, "$1")) : "",
    desc: rest[1] ? inline(rest[1]) : "",
  };
}

/** Các câu in đậm trong "Sổ tay của Thắng Tất" → câu đáng nhớ để chia sẻ */
function parseQuotes(md: string): string[] {
  const nb = md.split(/\n## (?:Sổ tay|Thắng Tất’s Notebook|Cuaderno de Thắng Tất|タットの手帳|胜必的笔记本)/)[1] ?? "";
  return [...nb.matchAll(/^\d+\. \*\*(.+?)\*\*/gm)].map((m) => m[1]);
}

const countWords = (s: string) => s.replace(/^#.*$/gm, "").split(/\s+/).filter(Boolean).length;

/** Cắt phần truyện theo tỷ lệ đã mở; không để một tiêu đề đứng trơ ở cuối */
function revealPart(story: string, fraction: number): string {
  const blocks = story.split(/\n\s*\n/).filter((b) => b.trim());
  // Khung lý thuyết (nhiều dòng >) là một khối; các khối khác là đoạn văn, tiêu đề, ảnh
  // Ngay khi bắt đầu tuần đã có tiêu đề mục đầu và đoạn mở đầu
  let k = Math.max(2, Math.floor(blocks.length * fraction));
  while (k > 2 && /^#{1,6} /.test(blocks[k - 1].trim())) k--;
  return blocks.slice(0, k).join("\n\n");
}

/** Tiêu đề "# Chương 1 – Chỗ đau" → phần sau dấu gạch; tiếng Nhật/Trung "# 第1章　痛みの在りか" / "# 第1章　痛处" → phần sau khoảng trắng toàn góc */
function titleOf(md: string): string {
  const h1 = md.match(/^# (.+)$/m)?.[1] ?? "";
  const ja = h1.match(/^第\d+章\u3000(.+)$/);
  if (ja) return ja[1].trim();
  return h1.split(/\s+[–-]\s+/).slice(1).join(" – ") || h1;
}

export function loadChapter(lang: ReadLang, n: number): Chapter {
  const file = path.join(dir(lang), `${n}.md`);
  const fm = frontMatter(fs.readFileSync(file, "utf8"));
  let md = fm.body;

  const title = titleOf(md);
  let teaser = parseTeaser(md);
  let quotes = parseQuotes(md);

  md = md
    .replace(/^# .+\n+/m, "") // bỏ tiêu đề, trang tự hiển thị
    .replace(/^[A-Z][a-z]{2} \d{1,2}, \d{4} · @\S+\n+/m, "") // bỏ dòng ngày đăng
    .replace(/\n## (Tuần sau|Next Week|La próxima semana|来週|下周)\n[\s\S]*$/, "\n"); // phần "tuần sau" thay bằng thẻ chương kế

  // Chương đang mở dần: chỉ lấy phần truyện đã tới giờ mở
  let draft: Draft | null = null;
  if (fm.meta.start && fm.meta.release && NOW < new Date(fm.meta.release)) {
    const story = md.split(/\n## (?:Sổ tay|Thắng Tất’s Notebook|Cuaderno de Thắng Tất|タットの手帳|胜必的笔记本)/)[0];
    const frac = revealFraction(new Date(fm.meta.start), new Date(fm.meta.release), NOW);
    md = revealPart(story, frac);
    draft = {
      percent: Math.max(1, Math.round(frac * 100)),
      words: countWords(md),
      total: countWords(story),
      release: new Date(fm.meta.release).toISOString(),
    };
    teaser = null;
    quotes = [];
  }

  md = md.replace(/\]\((Minh_hoa_[^)]+)\)/g, `](${BASE_PATH}/illus/$1)`);

  let html = marked.parse(md, { async: false }) as string;
  html = html
    .replace(/<blockquote>/g, '<blockquote class="box">')
    .replace(/<p><img src="([^"]+)" alt="([^"]*)"><\/p>/g, '<figure><img src="$1" alt="$2" loading="lazy"><figcaption>$2</figcaption></figure>');

  return { n, title, html, teaser, quotes, draft };
}

export type NotebookEntry = { n: number; title: string; html: string; count: number };

/** "Sổ tay của Thắng Tất" của các chương đã phát hành trọn vẹn (không lấy chương đang mở dần) */
export function notebook(lang: ReadLang): NotebookEntry[] {
  const out: NotebookEntry[] = [];
  for (const n of AVAILABLE[lang]) {
    const { body } = frontMatter(fs.readFileSync(path.join(dir(lang), `${n}.md`), "utf8"));
    const title = titleOf(body);
    const sec = body.split(/\n## (?:Sổ tay của Thắng Tất|Thắng Tất’s Notebook|Cuaderno de Thắng Tất|タットの手帳|胜必的笔记本)\n/)[1];
    if (!sec) continue;
    const md = sec.split(/\n#{2,3} /)[0].trim();
    const count = (md.match(/^\d+\. \*\*/gm) || []).length;
    out.push({ n, title, html: marked.parse(md, { async: false }) as string, count });
  }
  return out;
}

/** Đường dẫn trang Sổ tay */
export function notebookPath(lang: ReadLang) {
  return lang === "vi" ? "/so-tay/" : lang === "en" ? "/en/notebook/" : lang === "ja" ? "/ja/techo/" : lang === "zh" ? "/zh/biji/" : "/es/cuaderno/";
}

export type NoteItem = { text: string; note: string };
export type ChapterArt = { src: string; alt: string };
/** Cho trang câu trích: lời giải thích đi kèm từng câu trong sổ tay, tranh minh hoạ đầu tiên và đoạn mở đầu của chương */
export function chapterExtras(lang: ReadLang, n: number): { notes: NoteItem[]; art: ChapterArt | null; opening: string; excerpt: string[] } {
  const { body } = frontMatter(fs.readFileSync(path.join(dir(lang), `${n}.md`), "utf8"));
  const parts = body.split(/\n## (?:Sổ tay của Thắng Tất|Thắng Tất’s Notebook|Cuaderno de Thắng Tất|タットの手帳|胜必的笔记本)\n/);
  const nb = (parts[1] ?? "").split(/\n#{2,3} /)[0];
  const notes = [...nb.matchAll(/^\d+\. \*\*(.+?)\*\*[ \t]*(.*)$/gm)].map((m) => ({ text: m[1], note: m[2] ? inline(m[2]) : "" }));
  const img = body.match(/!\[([^\]]*)\]\((Minh_hoa_[^)]+)\)/);
  const art = img ? { src: `${BASE_PATH}/illus/${img[2]}`, alt: img[1] } : null;
  const story = parts[0]
    .replace(/^# .+\n+/m, "")
    .replace(/^[A-Z][a-z]{2} \d{1,2}, \d{4} · @\S+\n+/m, "");
  const paras = story.split(/\n\s*\n/).map((b) => b.trim()).filter((b) => b && !/^(#|!\[|>|---)/.test(b));
  const first = paras[0] ?? "";
  // Trích đoạn: vài đoạn đầu chương, tối đa khoảng 700 ký tự
  const ex: string[] = [];
  for (const b of paras) {
    if (ex.length && ex.join(" ").length + b.length > 700) break;
    ex.push(b);
    if (ex.length >= 3) break;
  }
  return { notes, art, opening: first ? inline(first) : "", excerpt: ex.map(inline) };
}
