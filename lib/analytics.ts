// Đo lượt truy cập bằng Google Analytics 4 (Measurement ID của site, trước ở dangtrunganh.me, nay ở www.thelast10book.com).
// Đổi mã ở đây nếu cần; để chuỗi rỗng "" thì trang không tải Google Analytics.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-FE2BPRQ831";

type Params = Record<string, string | number | boolean | undefined>;

/** Gửi một sự kiện (không làm gì nếu chưa cài GA hoặc trình duyệt chặn) */
export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  try {
    w.gtag?.("event", name, params);
  } catch {}
}
