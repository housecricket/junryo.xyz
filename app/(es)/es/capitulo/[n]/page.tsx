import type { Metadata } from "next";
import ChapterReader from "@/components/ChapterReader";
import { chapterPath, loadChapter, readablePages } from "@/lib/chapters";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return readablePages("es").map((n) => ({ n: String(n) }));
}

type Props = { params: Promise<{ n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = Number((await params).n);
  const ch = loadChapter("es", n);
  const title = `${ch.title} · ${content.es.title}`;
  return {
    title,
    alternates: { canonical: SITE_URL + chapterPath("es", n) },
    openGraph: { title, url: SITE_URL + chapterPath("es", n), type: "article", images: ["/covers/en.jpg"] },
  };
}

export default async function Page({ params }: Props) {
  const n = Number((await params).n);
  return <ChapterReader lang="es" chapter={loadChapter("es", n)} />;
}
