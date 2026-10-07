import type { Metadata } from "next";
import { content, isHidden, type Lang } from "./content";

// Thư mục con khi chạy trên GitHub Pages (vd "/muoi-phan-tram"), để trống với tên miền riêng.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Địa chỉ đầy đủ của trang, dùng cho thẻ chia sẻ Facebook/LinkedIn và Google.
// Mặc định là www.thelast10book.com (trước đây là dangtrunganh.me); đặt biến môi trường NEXT_PUBLIC_SITE_URL nếu đổi tên miền.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.thelast10book.com").replace(/\/$/, "");

// Đường dẫn trong trang (Next.js tự thêm BASE_PATH cho <Link>)
export const PATHS: Record<Lang, string> = { vi: "/", en: "/en/", es: "/es/", ja: "/ja/", zh: "/zh/" };

const COVER_FILES: Record<Lang, string> = {
  vi: "/covers/vi.jpg",
  en: "/covers/en.jpg",
  es: "/covers/en.jpg", // bản tiếng Tây Ban Nha dùng chung bìa tiếng Anh
  ja: "/covers/ja.jpg",
  zh: "/covers/zh.jpg",
};

// Ảnh dùng trong thẻ <img> cần tự thêm BASE_PATH
export const COVERS: Record<Lang, string> = {
  vi: BASE_PATH + COVER_FILES.vi,
  en: BASE_PATH + COVER_FILES.en,
  es: BASE_PATH + COVER_FILES.es,
  ja: BASE_PATH + COVER_FILES.ja,
  zh: BASE_PATH + COVER_FILES.zh,
};

const abs = (p: string) => SITE_URL + p;

/** Các bản đang ẩn (tiếng Nhật, tiếng Trung): không cho máy tìm kiếm lập chỉ mục, không theo link */
export const HIDDEN_ROBOTS = { index: false, follow: false } as const;

export function pageMetadata(lang: Lang): Metadata {
  const c = content[lang];
  // Bản ẩn (ja, zh): noindex và không khai báo hreflang; các bản công khai không trỏ tới nó
  const hidden = isHidden(lang);
  return {
    title: c.title,
    description: c.q,
    ...(hidden ? { robots: HIDDEN_ROBOTS } : {}),
    alternates: hidden
      ? { canonical: abs(PATHS[lang]) }
      : {
          canonical: abs(PATHS[lang]),
          languages: { vi: abs(PATHS.vi), en: abs(PATHS.en), es: abs(PATHS.es), "x-default": abs(PATHS.vi) },
        },
    openGraph: {
      title: c.title,
      description: c.q,
      url: abs(PATHS[lang]),
      type: "book",
      images: [{ url: abs(COVER_FILES[lang]), width: 720, height: 1080, alt: c.alt }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.q, images: [abs(COVER_FILES[lang])] },
  };
}
