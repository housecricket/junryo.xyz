import BookPage from "@/components/BookPage";
import { pageMetadata } from "@/lib/site";

// Bản ẩn: pageMetadata("zh") đã gồm robots noindex, nofollow và không có hreflang
export const metadata = pageMetadata("zh");

export default function Page() {
  return <BookPage lang="zh" />;
}
