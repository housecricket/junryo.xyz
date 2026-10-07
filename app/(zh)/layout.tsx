import "../globals.css";
import { Noto_Serif_SC } from "next/font/google";
import { fontVars } from "@/lib/fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import Analytics from "@/components/Analytics";
import type { Metadata } from "next";
import { HIDDEN_ROBOTS, SITE_URL } from "@/lib/site";

// Bản tiếng Trung giản thể đang ẩn: mọi trang trong nhóm này đều noindex (trang con có thể đặt lại, nhưng không nên).
// Không có script chọn ngôn ngữ theo múi giờ (lib/geo.ts chỉ chạy ở trang chủ tiếng Việt).
export const metadata: Metadata = { metadataBase: new URL(SITE_URL), robots: HIDDEN_ROBOTS };

// Chữ Tống (宋体) cho tiếng Trung. Bộ chữ CJK rất lớn nên không tải trước; Google Fonts tự chia nhỏ theo unicode-range.
// Chỉ khai báo ở đây để các bản vi/en/es/ja không phải tải CSS của phông này.
const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700"],
  variable: "--font-noto-sc",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Noto Serif CJK SC", "Songti SC", "SimSun", "serif"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${fontVars} ${notoSerifSC.variable}`} suppressHydrationWarning>
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
