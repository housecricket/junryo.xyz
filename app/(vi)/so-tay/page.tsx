import type { Metadata } from "next";
import NotebookPage, { NB_T } from "@/components/NotebookPage";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${NB_T.vi.h} · ${content.vi.title}`,
  description: NB_T.vi.p,
  alternates: { canonical: SITE_URL + "/so-tay/" },
  openGraph: { title: NB_T.vi.h, description: NB_T.vi.p, url: SITE_URL + "/so-tay/", type: "article" },
};

export default function Page() {
  return <NotebookPage lang="vi" />;
}
