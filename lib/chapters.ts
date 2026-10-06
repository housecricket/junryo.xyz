// Đọc các chương từ content/chapters/<ngôn ngữ>/<số>.md lúc build.
//
// Hai loại chương:
// 1. Đã phát hành: số chương nằm trong PUBLISHED, PDF đặt trong public/pdf/.
// 2. Lên lịch: file .md có phần đầu
//      ---
//      start: 2026-10-05T00:00:00+07:00     ← 0:00 thứ Hai, bắt đầu mở dần
//      release: 2026-10-11T23:59:00+07:00   ← 23:59 Chủ nhật, phát hành đủ chương
//      ---
//    Trước "start": chưa hiện. Từ "start" đến "release": mỗi khung giờ trong lib/schedule.ts
//    mở thêm một phần. Từ "release": thành chương đã phát hành, PDF (content/pdf/) được chép ra.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { BASE_PATH } from "./site";
import { buildNow, revealFraction } from "./schedule";

export type ReadLang = "vi" | "en";

/** Các chương đã phát hành cố định */
const PUBLISHED: Record<ReadLang, number[]> = {
  vi: [1, 2, 3, 4],
  en: [1],
};

/** File PDF trong public/pdf/ */
export const PDF_FILES: Record<ReadLang, Record<number, string>> = {
  vi: { 1: "chuong-1.pdf", 2: "chuong-2.pdf", 3: "chuong-3.pdf", 4: "chuong-4.pdf", 5: "chuong-5.pdf" },
  en: { 1: "chapter-1-en.pdf" },
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
export const AVAILABLE: Record<ReadLang, number[]> = {
  vi: [...new Set([...PUBLISHED.vi, ...scheduled("vi").filter((s) => NOW >= s.release).map((s) => s.n)])].sort((a, b) => a - b),
  en: [...new Set([...PUBLISHED.en, ...scheduled("en").filter((s) => NOW >= s.release).map((s) => s.n)])].sort((a, b) => a - b),
};

/** Số chương tiếng Việt đã phát hành liên tiếp từ chương 1 */
export const RELEASED = (() => {
  let k = 0;
  while (AVAILABLE.vi.includes(k + 1)) k++;
  return k;
})();

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
  return lang === "vi" ? `/chuong/${n}/` : `/en/chapter/${n}/`;
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
  const m = md.match(/\n## (?:Tuần sau|Next Week)\n([\s\S]*)$/);
  if (!m) return null;
  const parts = m[1].split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  const head = parts[0]?.match(/^\*\*(?:Chương|Chapter) (\d+) [–-] (.+)\*\*$/);
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
  const nb = md.split(/\n## (?:Sổ tay|Thắng Tất’s Notebook)/)[1] ?? "";
  return [...nb.matchAll(/^\d+\. \*\*(.+?)\*\*/gm)].map((m) => m[1]);
}

const countWords = (s: string) => s.replace(/^#.*$/gm, "").split(/\s+/).filter(Boolean).length;

/** Cắt phần truyện theo tỷ lệ đã mở; không để một tiêu đề đứng trơ ở cuối */
function revealPart(story: string, fraction: number): string {
  const blocks = story.split(/\n\s*\n/).filter((b) => b.trim());
  // Khung lý thuyết (nhiều dòng >) là một khối; các khối khác là đoạn văn, tiêu đề, ảnh
  let k = Math.max(1, Math.floor(blocks.length * fraction));
  while (k > 1 && /^#{1,6} /.test(blocks[k - 1].trim())) k--;
  return blocks.slice(0, k).join("\n\n");
}

export function loadChapter(lang: ReadLang, n: number): Chapter {
  const file = path.join(dir(lang), `${n}.md`);
  const fm = frontMatter(fs.readFileSync(file, "utf8"));
  let md = fm.body;

  // Tiêu đề "# Chương 1 – Chỗ đau" → lấy phần sau dấu gạch
  const h1 = md.match(/^# (.+)$/m)?.[1] ?? "";
  const title = h1.split(/\s+[–-]\s+/).slice(1).join(" – ") || h1;
  let teaser = parseTeaser(md);
  let quotes = parseQuotes(md);

  md = md
    .replace(/^# .+\n+/m, "") // bỏ tiêu đề, trang tự hiển thị
    .replace(/^[A-Z][a-z]{2} \d{1,2}, \d{4} · @\S+\n+/m, "") // bỏ dòng ngày đăng
    .replace(/\n## (Tuần sau|Next Week)\n[\s\S]*$/, "\n"); // phần "tuần sau" thay bằng thẻ chương kế

  // Chương đang mở dần: chỉ lấy phần truyện đã tới giờ mở
  let draft: Draft | null = null;
  if (fm.meta.start && fm.meta.release && NOW < new Date(fm.meta.release)) {
    const story = md.split(/\n## (?:Sổ tay|Thắng Tất’s Notebook)/)[0];
    const frac = revealFraction(new Date(fm.meta.start), new Date(fm.meta.release), NOW);
    md = revealPart(story, frac);
    draft = {
      percent: Math.round(frac * 100),
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
