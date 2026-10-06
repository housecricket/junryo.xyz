# Mười phần trăm còn lại · trang giới thiệu sách (Next.js)

Trang giới thiệu sách ba ngôn ngữ, xuất ra web tĩnh:

| Đường dẫn | Ngôn ngữ | Bìa |
|---|---|---|
| `/` | Tiếng Việt | `public/covers/vi.jpg` |
| `/en/` | English | `public/covers/en.jpg` |
| `/es/` | Español | `public/covers/en.jpg` (dùng chung bìa tiếng Anh) |
| `/chuong/1/` … | Đọc chương tiếng Việt | kèm nút tải PDF |
| `/en/chapter/1/` … | Đọc chương tiếng Anh | PDF chương 1 |
| `/es/capitulo/1/` … | Đọc chương tiếng Tây Ban Nha | |
| `/trich/…`, `/en/quote/…`, `/es/cita/…` | Trang từng câu trích, kèm ảnh chia sẻ | |

Bấm vào chương đã ra trong mục lục sẽ mở trang đọc. Ở bản tiếng Anh và Tây Ban Nha, chương chưa dịch
sẽ mở bản tiếng Việt (có lá cờ nhỏ bên cạnh tên chương để báo trước).

## Tự chọn ngôn ngữ theo vị trí

Khi ai đó mở trang chủ (`/`) lần đầu, trang tự chuyển theo vị trí của họ:

| Vị trí (theo múi giờ của máy) | Trang |
|---|---|
| Việt Nam | `/` tiếng Việt |
| Peru, Mexico, Colombia, Argentina, Chile… và Tây Ban Nha | `/es/` |
| Nơi khác | theo ngôn ngữ trình duyệt (tiếng Việt / Tây Ban Nha), không thì `/en/` |

Trang là web tĩnh nên không đọc được IP ở máy chủ; trang dùng múi giờ của máy người đọc, gần như trùng
với quốc gia, không gọi dịch vụ ngoài. Người đọc bấm cờ để đổi thì trang nhớ lựa chọn đó. Link thẳng tới một
chương (`/chuong/2/`…) và Google không bị chuyển hướng. Danh sách múi giờ ở `lib/geo.ts`.

## Đo lượt truy cập (Google Analytics 4)

Đã gắn sẵn Measurement ID `G-FE2BPRQ831` trong `lib/analytics.ts`. Xem số liệu ở analytics.google.com
(Reports → Realtime để thấy người đang xem ngay lúc này).

Ngoài lượt xem trang, trang tự ghi các sự kiện (xem trong GA: Reports → Engagement → Events):

| Sự kiện | Khi nào | Thông tin kèm theo |
|---|---|---|
| `chapter_open` | bấm mở một chương | `chapter`, `lang`, `from` (toc, this_week, chapter_end, prev_next, excerpt…), `chapter_lang` |
| `read_progress` | đọc tới 25% / 50% / 90% chương | `chapter`, `percent` |
| `subscribe_click` | bấm đăng ký bản tin LinkedIn | `from`, `page` |
| `buy_click` | bấm mua trên Amazon | `from`, `page` |
| `pdf_download` | tải PDF | `file` |
| `share_quote` | chia sẻ câu trích | `page` |
| `lang_switch`, `theme_toggle`, `author_click` | đổi ngôn ngữ, bật đọc đêm, bấm LinkedIn tác giả | |

Muốn xem theo chương: trong GA vào Admin → Custom definitions → tạo custom dimension `chapter`, `from`, `percent`.

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
- **Vercel (đang dùng):** tự động khi push, xem mục "Xuất bản trên Vercel"

Trước khi build bản thật, đặt tên miền để ảnh chia sẻ trên Facebook/LinkedIn hiện đúng:

```bash
NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban.com npm run build
```

## Xuất bản trên Vercel

Repo GitHub đã nối với Vercel: mỗi lần `git push` lên `master`, Vercel tự build (`npm run build`) và đăng lên
https://dangtrunganh.me.

Để chương mới **mở dần theo lịch** và **đủ chương lúc 0:00 thứ Hai**, trang cần được build lại theo giờ. Việc này do
`.github/workflows/deploy.yml` làm: theo lịch, nó gọi Deploy Hook của Vercel. Cài một lần:

1. Vercel → Project → **Settings → Git → Deploy Hooks** → tạo hook (tên tuỳ ý, nhánh `master`), chép URL.
2. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:
   tên `VERCEL_DEPLOY_HOOK`, giá trị là URL vừa chép.
3. Thử ngay: GitHub → tab **Actions** → "Rebuild on schedule (Vercel)" → **Run workflow**; trên Vercel sẽ thấy một
   lần build mới.

Mỗi ngày khoảng 16 lần build theo lịch, nằm trong giới hạn gói miễn phí của Vercel.

## Các file của git và GitHub

| File | Để làm gì |
|---|---|
| `.gitignore` | Không đưa `node_modules/`, `.next/`, `out/`, file `.env` lên GitHub |
| `.gitattributes` | Thống nhất kiểu xuống dòng giữa Windows và macOS, đánh dấu ảnh là file nhị phân |
| `.editorconfig` | Thống nhất thụt lề 2 dấu cách, UTF-8 trong mọi trình soạn thảo |
| `.nvmrc` | Phiên bản Node.js (20) dùng cho máy bạn và GitHub Actions |
| `.env.example` | Mẫu biến môi trường, sao chép thành `.env.local` khi cần |
| `.github/workflows/deploy.yml` | Nhắc Vercel build lại theo lịch (mở dần chương, đủ chương 0:00 thứ Hai) |

## Thêm một chương mới

