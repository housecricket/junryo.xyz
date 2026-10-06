import BookPage from "@/components/BookPage";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("vi");

export default function Page() {
  return <BookPage lang="vi" />;
}
