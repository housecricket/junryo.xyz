import BookPage from "@/components/BookPage";
import { pageMetadata } from "@/lib/site";

// Bản ẩn: pageMetadata("ja") đã gồm robots noindex, nofollow và không có hreflang
export const metadata = pageMetadata("ja");

export default function Page() {
  return <BookPage lang="ja" />;
}
