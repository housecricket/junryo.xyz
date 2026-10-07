import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import Analytics from "@/components/Analytics";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

// Gốc cho mọi link ảnh chia sẻ (og:image) → https://www.thelast10book.com/...
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
