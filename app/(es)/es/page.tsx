import BookPage from "@/components/BookPage";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata("es");

export default function Page() {
  return <BookPage lang="es" />;
}
