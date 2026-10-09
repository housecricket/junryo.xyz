import type { Metadata } from "next";
import QuotePage from "@/components/QuotePage";
import { content } from "@/lib/content";
import { allQuotes, findQuote, quoteDetail, quotePath } from "@/lib/quotes";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return allQuotes("es").map((q) => ({ slug: q.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const q = findQuote("es", (await params).slug)!;
  const title = `“${q.text}”`;
  const description = `${content.es.title} · Capítulo ${q.n} – ${q.chapterTitle}`;
  const url = SITE_URL + quotePath("es", q.slug);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: Props) {
  return <QuotePage lang="es" q={quoteDetail("es", (await params).slug)} />;
}
