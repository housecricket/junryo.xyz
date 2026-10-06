// Hiển thị chuỗi có sẵn thẻ định dạng nhỏ (<b>, <i>, <em>, <a>) lấy từ lib/content.ts.
type Tag = "span" | "p" | "div" | "h1" | "h2" | "h3" | "blockquote";

export default function Html({
  as: As = "span",
  html,
  className,
  style,
}: {
  as?: Tag;
  html: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return <As className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
