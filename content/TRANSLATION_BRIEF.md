# Translation brief – "Mười phần trăm còn lại" / "The Last 10%" / "El último 10 %"

A serialized management novel. Each chapter = a story at Hải Đăng (a fictional company that rents AI agents to one-person companies), "theory corner" boxes, a notebook, reader questions, a reference line, and a "next week" teaser.

## Voice
- Literary, smooth, quietly tense, image-rich. Read like a published novel, not a translation. Short clear sentences; no flourishes the original doesn't have.
- Faithful to meaning and every plot detail. Do NOT add, cut or explain plot points. Subtle details (e.g. things about Trung) must stay exactly as subtle as the original.
- English reference for tone: `content/chapters/en/1.md` (already published). Match its style and conventions.
- Spanish: neutral Latin American Spanish (readers mainly in Peru/Latin America). Use "tú" when the book addresses the reader. Natural dialogue punctuation with Spanish quotes “…” as in the source (keep curly quotes) — do not switch to em-dash dialogue.

## Names and terms (never translate or change)
- People: Trần Thắng Tất (often "Thắng Tất"), Nguyễn Lực Sỹ ("Lực Sỹ"), Trung, Ngọc Mai, Quân, Phong, chị Hằng → "Hằng", bác sĩ Diệp → "Dr. Diệp" / "la doctora Diệp".
- Company: Hải Đăng (keep with diacritics). Do not re-gloss "lighthouse" (chapter 1 already did).
- "agent" stays "agent" in English; in Spanish use "agente/agentes".
- Product names: "Gói ngủ yên" → EN "the Sound Sleep package", ES "el Paquete Sueño Tranquilo". "Dự án Tự hành" → EN "Project Autonomy", ES "el Proyecto Autonomía".
- "cuốn sách của Trung" / "cuốn sách cũ" → EN "Trung’s book" / "the old book"; ES "el libro de Trung" / "el viejo libro".
- Vietnamese honorifics (anh, chị, em) are dropped; convey politeness through tone.

## Structure (keep EXACTLY, same order, same number of paragraphs/blocks — the site reveals chapters block by block)
- If the source starts with a `---` front-matter block, copy it **verbatim** (do not translate it).
- Line 1: `# Chapter N – Title` / `# Capítulo N – Título` using these titles:
  - EN: 1 Where It Hurts · 2 The Immigrant · 3 Today, Like Yesterday · 4 Selling an Idea · 5 Hard Problems Are Magnets · 6 People Unlike Us
  - ES: 1 Donde duele · 2 El inmigrante · 3 Hoy, igual que ayer · 4 Vender una idea · 5 Los retos difíciles son imanes · 6 Gente distinta a nosotros
- If the source has a byline line like `Oct 5, 2026 · @dangtrunganh`, keep it unchanged.
- `##` section headings: translate.
- Images: keep the line, translate only the alt text, keep the file name: `![translated alt](Minh_hoa_....jpg)`.
- Theory boxes are blockquotes starting `> **Góc lý thuyết – X**` → EN `> **Theory corner – X**`, ES `> **Rincón de teoría – X**`. Keep every `>` line and the empty `>` lines. Keep cited author names, journal titles (italics) and years exactly.
- `## Sổ tay của Thắng Tất` → EN `## Thắng Tất’s Notebook`, ES `## Cuaderno de Thắng Tất`. Keep the numbered list with **bold first sentence** format.
- `### Dành cho bạn` → EN `### Over to you`, ES `### Para ti`.
- The `---` rule and the italic references line: EN starts `*Further reading: …*`, ES `*Lecturas: …*`; keep publication titles in their original language; end with the fictional-characters sentence translated.
- `## Tuần sau` → EN `## Next Week`, ES `## La próxima semana`. Next line `**Chapter N – Title**` / `**Capítulo N – Título**` (titles above). Translate the italic hook and description.
- Closing CTA paragraph (starts with bold "Cuốn sách đang được viết…"): EN like chapter 1 ("**This book is being written in public, one chapter a week on LinkedIn.** Follow along and subscribe to the *The Last 10%* newsletter…"); ES "**Este libro se escribe en público, un capítulo por semana en LinkedIn.** Suscríbete al boletín…". Translate the reader question.
- Amazon line `**Đặt mua sách trên Amazon:** [a.co/d/0jbHvq34](https://a.co/d/0jbHvq34)` → EN `**Get the book on Amazon:**`, ES `**Compra el libro en Amazon:**`, same link.
- Keep markdown italics/bold where the source has them.

## Output
Write the whole translated chapter to the output path you are given (UTF-8, Unix newlines, final newline). Then re-read it once against the source to check nothing is missing (compare section by section, count paragraphs per section) and fix any gap. Reply with one line: the output path, its word count, and "blocks: <n source> / <n output>" where blocks = paragraphs separated by blank lines.
