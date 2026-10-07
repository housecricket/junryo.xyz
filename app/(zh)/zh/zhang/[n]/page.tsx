import type { Metadata } from "next";
import ChapterReader from "@/components/ChapterReader";
import { chapterPath, loadChapter, readablePages } from "@/lib/chapters";
import { content } from "@/lib/content";
import { HIDDEN_ROBOTS, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

// Chỉ các chương đã dịch sang tiếng Trung (hiện là chương 1)
export function generateStaticParams() {
  return readablePages("zh").map((n) => ({ n: String(n) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  const ch = loadChapter("zh", n);
  const title = `${ch.title}｜${content.zh.title}`;
  return {
    title,
    robots: HIDDEN_ROBOTS,
    alternates: { canonical: SITE_URL + chapterPath("zh", n) },
    openGraph: { title, url: SITE_URL + chapterPath("zh", n), type: "article", images: ["/covers/en.jpg"] },
  };
}

export default async function Page({ params }: Props) {
  const n = Number((await params).n);
  return <ChapterReader lang="zh" chapter={loadChapter("zh", n)} />;
}
