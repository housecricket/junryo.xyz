import type { Metadata } from "next";
import ChapterReader from "@/components/ChapterReader";
import { chapterPath, loadChapter, readablePages } from "@/lib/chapters";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return readablePages("vi").map((n) => ({ n: String(n) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  const ch = loadChapter("vi", n);
  const title = `${ch.title} · ${content.vi.title}`;
  return {
    title,
    alternates: { canonical: SITE_URL + chapterPath("vi", n) },
    openGraph: { title, url: SITE_URL + chapterPath("vi", n), type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const n = Number((await params).n);
  return <ChapterReader lang="vi" chapter={loadChapter("vi", n)} />;
}
