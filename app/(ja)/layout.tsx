import "../globals.css";
import { Noto_Serif_JP } from "next/font/google";
import { fontVars } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import Analytics from "@/components/Analytics";
import type { Metadata } from "next";
import { HIDDEN_ROBOTS, SITE_URL } from "@/lib/site";

// Bản tiếng Nhật đang ẩn: mọi trang trong nhóm này đều noindex (trang con có thể đặt lại, nhưng không nên).
// Không có script chọn ngôn ngữ theo múi giờ (lib/geo.ts chỉ chạy ở trang chủ tiếng Việt).
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), robots: HIDDEN_ROBOTS };

// Chữ Minchō cho tiếng Nhật. Bộ chữ CJK rất lớn nên không tải trước; Google Fonts tự chia nhỏ theo unicode-range.
// Chỉ khai báo ở đây để các bản vi/en/es không phải tải CSS của phông này.
const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"],
  variable: "--font-noto-jp",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Noto Serif CJK JP", "Hiragino Mincho ProN", "Yu Mincho", "serif"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${fontVars} ${notoSerifJP.variable}`} suppressHydrationWarning>
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
