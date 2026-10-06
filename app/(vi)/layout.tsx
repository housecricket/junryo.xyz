import "../globals.css";
import { fontVars } from "@/lib/fonts";
import { geoRedirectScript } from "@/lib/geo";
import { BASE_PATH } from "@/lib/site";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={fontVars}>
      <head>
        {/* Mở trang chủ lần đầu: chọn ngôn ngữ theo vị trí (xem lib/geo.ts) */}
        <script dangerouslySetInnerHTML={{ __html: geoRedirectScript(BASE_PATH) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
