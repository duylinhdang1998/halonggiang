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

Ứng dụng dùng React, Vinext/Vite, Tailwind CSS và GSAP ScrollTrigger. Build hiện tại sử dụng Cloudflare; lệnh `npm start` chạy bản build bằng Wrangler. Việc đẩy repo lên GitHub không tự triển khai website.

## Các phần chính

- `components/profile/`: nhân vật, card, đường sáng và giao diện hồ sơ.
- `hooks/use-profile-scroll.ts`: điều khiển tiến trình cuộn.
- `hooks/use-illustration-anchors.ts`: căn đường sáng theo vị trí ảnh.
- `lib/profile.ts`, `lib/profile-cards.ts`: nội dung hồ sơ.
- `public/giang-character.png`: ảnh hoạt hình đã duyệt, được dùng trực tiếp ở trang chủ.
- `public/brands/`: logo BISC và 9learning.

Các thư mục `blender-character/`, `model-workbench/`, `public/models/` và trang `/model-lab` lưu các thử nghiệm 3D trước đây. Trang chủ hiện tại không tải model 3D. Các script thử nghiệm Blender có thể cần công cụ và file trung gian bên ngoài repo; chúng không cần thiết để chạy website.
