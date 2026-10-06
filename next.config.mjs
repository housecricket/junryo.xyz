/** @type {import('next').NextConfig} */

// Khi đưa lên GitHub Pages dạng https://<tên>.github.io/<tên-repo>/, trang nằm trong thư mục con.
// Workflow trong .github/workflows/deploy.yml tự đặt biến NEXT_PUBLIC_BASE_PATH = "/<tên-repo>".
// Với tên miền riêng hoặc Netlify/Vercel thì để trống.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  // Xuất ra web tĩnh (thư mục out/) để đưa lên bất kỳ host nào: GitHub Pages, Netlify, Vercel, Cloudflare Pages...
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
