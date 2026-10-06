import { AUTHOR_URL } from "@/lib/content";

/** "© 2026 · in @dangtrunganh" — link tới trang LinkedIn của tác giả */
export default function AuthorLink() {
  return (
    <span className="author">
      © 2026 ·{" "}
      <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer me" aria-label="@dangtrunganh trên LinkedIn">
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <rect x="1" y="1" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="5.5" y="9.5" width="3" height="9" fill="currentColor" />
          <circle cx="7" cy="6.3" r="1.8" fill="currentColor" />
          <path d="M11 9.5h2.9v1.3c.5-.9 1.6-1.6 3.1-1.6 2.6 0 3.5 1.6 3.5 4.3v5H17.6v-4.5c0-1.2-.3-2-1.4-2s-1.8.8-1.8 2.1v4.4H11z" fill="currentColor" />
        </svg>
        @dangtrunganh
      </a>
    </span>
  );
}
