import type { Metadata } from "next";
import ChapterReader from "@/components/ChapterReader";
import { chapterPath, loadChapter, readablePages } from "@/lib/chapters";
import { content } from "@/lib/content";
import { HIDDEN_ROBOTS, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

// Chỉ các chương đã dịch sang tiếng Nhật (hiện là chương 1)
export function generateStaticParams() {
  return readablePages("ja").map((n) => ({ n: String(n) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  const ch = loadChapter("ja", n);
  const title = `${ch.title}｜${content.ja.title}`;
  return {
    title,
    robots: HIDDEN_ROBOTS,
    alternates: { canonical: SITE_URL + chapterPath("ja", n) },
    openGraph: { title, url: SITE_URL + chapterPath("ja", n), type: "article", images: ["/covers/en.jpg"] },
  };
}

export default async function Page({ params }: Props) {
  const n = Number((await params).n);
  return <ChapterReader lang="ja" chapter={loadChapter("ja", n)} />;
}
