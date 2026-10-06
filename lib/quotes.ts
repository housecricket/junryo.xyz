// Mỗi câu đáng nhớ có một trang riêng (/trich/4-1/, /en/quote/1-2/) kèm ảnh chia sẻ in sẵn câu trích,
// để khi dán link lên LinkedIn/Facebook, bài đăng hiện luôn câu trích thay vì chỉ có bìa sách.
import { AVAILABLE, loadChapter, type ReadLang } from "./chapters";

export type Quote = { slug: string; n: number; i: number; text: string; chapterTitle: string };

export function quotePath(lang: ReadLang, slug: string) {
  return lang === "vi" ? `/trich/${slug}/` : lang === "en" ? `/en/quote/${slug}/` : `/es/cita/${slug}/`;
}

export function allQuotes(lang: ReadLang): Quote[] {
  const out: Quote[] = [];
  for (const n of AVAILABLE[lang]) {
    const ch = loadChapter(lang, n);
    ch.quotes.forEach((text, k) => out.push({ slug: `${n}-${k + 1}`, n, i: k + 1, text, chapterTitle: ch.title }));
  }
  return out;
}

export function findQuote(lang: ReadLang, slug: string): Quote | undefined {
  return allQuotes(lang).find((q) => q.slug === slug);
}
