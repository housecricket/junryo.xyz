import type { Metadata } from "next";
import { content, type Lang } from "./content";

// Thư mục con khi chạy trên GitHub Pages (vd "/muoi-phan-tram"), để trống với tên miền riêng.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Địa chỉ đầy đủ của trang, dùng cho thẻ chia sẻ Facebook/LinkedIn và Google.
// Mặc định là dangtrunganh.me; đặt biến môi trường NEXT_PUBLIC_SITE_URL nếu đổi tên miền.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://dangtrunganh.me").replace(/\/$/, "");

// Đường dẫn trong trang (Next.js tự thêm BASE_PATH cho <Link>)
export const PATHS: Record<Lang, string> = { vi: "/", en: "/en/", es: "/es/" };

const COVER_FILES: Record<Lang, string> = {
  vi: "/covers/vi.jpg",
  en: "/covers/en.jpg",
  es: "/covers/en.jpg", // bản tiếng Tây Ban Nha dùng chung bìa tiếng Anh
};

// Ảnh dùng trong thẻ <img> cần tự thêm BASE_PATH
export const COVERS: Record<Lang, string> = {
  vi: BASE_PATH + COVER_FILES.vi,
  en: BASE_PATH + COVER_FILES.en,
  es: BASE_PATH + COVER_FILES.es,
};

const abs = (p: string) => SITE_URL + p;

export function pageMetadata(lang: Lang): Metadata {
  const c = content[lang];
  return {
    title: c.title,
    description: c.q,
    alternates: {
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
