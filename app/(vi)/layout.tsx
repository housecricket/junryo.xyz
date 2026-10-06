import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import Analytics from "@/components/Analytics";
import { geoRedirectScript } from "@/lib/geo";
import { BASE_PATH } from "@/lib/site";

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
