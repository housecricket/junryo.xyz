"use client";
// Câu đáng nhớ cuối chương. Bấm "Chia sẻ lên LinkedIn": mở khung đăng bài LinkedIn đã điền sẵn câu trích
// và link tới trang riêng của câu đó (link này hiện ảnh in câu trích khi LinkedIn tạo bản xem trước).
// Câu trích cũng được chép vào bộ nhớ tạm, phòng khi LinkedIn trên điện thoại không điền sẵn.
import { useState } from "react";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";

export type QuoteItem = { text: string; path: string };

const linkedinCompose = (text: string) => `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`;

export default function Quotes({ lang, quotes, source, siteUrl }: { lang: Lang; quotes: QuoteItem[]; source: string; siteUrl: string }) {
  const ui = UI[lang];
  const [done, setDone] = useState<number | null>(null);
  if (!quotes.length) return null;

  const textFor = (q: QuoteItem, origin: string) => `“${q.text}”\n\n— ${source}\n${origin}${q.path}`;

  const onShare = (q: QuoteItem, i: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    const origin = window.location.origin.includes("localhost") ? siteUrl : window.location.origin;
    const text = textFor(q, origin);
    e.currentTarget.href = linkedinCompose(text);
    navigator.clipboard?.writeText(text).then(
      () => setDone(i),
      () => setDone(null),
    );
  };

  return (
    <section className="quotes wrap" aria-label={ui.quotesK}>
      <div className="eyebrow">{ui.quotesK}</div>
      <ul>
        {quotes.map((q, i) => (
          <li key={i}>
            <blockquote>“{q.text}”</blockquote>
            <a className="share" href={linkedinCompose(textFor(q, siteUrl))} target="_blank" rel="noopener noreferrer" onClick={(e) => onShare(q, i, e)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
                <path d="M12 3v12" />
                <path d="m7 8 5-5 5 5" />
              </svg>
              {ui.share}
            </a>
            {done === i && (
              <span className="toast" role="status">
                {ui.copied}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
