# Hà Long Giang — Hồ sơ nhà sáng lập

Website giới thiệu Hà Long Giang với ảnh nhân vật hoạt hình cố định, hiệu ứng cuộn giữ nguyên khung hình, chuyển từ lưới sang màu, card thông tin và đường sáng kết nối. Bản hiện tại không có thao tác xoay hoặc zoom nhân vật.

## Chạy local

Yêu cầu Node.js 22.13 trở lên và npm.

```sh
npm ci
npm run dev -- --port 3000
```

Mở http://localhost:3000/. Không cần đăng nhập ChatGPT hay cung cấp API key để xem website local.

## Kiểm tra và build

```sh
npx tsc --noEmit
npm test
npm run lint
npm run build
```

Ứng dụng dùng React, Vinext/Vite, Tailwind CSS và GSAP ScrollTrigger. Build hiện tại sử dụng Cloudflare; lệnh `npm start` chạy bản build bằng Wrangler. Project Vercel `halonggiang` được kết nối với nhánh `main` của repo GitHub. Push lên `main` sẽ tự build và cập nhật production.

## Các phần chính

- `components/profile/`: nhân vật, card, đường sáng và giao diện hồ sơ.
- `hooks/use-profile-scroll.ts`: điều khiển tiến trình cuộn.
- `hooks/use-illustration-anchors.ts`: căn đường sáng theo vị trí ảnh.
- `lib/profile.ts`, `lib/profile-cards.ts`: nội dung hồ sơ.
- `public/giang-character.png`: ảnh hoạt hình đã duyệt, được dùng trực tiếp ở trang chủ.
- `public/brands/`: logo BISC và 9learning.

Các thư mục `blender-character/`, `model-workbench/`, `public/models/` và trang `/model-lab` lưu các thử nghiệm 3D trước đây. Trang chủ hiện tại không tải model 3D. Các script thử nghiệm Blender có thể cần công cụ và file trung gian bên ngoài repo; chúng không cần thiết để chạy website.

## Background Lightfall

Background dùng component Lightfall của [React Bits](https://reactbits.dev/backgrounds/lightfall), Copyright (c) 2026 David Haz, theo [MIT + Commons Clause](licenses/react-bits-LICENSE.md). Shader được giữ từ upstream; phần tích hợp chỉnh bảng màu, tốc độ, mật độ, giới hạn 30 fps, dừng render khi tab ẩn và nền tĩnh khi người dùng bật giảm chuyển động.

## Tự động build trên Vercel

`vercel.json` cấu hình Vite, `npm ci`, lệnh `npm run build:vercel` và output `dist/vercel`. Root Directory là gốc repository (`.`). Không cần API key hay biến môi trường để chạy website. Bản Vercel dùng lại trang React, CSS và assets hiện tại qua entry `vercel-app/main.tsx`; bản local Vinext vẫn chạy với `npm run dev`.

```sh
npm run build:vercel
npm run preview:vercel
```

Production: https://halonggiang.vercel.app/

## SEO và hồ sơ chuyên môn

- `/`: hồ sơ tương tác, tên Hà Long Giang (Giang Ha), Founder BISC & 9Learning.
- `/ho-so/`: hồ sơ đọc đầy đủ, chuyên môn ACCA/FCCA, ICAEW và CA Singapore, kèm nguồn công khai.
- `lib/seo.ts`: tiêu đề, mô tả, tên miền chính và ảnh chia sẻ.
- `lib/profile-schema.ts`: dữ liệu ProfilePage, Person, Organization và danh vị có nguồn.
- `scripts/prerender.mjs`: xuất HTML thực của cả hai trang khi build, cùng sitemap.xml và robots.txt. Trình duyệt hydrate cùng component React để giữ hiệu ứng.
- `tests/seo.test.mjs`: kiểm tra HTML trước JavaScript, canonical, dữ liệu có cấu trúc, chứng chỉ và sitemap; tự chạy trong build Vercel.

Danh vị CA (Singapore) dẫn bài công khai do chủ hồ sơ cung cấp; không thay thế việc tra cứu registry nghề nghiệp. Không tạo từ khóa ẩn, đánh giá hoặc chứng chỉ không có nguồn.

Sau triển khai, xác minh URL-prefix `https://halonggiang.vercel.app/` trong Google Search Console, sau đó gửi `sitemap.xml` và yêu cầu lập chỉ mục hai URL. Chưa cấu hình mã xác minh Search Console trong repository. Khi đổi tên miền, cập nhật canonical, sitemap và các URL trong metadata cùng lúc.
