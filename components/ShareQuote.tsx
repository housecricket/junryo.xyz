"use client";
// Nút chia sẻ trên trang câu trích: mở khung đăng bài LinkedIn đã điền sẵn câu và link trang này,
// đồng thời chép sẵn vào bộ nhớ tạm (LinkedIn trên điện thoại đôi khi không điền sẵn).
import { useState } from "react";

const compose = (text: string) => `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;

export default function ShareQuote({ text, source, path, siteUrl, label, done }: { text: string; source: string; path: string; siteUrl: string; label: string; done: string }) {
  const [ok, setOk] = useState(false);
  const body = (origin: string) => `“${text}”\n\n— ${source}\n${origin}${path}`;
  return (
    <a
      className="btn ghost share-q"
      href={compose(body(siteUrl))}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        const origin = window.location.origin.includes("localhost") ? siteUrl : window.location.origin;
        e.currentTarget.href = compose(body(origin));
        navigator.clipboard?.writeText(body(origin)).then(() => setOk(true), () => setOk(false));
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
      </svg>
      {ok ? done : label}
    </a>
  );
}
