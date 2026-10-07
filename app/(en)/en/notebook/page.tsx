import type { Metadata } from "next";
import NotebookPage, { NB_T } from "@/components/NotebookPage";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${NB_T.en.h} · ${content.en.title}`,
  description: NB_T.en.p,
  alternates: { canonical: SITE_URL + "/en/notebook/" },
  openGraph: { title: NB_T.en.h, description: NB_T.en.p, url: SITE_URL + "/en/notebook/", type: "article" },
};

export default function Page() {
  return <NotebookPage lang="en" />;
}
