import type { Metadata } from "next";
import NotebookPage, { NB_T } from "@/components/NotebookPage";
import { content } from "@/lib/content";
import { HIDDEN_ROBOTS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${NB_T.zh.h}｜${content.zh.title}`,
  description: NB_T.zh.p,
  robots: HIDDEN_ROBOTS,
  alternates: { canonical: SITE_URL + "/zh/biji/" },
  openGraph: { title: NB_T.zh.h, description: NB_T.zh.p, url: SITE_URL + "/zh/biji/", type: "article" },
};

export default function Page() {
  return <NotebookPage lang="zh" />;
}
