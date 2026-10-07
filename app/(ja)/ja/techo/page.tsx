import type { Metadata } from "next";
import NotebookPage, { NB_T } from "@/components/NotebookPage";
import { content } from "@/lib/content";
import { HIDDEN_ROBOTS, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${NB_T.ja.h}｜${content.ja.title}`,
  description: NB_T.ja.p,
  robots: HIDDEN_ROBOTS,
  alternates: { canonical: SITE_URL + "/ja/techo/" },
  openGraph: { title: NB_T.ja.h, description: NB_T.ja.p, url: SITE_URL + "/ja/techo/", type: "article" },
};

export default function Page() {
  return <NotebookPage lang="ja" />;
}
