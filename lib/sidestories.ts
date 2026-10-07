// Truyện bên lề: chỉ gửi qua bản tin LinkedIn, trang web chỉ giới thiệu (không đăng toàn văn).
// Thêm truyện mới vào cuối danh sách.
export type SideStory = { n: number; title: string; who: string; hook: string };

export const SIDE_STORIES: SideStory[] = [
  { n: 1, title: "Gõ chậm", who: "Lực Sỹ", hook: "Hồi Hải Đăng còn ở tầng trên một quán phở, một dòng lệnh gõ vội đã đến được ba trăm nhà." },
  { n: 2, title: "Ca đêm", who: "Phong", hook: "Gần ba năm canh cho không có gì xảy ra. Và một đêm, lần đầu tiên, có điều gì đó xảy ra." },
  { n: 3, title: "Ngày tệ nhất", who: "Thư", hook: "Mười hai năm chỉ gặp khách hàng vào ngày tệ nhất của họ, cho đến một tấm danh thiếp không có chức danh." },
];

// Đăng ký email nhận truyện bên lề.
// Dán địa chỉ "action" của form nhúng (MailerLite, Kit, Mailchimp…) vào biến môi trường
// NEXT_PUBLIC_BONUS_FORM_ACTION trên Vercel, và tên ô email vào NEXT_PUBLIC_BONUS_FORM_FIELD
// (MailerLite: "fields[email]", Kit: "email_address", Mailchimp: "EMAIL").
// Khi chưa cấu hình, ô đăng ký tạm hiện "Sắp mở" và nút dẫn sang bản tin LinkedIn.
export const BONUS_FORM = {
  action: process.env.NEXT_PUBLIC_BONUS_FORM_ACTION || "",
  field: process.env.NEXT_PUBLIC_BONUS_FORM_FIELD || "email",
};
