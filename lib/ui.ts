// Chữ cho các phần tương tác: đếm ngược, thanh mời đăng ký, câu trích, chương kế tiếp.
import type { Lang } from "./content";

/** Lịch ra chương: thứ Hai (1), 8:00 sáng giờ Việt Nam (UTC+7) */
export const RELEASE = { weekday: 1, hour: 8, utcOffset: 7 };

export const UI = {
  vi: {
    nextK: "Chương tiếp theo",
    readN: (n: number) => `Đọc chương ${n}`,
    weekK: "Tuần sau",
    outIn: "Lên sóng sau",
    units: ["ngày", "giờ", "phút", "giây"],
    when: "Thứ Hai, 8:00 sáng (giờ Việt Nam)",
    outNow: "Chương mới đã lên LinkedIn",
    quotesK: "Câu đáng nhớ",
    share: "Chia sẻ lên LinkedIn",
    copied: "Đã chép câu trích. Dán vào bài đăng LinkedIn của bạn.",
    barText: "Thích chương này? Mỗi thứ Hai có một chương mới.",
    close: "Đóng",
    read: "Đã đọc",
    chapter: "Chương",
  },
  en: {
    nextK: "Next chapter",
    readN: (n: number) => `Read Chapter ${n}`,
    weekK: "Next week",
    outIn: "Out in",
    units: ["d", "h", "m", "s"],
    when: "Monday, 8:00 a.m. Vietnam time",
    outNow: "The new chapter is out on LinkedIn",
    quotesK: "Lines worth keeping",
    share: "Share on LinkedIn",
    copied: "Quote copied. Paste it into your LinkedIn post.",
    barText: "Enjoying this? A new chapter every Monday.",
    close: "Close",
    read: "Read",
    chapter: "Chapter",
  },
  es: {
    nextK: "Siguiente capítulo",
    readN: (n: number) => `Leer el capítulo ${n}`,
    weekK: "La próxima semana",
    outIn: "Sale en",
    units: ["d", "h", "min", "s"],
    when: "Lunes, 8:00 (hora de Vietnam)",
    outNow: "El nuevo capítulo ya está en LinkedIn",
    quotesK: "Frases para recordar",
    share: "Compartir en LinkedIn",
    copied: "Frase copiada. Pégala en tu publicación de LinkedIn.",
    barText: "¿Te gusta? Un capítulo nuevo cada lunes.",
    close: "Cerrar",
    read: "Leído",
    chapter: "Capítulo",
  },
} satisfies Record<Lang, unknown>;
