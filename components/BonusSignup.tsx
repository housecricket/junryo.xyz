"use client";
// Ô đăng ký email nhận truyện bên lề. Gửi vào một iframe ẩn để người đọc không rời trang.
import { useState } from "react";
import { BONUS_FORM } from "@/lib/sidestories";
import { LINKEDIN_URL } from "@/lib/content";
import { track } from "@/lib/analytics";

export default function BonusSignup() {
  const [sent, setSent] = useState(false);
  if (!BONUS_FORM.action) {
    return (
      <div className="bonus-form">
        <p className="bonus-note">Ô đăng ký email sắp mở. Trong lúc chờ, bạn có thể theo dõi bản tin trên LinkedIn.</p>
        <a className="btn ghost" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
          Theo dõi trên LinkedIn
        </a>
      </div>
    );
  }
  if (sent) {
    return (
      <p className="bonus-note bonus-ok">
        Cảm ơn bạn. Hãy mở hộp thư (và cả mục Quảng cáo, Spam) để xác nhận; truyện đầu tiên sẽ đến ngay sau đó.
      </p>
    );
  }
  return (
    <>
      <iframe name="bonus-sink" title="bonus" hidden />
      <form
        className="bonus-form"
        action={BONUS_FORM.action}
        method="post"
        target="bonus-sink"
        onSubmit={() => {
          track("bonus_signup", { lang: "vi" });
          setTimeout(() => setSent(true), 300);
        }}
      >
        <label htmlFor="bonus-email" className="sr">Email</label>
        <input id="bonus-email" type="email" name={BONUS_FORM.field} required placeholder="email@cua-ban.com" autoComplete="email" />
        <button className="btn primary" type="submit">Gửi truyện cho tôi</button>
      </form>
      <p className="bonus-note">Mỗi tuần một truyện, chỉ qua email. Bạn có thể hủy bất cứ lúc nào.</p>
    </>
  );
}
