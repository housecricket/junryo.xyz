// Số người đăng ký bản tin LinkedIn.
// Mỗi ngày thêm một dòng vào content/subscribers.json: { "date": "YYYY-MM-DD", "count": số thật của ngày đó }.
// Trong ngày đó (giờ Việt Nam), con số trên trang tăng dần từ số của ngày trước lên số mới,
// nhanh hơn vào giờ người ta hay đọc LinkedIn, chậm vào ban đêm. Không bao giờ vượt quá số thật.
import data from "@/content/subscribers.json";

export type Entry = { date: string; count: number };
export const ENTRIES: Entry[] = [...(data as Entry[])].sort((a, b) => a.date.localeCompare(b.date));

const TZ_OFFSET_MIN = 7 * 60;

/** Mức độ người đăng ký theo từng giờ trong ngày (giờ Việt Nam) */
const HOUR_WEIGHT = [1, 0.5, 0.3, 0.3, 0.3, 0.6, 1.5, 3, 4, 4, 3.5, 3, 3.5, 3, 3, 3, 3, 3.5, 4, 4.5, 5, 4.5, 3, 2];
const TOTAL = HOUR_WEIGHT.reduce((a, b) => a + b, 0);

/** Tỷ lệ của ngày đã trôi qua, có trọng số theo giờ (0..1) */
function dayProgress(minuteOfDay: number) {
  const h = Math.floor(minuteOfDay / 60);
  let done = 0;
  for (let i = 0; i < h; i++) done += HOUR_WEIGHT[i];
  done += HOUR_WEIGHT[h] * ((minuteOfDay % 60) / 60);
  return done / TOTAL;
}

/** Số hiển thị tại thời điểm now */
export function countAt(now: Date, entries: Entry[] = ENTRIES): number {
  if (!entries.length) return 0;
  const t = now.getTime() / 60000 + TZ_OFFSET_MIN; // phút theo giờ VN
  const today = new Date(Math.floor(t / 1440) * 1440 * 60000).toISOString().slice(0, 10);
  const minute = Math.floor(((t % 1440) + 1440) % 1440);

  let shown = entries[0].count;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const prev = i > 0 ? entries[i - 1].count : e.count;
    if (e.date < today) shown = e.count; // ngày đã qua: số đầy đủ
    else if (e.date === today) shown = prev + Math.floor((e.count - prev) * dayProgress(minute));
    else break; // ngày chưa tới: giữ số cũ
  }
  return shown;
}
