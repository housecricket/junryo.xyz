import type { Metadata } from "next";
import NotebookPage, { NB_T } from "@/components/NotebookPage";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `${NB_T.es.h} · ${content.es.title}`,
  description: NB_T.es.p,
  alternates: { canonical: SITE_URL + "/es/cuaderno/" },
  openGraph: { title: NB_T.es.h, description: NB_T.es.p, url: SITE_URL + "/es/cuaderno/", type: "article" },
};

export default function Page() {
  return <NotebookPage lang="es" />;
}
