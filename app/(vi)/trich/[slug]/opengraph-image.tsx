import { content } from "@/lib/content";
import { allQuotes, findQuote } from "@/lib/quotes";
import { OG_SIZE, quoteImage } from "@/lib/quoteImage";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Câu trích trong Mười phần trăm còn lại";
export const dynamicParams = false;
export function generateStaticParams() {
  return allQuotes("vi").map((q) => ({ slug: q.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const q = findQuote("vi", (await params).slug)!;
  return quoteImage(q, content.vi.title, `Chương ${q.n}`);
}
