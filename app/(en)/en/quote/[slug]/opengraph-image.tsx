import { content } from "@/lib/content";
import { allQuotes, findQuote } from "@/lib/quotes";
import { OG_SIZE, quoteImage } from "@/lib/quoteImage";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "A quote from The Last 10%";
export const dynamicParams = false;
export function generateStaticParams() {
  return allQuotes("en").map((q) => ({ slug: q.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const q = findQuote("en", (await params).slug)!;
  return quoteImage(q, content.en.title, `Chapter ${q.n}`);
}
