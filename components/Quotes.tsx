"use client";
// Câu đáng nhớ cuối chương: bấm "Chia sẻ" để chép câu và mở hộp chia sẻ LinkedIn.
import { useState } from "react";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";

export default function Quotes({ lang, quotes, url, source }: { lang: Lang; quotes: string[]; url: string; source: string }) {
  const ui = UI[lang];
  const [done, setDone] = useState<number | null>(null);
  if (!quotes.length) return null;
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copy = (q: string, i: number) => {
    const text = `“${q}”\n— ${source}\n${url}`;
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
            <blockquote>“{q}”</blockquote>
            <a className="share" href={share} target="_blank" rel="noopener noreferrer" onClick={() => copy(q, i)}>
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
