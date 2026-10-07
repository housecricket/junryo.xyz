// Đường dẫn trang chương, dùng được cả ở phía trình duyệt (không phụ thuộc fs)
export type AnyLang = "vi" | "en" | "es" | "ja" | "zh";
export function chapterPathOf(lang: AnyLang, n: number) {
  return lang === "vi" ? `/chuong/${n}/` : lang === "en" ? `/en/chapter/${n}/` : lang === "ja" ? `/ja/shou/${n}/` : lang === "zh" ? `/zh/zhang/${n}/` : `/es/capitulo/${n}/`;
}
