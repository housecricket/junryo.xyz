import type { Metadata } from "next";
import QuotePage from "@/components/QuotePage";
import { content } from "@/lib/content";
import { allQuotes, findQuote, quoteDetail, quotePath } from "@/lib/quotes";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return allQuotes("en").map((q) => ({ slug: q.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = findQuote("en", (await params).slug)!;
  const title = `“${q.text}”`;
  const description = `${content.en.title} · Chapter ${q.n} – ${q.chapterTitle}`;
  const url = SITE_URL + quotePath("en", q.slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Props) {
  return <QuotePage lang="en" q={quoteDetail("en", (await params).slug)} />;
}
