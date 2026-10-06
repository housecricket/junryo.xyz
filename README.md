# Mười phần trăm còn lại · trang giới thiệu sách (Next.js)

Trang giới thiệu sách ba ngôn ngữ, xuất ra web tĩnh:

| Đường dẫn | Ngôn ngữ | Bìa |
|---|---|---|
| `/` | Tiếng Việt | `public/covers/vi.jpg` |
| `/en/` | English | `public/covers/en.jpg` |
| `/es/` | Español | `public/covers/en.jpg` (dùng chung bìa tiếng Anh) |
| `/chuong/1/` … `/chuong/4/` | Đọc chương tiếng Việt | kèm nút tải PDF |
| `/en/chapter/1/` | Đọc chương 1 tiếng Anh | kèm nút tải PDF |

Bấm vào chương đã ra trong mục lục sẽ mở trang đọc. Ở bản tiếng Anh và Tây Ban Nha, chương chưa dịch
sẽ mở bản tiếng Việt (có lá cờ nhỏ bên cạnh tên chương để báo trước).

## Chạy thử trên máy

Cần Node.js 20 trở lên.

```bash
npm install
npm run dev        # mở http://localhost:3000
```

## Xuất ra web để đưa lên host

```bash
npm run build      # tạo thư mục out/
```

Toàn bộ trang nằm trong thư mục `out/`. Tải thư mục đó lên bất kỳ host tĩnh nào:

- **Netlify:** kéo thả thư mục `out/` vào app.netlify.com/drop
- **Vercel / Cloudflare Pages:** kết nối repo GitHub, lệnh build `npm run build`, thư mục xuất `out`
- **GitHub Pages:** tự động, xem mục bên dưới

Trước khi build bản thật, đặt tên miền để ảnh chia sẻ trên Facebook/LinkedIn hiện đúng:

```bash
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.com npm run build
```

## Đưa lên GitHub và tự xuất bản bằng GitHub Pages

Thư mục này đã là một repo git, có sẵn một commit đầu tiên trên nhánh `main`.

1. Vào github.com → **New repository**, đặt tên (vd `muoi-phan-tram`), **không** tích thêm README hay .gitignore.
2. Trong thư mục dự án, chạy:

   ```bash
   git remote add origin https://github.com/<tên-github-của-bạn>/muoi-phan-tram.git
   git push -u origin main
   ```

3. Trên GitHub, vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.
4. Mở tab **Actions** để xem quá trình build. Khoảng 1–2 phút sau trang có ở
   `https://<tên-github-của-bạn>.github.io/muoi-phan-tram/`.

Từ đó, mỗi lần sửa và `git push` lên `main`, trang tự cập nhật.

**Dùng tên miền riêng:** vào Settings → Pages → Custom domain, nhập tên miền, rồi xoá dòng
`NEXT_PUBLIC_BASE_PATH` trong `.github/workflows/deploy.yml` và đặt `NEXT_PUBLIC_SITE_URL` thành tên miền đó.

## Các file của git và GitHub

| File | Để làm gì |
|---|---|
| `.gitignore` | Không đưa `node_modules/`, `.next/`, `out/`, file `.env` lên GitHub |
| `.gitattributes` | Thống nhất kiểu xuống dòng giữa Windows và macOS, đánh dấu ảnh là file nhị phân |
| `.editorconfig` | Thống nhất thụt lề 2 dấu cách, UTF-8 trong mọi trình soạn thảo |
| `.nvmrc` | Phiên bản Node.js (20) dùng cho máy bạn và GitHub Actions |
| `.env.example` | Mẫu biến môi trường, sao chép thành `.env.local` khi cần |
| `.github/workflows/deploy.yml` | Tự build và xuất bản lên GitHub Pages khi push lên `main` |
| `public/.nojekyll` | Cho GitHub Pages phục vụ đúng thư mục `_next/` của Next.js |

## Thêm một chương mới

1. Đặt file Markdown vào `content/chapters/vi/5.md` (dòng đầu dạng `# Chương 5 – Tên chương`).
2. Ảnh minh hoạ đặt vào `public/illus/` và gọi trong bài bằng `![Chú thích](Minh_hoa_Ch5_Ten.jpg)`.
3. PDF đặt vào `public/pdf/chuong-5.pdf`.
4. Trong `lib/chapters.ts`: thêm `5` vào `AVAILABLE.vi` và `5: "chuong-5.pdf"` vào `PDF_FILES.vi`.
5. Trong `lib/content.ts`: đổi `RELEASED` thành `5`.
6. `git add -A && git commit -m "Chương 5" && git push` → trang tự cập nhật.

Bản dịch tiếng Anh làm tương tự trong `content/chapters/en/` và `AVAILABLE.en`.

## Sửa nội dung thường gặp

| Muốn sửa | Mở file |
|---|---|
| Chữ ở cả ba ngôn ngữ, mục lục, đoạn đọc thử | `lib/content.ts` |
| Đánh dấu thêm chương đã ra | `lib/content.ts` → tăng `RELEASED` |
| Link Amazon, link LinkedIn | `lib/content.ts` → `AMAZON_URL`, `LINKEDIN_URL` |
| Ảnh bìa | thay file trong `public/covers/` |
| Màu, phông, khoảng cách | `app/globals.css` (phần `:root` ở đầu file) |
| Bố cục các khối | `components/BookPage.tsx` |

## Cấu trúc

```
app/
  (vi)/layout.tsx, page.tsx      → /
  (en)/layout.tsx, en/page.tsx   → /en/
  (es)/layout.tsx, es/page.tsx   → /es/
  globals.css
components/
  BookPage.tsx      toàn bộ trang, nhận ngôn ngữ làm tham số
  LangSwitcher.tsx  ba lá cờ đen trắng
  Icons.tsx         cờ và icon
lib/
  content.ts        nội dung ba ngôn ngữ
  site.ts           đường dẫn, bìa, thẻ SEO
  fonts.ts          Playfair Display, Lora, Be Vietnam Pro (tự tải qua next/font)
```

Mỗi ngôn ngữ là một trang riêng có `lang` và thẻ `hreflang` đúng, nên Google hiểu và hiển thị đúng bản cho từng người đọc.
