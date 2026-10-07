import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import Analytics from "@/components/Analytics";
import type { Metadata } from "next";
import { BASE_PATH, SITE_URL } from "@/lib/site";

// Gốc cho mọi link ảnh chia sẻ (og:image) → https://www.thelast10book.com/...
export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };
import { geoRedirectScript } from "@/lib/geo";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={fontVars} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {/* Mở trang chủ lần đầu: chọn ngôn ngữ theo vị trí (xem lib/geo.ts) */}
        <script dangerouslySetInnerHTML={{ __html: geoRedirectScript(BASE_PATH) }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
