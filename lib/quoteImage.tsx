// Ảnh chia sẻ 1200×630 cho một câu trích: nền đen, chữ trắng, đúng tông bìa sách.
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { Quote } from "./quotes";

const font = (f: string) => fs.readFileSync(path.join(process.cwd(), "assets", "fonts", f));

export const OG_SIZE = { width: 1200, height: 630 };

export function quoteImage(q: Quote, book: string, chapterLabel: string) {
  const size = q.text.length > 90 ? 52 : q.text.length > 60 ? 60 : 70;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0B0B0B", color: "#F2F2F0", padding: "72px 84px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          {Array.from({ length: 10 }, (_, k) => (
            <div key={k} style={{ width: 14, height: 14, borderRadius: 7, background: "#FFFFFF" }} />
          ))}
        </div>
        <div style={{ display: "flex", fontFamily: "Playfair", fontWeight: 900, fontSize: size, lineHeight: 1.15, letterSpacing: -1 }}>
          “{q.text}”
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontFamily: "BeVietnam", fontSize: 24, letterSpacing: 3, color: "#A3A3A0", textTransform: "uppercase" }}>
          <div style={{ display: "flex" }}>{book}</div>
          <div style={{ display: "flex" }}>{chapterLabel}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Playfair", data: font("playfair-display-latin-900-normal.woff"), weight: 900, style: "normal" },
        { name: "Playfair", data: font("playfair-display-vietnamese-900-normal.woff"), weight: 900, style: "normal" },
        { name: "BeVietnam", data: font("be-vietnam-pro-latin-500-normal.woff"), weight: 500, style: "normal" },
        { name: "BeVietnam", data: font("be-vietnam-pro-vietnamese-500-normal.woff"), weight: 500, style: "normal" },
      ],
    },
  );
}