1. Đặt file Markdown vào `content/chapters/vi/5.md` (dòng đầu dạng `# Chương 5 – Tên chương`).
2. Ảnh minh hoạ đặt vào `public/illus/` và gọi trong bài bằng `![Chú thích](Minh_hoa_Ch5_Ten.jpg)`.
3. PDF đặt vào `public/pdf/chuong-5.pdf`.
4. Cách tự động: thêm phần đầu `start`/`release` (xem mục "Chương mới mở dần theo lịch") và đặt PDF vào `content/pdf/`.
5. Cách thủ công: thêm số chương vào `PUBLISHED.vi` và tên PDF vào `PDF_FILES.vi` trong `lib/chapters.ts`.
6. `git add -A && git commit -m "Chương 5" && git push` → trang tự cập nhật.

Bản dịch làm tương tự trong `content/chapters/en/` và `content/chapters/es/` (cùng số chương, cùng phần đầu
`start`/`release` nếu là chương mở dần). Quy ước dịch (tên riêng, tên mục, tiêu đề chương) ở `content/TRANSLATION_BRIEF.md`.

## Chương mới mở dần theo lịch

Chương mới được viết sẵn và đặt trong `content/chapters/vi/<số>.md`, với phần đầu:

```
---
start: 2026-10-05T00:00:00+07:00     ← 0:00 thứ Hai, bắt đầu tuần của chương
release: 2026-10-12T00:00:00+07:00   ← 0:00 thứ Hai tuần sau: đủ chương, kèm PDF
---
```

PDF của chương đặt sẵn ở `content/pdf/chuong-<số>.pdf` (chưa công khai cho tới giờ phát hành).

Từ lúc `start`, mỗi ngày trong hai khung giờ **6:30–7:30 sáng** và **18:30–23:30 tối** (giờ Việt Nam, sửa ở
`lib/schedule.ts` → `WINDOWS`), trang được build lại mỗi 30 phút (Vercel, theo lịch ở mục "Xuất bản trên Vercel") và mở thêm một phần chương, chia đều
theo thời gian tới lúc `release`. Người đọc thấy:

- Mục lục và dải "Tuần này": thanh **% · Đang lên dần** và link "Đọc phần đã mở".
- Trang chương: phần đã mở, con trỏ nhấp nháy ở dòng cuối, dòng "Đủ chương vào thứ Hai" và đồng hồ đếm ngược.
  Trang không hiện giờ mở phần tiếp theo.
- Đúng giờ `release`: chương thành chương đã phát hành, đủ câu đáng nhớ, thẻ "Tuần sau" và nút tải PDF.

Bạn không cần làm gì thêm trong tuần. Chuẩn bị chương sau: thả file `.md` (có `start`/`release` của tuần sau)
và PDF vào đúng chỗ, rồi push.

Xem trước trạng thái ở một thời điểm bất kỳ:

```bash
BUILD_NOW=2026-10-08T21:00:00+07:00 npm run build && npx serve out
```

Lưu ý: GitHub tạm dừng lịch chạy tự động nếu repo không có commit nào trong 60 ngày; nếu repo để công khai,
người đọc rành GitHub có thể xem trước file chương trong repo.

## Số người đăng ký bản tin

Mỗi ngày mở `content/subscribers.json` và thêm một dòng với số người đăng ký thật của ngày đó:

```json
[
  { "date": "2026-10-05", "count": 800 },
  { "date": "2026-10-06", "count": 1134 },
  { "date": "2026-10-07", "count": 1290 }
]
```

Trong ngày ghi ở dòng mới nhất (giờ Việt Nam), con số trên trang tăng dần từ số của ngày trước lên số mới:
trình duyệt kiểm tra mỗi phút, có người mới thì số nhảy lên. Tăng nhanh vào giờ người ta hay đọc LinkedIn
(sáng, tối), chậm vào ban đêm, và không bao giờ vượt quá số thật. Qua hết ngày thì đứng ở số mới cho tới khi
bạn thêm dòng tiếp theo. Thêm dòng xong thì push như thường; không cần sửa gì khác.

Con số hiện ở: phần đầu trang chủ, dải "Tuần sau", ô "Từng chương, miễn phí" cuối trang chủ và thẻ cuối chương.

## Những phần giữ chân người đọc

| Phần | Lấy dữ liệu từ đâu | Sửa ở đâu |
|---|---|---|
| Đếm ngược chương mới (trang chủ và cuối chương mới nhất) | Lịch ra chương | `lib/ui.ts` → `RELEASE` (mặc định 0:00 thứ Hai giờ Việt Nam; khi có chương đang mở dần thì đếm tới mốc `release` của chương đó) |
| Mở dần chương mới theo khung giờ | Phần đầu file chương (`start`, `release`) | `lib/schedule.ts` → `WINDOWS` |
| Thẻ "Tuần sau" cuối chương | Phần `## Tuần sau` cuối mỗi file chương | Viết trong file `.md` của chương |
| Câu đáng nhớ + nút chia sẻ LinkedIn | Các câu in đậm trong `## Sổ tay của Thắng Tất` | Viết trong file `.md` của chương |
| Thanh mời đăng ký khi đọc quá nửa chương, thanh tiến độ | Tự động | `components/ReadingAids.tsx` |

Nhớ viết phần `## Tuần sau` cho chương mới nhất trước khi đăng: đó là trailer mà người đọc thấy ngay khi đọc xong.

## Sửa nội dung thường gặp

| Muốn sửa | Mở file |
|---|---|
| Chữ ở cả ba ngôn ngữ, mục lục, đoạn đọc thử | `lib/content.ts` |
| Đánh dấu thêm chương đã ra | tự động theo `release`, hoặc `lib/chapters.ts` → `PUBLISHED` |
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
