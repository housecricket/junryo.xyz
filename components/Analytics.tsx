"use client";
// Tải Google Analytics và tự ghi lại các cú bấm quan trọng trên trang:
//   chapter_open    bấm mở một chương (kèm số chương, ngôn ngữ, vị trí bấm: mục lục / dải tuần này / thẻ cuối chương…)
//   subscribe_click bấm đăng ký bản tin LinkedIn
//   buy_click       bấm mua trên Amazon
//   pdf_download    tải PDF chương
//   share_quote     chia sẻ câu trích lên LinkedIn
//   lang_switch     đổi ngôn ngữ · theme_toggle  bật/tắt đọc đêm · author_click  bấm vào LinkedIn tác giả
// Lượt xem trang (page_view) do Google Analytics tự đếm.
import Script from "next/script";
import { useEffect } from "react";
import { GA_ID, track } from "@/lib/analytics";

function where(el: Element): string {
  if (el.closest(".part")) return "toc";
  if (el.closest(".next-strip")) return "this_week";
  if (el.closest(".teaser")) return "chapter_end";
  if (el.closest(".pager")) return "prev_next";
  if (el.closest(".sticky-cta")) return "sticky_bar";
  if (el.closest(".hero")) return "hero";
  if (el.closest(".excerpt")) return "excerpt";
  if (el.closest(".final")) return "footer_cta";
  if (el.closest(".reader-head")) return "chapter_head";
  return "other";
}

export default function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("a,button");
      if (!el) return;
      const lang = document.documentElement.lang;
      const href = el.getAttribute("href") || "";
      const from = where(el);
      const ch = href.match(/\/(?:chuong|chapter|capitulo|shou|zhang)\/(\d+)\//);
      if (el.classList.contains("theme-btn")) return track("theme_toggle", { lang });
      if (el.classList.contains("lang-btn")) return track("lang_switch", { lang, to: el.getAttribute("hreflang") || "" });
      if (el.classList.contains("share")) return track("share_quote", { lang, page: location.pathname });
      if (href.includes("linkedin.com/in/")) return track("author_click", { lang, from });
      if (href.includes("newsletter-follow") || href.includes("note.com") || href.includes("weixin.qq.com")) return track("subscribe_click", { lang, from, page: location.pathname });
      if (href.includes("a.co/") || href.includes("amazon.")) return track("buy_click", { lang, from, page: location.pathname });
      if (href.endsWith(".pdf")) return track("pdf_download", { lang, file: href.split("/").pop() });
      if (ch) return track("chapter_open", { lang, chapter: Number(ch[1]), from, chapter_lang: href.includes("/chapter/") ? "en" : href.includes("/capitulo/") ? "es" : href.includes("/shou/") ? "ja" : href.includes("/zhang/") ? "zh" : "vi" });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
