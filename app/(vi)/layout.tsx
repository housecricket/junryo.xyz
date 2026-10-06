import "../globals.css";
import { fontVars } from "@/lib/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
