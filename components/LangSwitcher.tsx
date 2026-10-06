import Link from "next/link";
import { LANGS, type Lang } from "@/lib/content";
import { PATHS } from "@/lib/site";
import { Flag } from "./Icons";

const NAMES: Record<Lang, string> = { vi: "Tiếng Việt", en: "English", es: "Español" };

export default function LangSwitcher({ current }: { current: Lang }) {
  return (
    <nav className="wrap lang" aria-label="Ngôn ngữ / Language / Idioma">
      <div role="group">
        {LANGS.map((l) => (
          <Link
            key={l}
            href={PATHS[l]}
            hrefLang={l}
            title={NAMES[l]}
            aria-label={NAMES[l]}
            aria-current={l === current ? "page" : undefined}
            className="lang-btn"
          >
            <Flag lang={l} />
          </Link>
        ))}
      </div>
    </nav>
  );
}
