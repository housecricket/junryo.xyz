// Đọc các chương từ content/chapters/<ngôn ngữ>/<số>.md lúc build.
// Thêm chương mới: thả file .md vào đúng thư mục, thêm số chương vào AVAILABLE,
// và (nếu có) đặt file PDF vào public/pdf/ theo tên trong PDF_FILES.
import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { BASE_PATH } from "./site";

export type ReadLang = "vi" | "en";

/** Các chương đã có bản đọc trên web, theo ngôn ngữ */
export const AVAILABLE: Record<ReadLang, number[]> = {
  vi: [1, 2, 3, 4],
  en: [1],
};

/** File PDF tương ứng trong public/pdf/ */
export const PDF_FILES: Record<ReadLang, Record<number, string>> = {
  vi: { 1: "chuong-1.pdf", 2: "chuong-2.pdf", 3: "chuong-3.pdf", 4: "chuong-4.pdf" },
  en: { 1: "chapter-1-en.pdf" },
};

/** Đường dẫn trang đọc của một chương */
export function chapterPath(lang: ReadLang, n: number) {
  return lang === "vi" ? `/chuong/${n}/` : `/en/chapter/${n}/`;
}

export function pdfUrl(lang: ReadLang, n: number) {
  const f = PDF_FILES[lang][n];
  return f ? `${BASE_PATH}/pdf/${f}` : null;
}

export type Chapter = { n: number; title: string; html: string };

export function loadChapter(lang: ReadLang, n: number): Chapter {
  const file = path.join(process.cwd(), "content", "chapters", lang, `${n}.md`);
  let md = fs.readFileSync(file, "utf8");

  // Tiêu đề "# Chương 1 – Chỗ đau" → lấy phần sau dấu gạch
  const h1 = md.match(/^# (.+)$/m)?.[1] ?? "";
  const title = h1.split(/\s+[–-]\s+/).slice(1).join(" – ") || h1;

  md = md
    .replace(/^# .+\n+/m, "") // bỏ tiêu đề, trang tự hiển thị
    .replace(/^[A-Z][a-z]{2} \d{1,2}, \d{4} · @\S+\n+/m, "") // bỏ dòng ngày đăng
    .replace(/\n## (Tuần sau|Next Week)\n[\s\S]*$/, "\n") // phần "tuần sau" thay bằng nút chuyển chương
    .replace(/\]\((Minh_hoa_[^)]+)\)/g, `](${BASE_PATH}/illus/$1)`);

  let html = marked.parse(md, { async: false }) as string;
  html = html
    .replace(/<blockquote>/g, '<blockquote class="box">')
    .replace(/<p><img src="([^"]+)" alt="([^"]*)"><\/p>/g, '<figure><img src="$1" alt="$2" loading="lazy"><figcaption>$2</figcaption></figure>');

  return { n, title, html };
}
