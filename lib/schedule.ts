// Lịch mở dần chương mới. Mọi giờ tính theo giờ Việt Nam (UTC+7, không đổi giờ mùa hè).
// Chương được viết sẵn; trong các khung giờ dưới đây, trang web mở thêm từng đoạn
// cho đến khi đủ chương vào giờ phát hành.

export const TZ_OFFSET_MIN = 7 * 60;

/** Khung giờ mở dần mỗi ngày: [bắt đầu, kết thúc] dạng "HH:MM" giờ Việt Nam */
export const WINDOWS: [string, string][] = [
  ["06:30", "07:30"],
  ["18:30", "23:30"],
];

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Phút trong ngày (giờ VN) và ngày (giờ VN, tính bằng số ngày từ 1970) của một thời điểm */
function vn(d: Date) {
  const t = d.getTime() / 60000 + TZ_OFFSET_MIN;
  return { day: Math.floor(t / 1440), min: ((t % 1440) + 1440) % 1440 };
}

/** Thời điểm bắt đầu của ngày (giờ VN) + phút → Date */
function at(day: number, min: number) {
  return new Date((day * 1440 + min - TZ_OFFSET_MIN) * 60000);
}

/** Tổng số phút nằm trong các khung giờ, giữa a và b */
export function windowMinutes(a: Date, b: Date): number {
  if (b <= a) return 0;
  let total = 0;
  const A = vn(a).day;
  const B = vn(b).day;
  for (let day = A; day <= B; day++) {
    for (const [s, e] of WINDOWS) {
      const ws = at(day, toMin(s)).getTime();
      const we = at(day, toMin(e)).getTime();
      const lo = Math.max(ws, a.getTime());
      const hi = Math.min(we, b.getTime());
      if (hi > lo) total += (hi - lo) / 60000;
    }
  }
  return total;
}

/** Tỷ lệ đã mở (0..1) của một chương bắt đầu lúc start, phát hành đủ lúc release */
export function revealFraction(start: Date, release: Date, now: Date): number {
  if (now >= release) return 1;
  if (now <= start) return 0;
  const total = windowMinutes(start, release);
  return total > 0 ? Math.min(1, windowMinutes(start, now) / total) : 0;
}

/** Đang trong khung giờ mở dần? */
export function inWindow(now: Date): boolean {
  const { min } = vn(now);
  return WINDOWS.some(([s, e]) => min >= toMin(s) && min < toMin(e));
}

/** Lần mở tiếp theo (bắt đầu khung giờ kế tiếp) */
export function nextWindowStart(now: Date): Date {
  const { day, min } = vn(now);
  for (let d = day; d <= day + 2; d++) {
    for (const [s] of WINDOWS) {
      const m = toMin(s);
      if (d > day || m > min) return at(d, m);
    }
  }
  return at(day + 1, toMin(WINDOWS[0][0]));
}

/** Thời điểm build (có thể giả lập bằng BUILD_NOW=2026-10-08T20:00:00+07:00 để xem trước) */
export function buildNow(): Date {
  return process.env.BUILD_NOW ? new Date(process.env.BUILD_NOW) : new Date();
}
