// Mỗi câu đáng nhớ có một trang riêng (/trich/4-1/, /en/quote/1-2/) kèm ảnh chia sẻ in sẵn câu trích,
// để khi dán link lên LinkedIn/Facebook, bài đăng hiện luôn câu trích thay vì chỉ có bìa sách.
import { AVAILABLE, chapterExtras, loadChapter, type ChapterArt, type ReadLang } from "./chapters";

export type Quote = { slug: string; n: number; i: number; text: string; chapterTitle: string };

/** Ngôn ngữ có trang câu trích (bản tiếng Nhật, tiếng Trung không có: nút chia sẻ mở thẳng X / Weibo với link chương) */
export type QuoteLang = Exclude<ReadLang, "ja" | "zh">;

export function quotePath(lang: QuoteLang, slug: string) {
  return lang === "vi" ? `/trich/${slug}/` : lang === "en" ? `/en/quote/${slug}/` : `/es/cita/${slug}/`;
}

export function allQuotes(lang: QuoteLang): Quote[] {
  const out: Quote[] = [];
  for (const n of AVAILABLE[lang]) {
    const ch = loadChapter(lang, n);
    ch.quotes.forEach((text, k) => out.push({ slug: `${n}-${k + 1}`, n, i: k + 1, text, chapterTitle: ch.title }));
  }
  return out;
}

export function findQuote(lang: QuoteLang, slug: string): Quote | undefined {
  return allQuotes(lang).find((q) => q.slug === slug);
}

export type QuoteDetail = Quote & {
  note: string; // lời giải thích Thắng Tất viết ngay sau câu in đậm
  art: ChapterArt | null; // tranh minh hoạ của chương
  hook: string; // câu mồi về chương (lấy từ phần "Tuần sau" của chương trước; chương 1 dùng đoạn mở đầu)
  desc: string;
  excerpt: string[]; // vài đoạn mở đầu chương, làm trích đoạn
  siblings: Quote[]; // các câu khác cùng chương
  prev: Quote | null;
  next: Quote | null;
};

export function quoteDetail(lang: QuoteLang, slug: string): QuoteDetail {
  const all = allQuotes(lang);
  const k = all.findIndex((q) => q.slug === slug);
  const q = all[k];
  const ex = chapterExtras(lang, q.n);
  const note = ex.notes.find((x) => x.text === q.text)?.note ?? "";
  const t = q.n > 1 ? loadChapter(lang, q.n - 1).teaser : null;
  return {
    ...q,
    note,
    art: ex.art,
    hook: t?.hook ?? "",
    desc: t?.desc ?? ex.opening,
    excerpt: t ? ex.excerpt : ex.excerpt.slice(1),
    siblings: all.filter((x) => x.n === q.n && x.slug !== q.slug),
    prev: k > 0 ? all[k - 1] : null,
    next: k < all.length - 1 ? all[k + 1] : null,
  };
}
