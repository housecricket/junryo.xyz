import type { Metadata } from "next";
import ChapterReader from "@/components/ChapterReader";
import { AVAILABLE, chapterPath, loadChapter } from "@/lib/chapters";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return AVAILABLE.en.map((n) => ({ n: String(n) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  const ch = loadChapter("en", n);
  const title = `${ch.title} · ${content.en.title}`;
  return {
    title,
    alternates: { canonical: SITE_URL + chapterPath("en", n) },
    openGraph: { title, url: SITE_URL + chapterPath("en", n), type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const n = Number((await params).n);
  return <ChapterReader lang="en" chapter={loadChapter("en", n)} />;
}
