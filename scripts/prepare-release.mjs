// Chạy trước mỗi lần build (npm run build): chương có lịch đã tới giờ phát hành
// thì chép PDF từ content/pdf/ sang public/pdf/ để người đọc tải được.
import fs from "node:fs";
import path from "node:path";

const now = process.env.BUILD_NOW ? new Date(process.env.BUILD_NOW) : new Date();
const dir = path.join("content", "chapters", "vi");
for (const f of fs.readdirSync(dir)) {
  const n = f.replace(/\.md$/, "");
  const head = fs.readFileSync(path.join(dir, f), "utf8").match(/^---\n([\s\S]*?)\n---/);
  const release = head?.[1].match(/^release:\s*(.+)$/m)?.[1];
  const src = path.join("content", "pdf", `chuong-${n}.pdf`);
  const dst = path.join("public", "pdf", `chuong-${n}.pdf`);
  if (release && now >= new Date(release) && fs.existsSync(src) && !fs.existsSync(dst)) {
    fs.copyFileSync(src, dst);
    console.log(`Phát hành chương ${n}: đã chép PDF`);
  }
}
