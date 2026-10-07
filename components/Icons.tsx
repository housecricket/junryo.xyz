// Icon đơn sắc. Cờ dùng class .f (màu mực) và .b (màu nền) nên tự đảo màu ở chế độ tối.
import type { Lang } from "@/lib/content";

function Frame() {
  return <rect className="fr" x=".6" y=".6" width="28.8" height="18.8" />;
}

export function Flag({ lang }: { lang: Lang }) {
  return (
    <svg className="flag" viewBox="0 0 30 20" aria-hidden="true">
      <rect className="f" width="30" height="20" />
      {lang === "vi" && (
        <polygon
          className="b"
          points="15,4 16.76,9.43 22.47,9.43 17.85,12.79 19.62,18.22 15,14.86 10.38,18.22 12.15,12.79 7.53,9.43 13.24,9.43"
        />
      )}
      {lang === "en" && (
        <>
          <path className="bs" d="M0,0L30,20M30,0L0,20" strokeWidth="3.2" />
          <rect className="b" x="12" width="6" height="20" />
          <rect className="b" y="7" width="30" height="6" />
          <rect className="f" x="13.6" width="2.8" height="20" />
          <rect className="f" y="8.6" width="30" height="2.8" />
        </>
      )}
      {lang === "es" && <rect className="b" y="5" width="30" height="10" />}
      {lang === "ja" && <circle className="b" cx="15" cy="10" r="5.5" />}
      {lang === "zh" && <polygon className="b" points="7,2.6 8.45,6.6 12.7,6.75 9.35,9.35 10.5,13.45 7,11.05 3.5,13.45 4.65,9.35 1.3,6.75 5.55,6.6" />}
      <Frame />
    </svg>
  );
}

const line = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" {...line} strokeWidth="2" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...line} strokeWidth="1.5" aria-hidden="true">
      <path d="M5 4.5h10.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" />
      <path d="M5 17a3 3 0 0 1 3-3h10.5" />
      <path d="M9 8h6" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" {...line} strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function OpenBookIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true" style={style}>
      <path
        d="M12 6.5C10.2 5.2 7.6 4.6 4 4.6v13.2c3.6 0 6.2.6 8 1.9 1.8-1.3 4.4-1.9 8-1.9V4.6c-3.6 0-6.2.6-8 1.9z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 6.5v13.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function LegendDot({ on }: { on?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" style={{ flex: "none" }}>
      <circle cx="6" cy="6" r="5" fill={on ? "#FFFFFF" : "#2E2E2C"} stroke={on ? "#FFFFFF" : "#6B6B68"} strokeWidth="1" />
    </svg>
  );
}

/** Đồng hồ nhỏ: chương sắp ra mắt */
export function ClockIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true" style={style} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
