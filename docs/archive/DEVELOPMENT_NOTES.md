# ZINITEK — Development Notes Archive

> [!WARNING]
> **Tài liệu lưu trữ — không phải tài liệu trạng thái hiện tại của dự án.**
>
> File này tổng hợp các ghi chú, hướng dẫn, prompt AI, lỗi từng gặp và ý tưởng trong quá trình phát triển website ZINITEK.
> Một số nội dung bên dưới đã được triển khai, thay đổi kiến trúc hoặc không còn đúng với source code hiện tại.
>
> Khi cần biết trạng thái dự án hiện tại, ưu tiên đọc source code và `ZINITEK_PROJECT_MEMORIES.md`.

---

## 1. Ghi chú khởi động dự án

Các lệnh cơ bản từng sử dụng:

```bash
npm install
npm run dev
```

Các ý tưởng/tính năng từng được ghi chú ở giai đoạn đầu:

- Prefetching.
- Website công nghiệp đa trang.
- Responsive/mobile-first.
- Dark mode.
- Điều hướng mobile bằng thao tác vuốt.
- Đa ngôn ngữ.
- SEO đa quốc gia.
- Quản lý nội dung động bằng CMS.

Bản gốc ban đầu từng được đánh dấu dưới tên/ý tưởng:

```text
industrial-website-component
```

---

# 2. Giai đoạn chuyển website sang đa ngôn ngữ

## 2.1. Mục tiêu ban đầu

Website ban đầu được xây theo cấu trúc tương đối phẳng. Kế hoạch lúc đó là chuyển sang URL có ngôn ngữ:

```text
/[lang]/...
```

Các ngôn ngữ mục tiêu:

```text
vi  Tiếng Việt
en  English
jp  日本語
kr  한국어
cn  中文
```

Mục tiêu chính:

- UI tĩnh lấy text từ dictionary JSON.
- Nội dung động lấy theo ngôn ngữ tương ứng.
- URL rõ ràng cho SEO.
- Có cơ chế fallback khi thiếu bản dịch.

---

## 2.2. Text Audit

Các file từng được xác định là nguồn text quan trọng cần rà soát:

```text
components/navigation.tsx
components/hero-section.tsx
app/about/page.tsx
lib/services-data.ts
```

Mục tiêu của bước này là:

1. Tìm toàn bộ chuỗi text đang hard-code trong giao diện.
2. Chuyển chúng thành key.
3. Tạo dictionary tiếng Việt làm bản gốc.
4. Dịch sang EN / JP / KR / CN.

Ví dụ key:

```text
navigation.contact
service.cnc.title
service.cnc.description
```

---

## 2.3. Prompt AI từng sử dụng để tạo dictionary

Prompt cũ được lưu lại để tham khảo:

> Đây là source code website cơ khí ZINITEK. Hãy đóng vai chuyên gia localization, trích xuất toàn bộ strings hiển thị trên giao diện thành cấu trúc JSON. Tạo `dictionaries/vi.json` làm bản gốc, sau đó dịch sang English, Japanese, Korean và Chinese. Giữ chính xác các thuật ngữ kỹ thuật như Gia công CNC, Khuôn dập nguội, Máy Nhật bãi, Tính lắp lẫn.

### Kinh nghiệm rút ra

Không nên yêu cầu AI xử lý cả 5 ngôn ngữ trong một lần khi dữ liệu quá lớn.

Quy trình an toàn hơn:

```text
VI + EN
   ↓
kiểm tra cấu trúc/key
   ↓
JP
   ↓
KR
   ↓
CN
```

Đặc biệt phải kiểm tra thuật ngữ cơ khí vì dịch máy có thể dịch sai nghĩa chuyên ngành.

---

# 3. Cấu trúc i18n từng được lên kế hoạch

Cấu trúc mục tiêu ở giai đoạn chuyển đổi:

```text
app/
├── [lang]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── portfolio/
│   └── services/
│
├── api/
└── globals.css

dictionaries/
├── vi.json
├── en.json
├── jp.json
├── kr.json
└── cn.json
```

Ý tưởng phân chia dữ liệu:

### Nội dung tĩnh

Ví dụ:

- Menu.
- Button.
- Label.
- Form text.
- Footer.

Nguồn dữ liệu:

```text
dictionaries/*.json
```

### Nội dung động

Ví dụ:

- Service.
- Product.
- Blog.
- Portfolio.

Kế hoạch ban đầu là lấy dữ liệu theo biến `lang` từ URL. Sau này phần này được phát triển sâu hơn bằng Sanity CMS.

---

# 4. Quy trình di chuyển thư mục cũ

Đây là ghi chú của quá trình refactor ban đầu, không phải hướng dẫn cần thực hiện lại.

Các thư mục từng được di chuyển vào `app/[lang]`:

```text
about
blog
contact
portfolio
services
page.tsx
layout.tsx
```

Các lưu ý khi đó:

- Dừng dev server trước khi di chuyển nhiều file.
- Kiểm tra lại import sau khi đổi vị trí.
- Có thể xuất hiện 404 tạm thời trong lúc refactor.
- Sau khi di chuyển cần sửa `layout.tsx` để nhận `lang` từ URL.

---

# 5. Middleware / Proxy / Auto Language

## 5.1. Ý tưởng ban đầu

Hệ thống từng được thiết kế với mục tiêu đọc:

```http
Accept-Language
```

Sau đó ánh xạ mã trình duyệt sang mã nội bộ:

```text
ja → jp
ko → kr
zh → cn
```

Các locale còn lại có thể fallback sang ngôn ngữ mặc định.

> [!NOTE]
> Đây là mô tả kiến trúc/ý tưởng trong lịch sử phát triển. Không được dùng phần này để kết luận behavior của source hiện tại nếu chưa kiểm tra `proxy.ts` hoặc middleware đang chạy.

---

# 6. SEO — Robots và Sitemap

## 6.1. Lỗi từng gặp

Thông báo cũ:

```text
robots.txt is not valid — 1 error found
```

Các nguyên nhân từng được xem xét:

- Sai cú pháp `User-agent`, `Allow`, `Disallow`.
- Sitemap không dùng URL tuyệt đối.
- File có BOM/ký tự ẩn.
- Khoảng trắng hoặc format không hợp lệ.

Ví dụ robots.txt thủ công từng được đề xuất:

```text
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://zinitek.com/sitemap.xml
```

## 6.2. Hướng Next.js Metadata Route

Sau đó hướng tiếp cận được đề xuất là dùng:

```text
app/robots.ts
app/sitemap.ts
```

thay cho file `.txt` viết tay để dễ kiểm soát hơn.

> Domain và cấu hình trong ví dụ cũ có thể không còn đúng. Luôn kiểm tra source hiện tại trước khi thay đổi SEO.

---

# 7. Stack công nghệ từng được ghi nhận

Các ghi chú cũ từng mô tả dự án sử dụng:

- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- Lucide React.
- Framer Motion.
- Radix UI.
- Vercel Analytics.
- SSR / Server Components.

Một số tài liệu cũ còn ghi `Next.js 15+`; các ghi chú về sau ghi `Next.js 16`.

> Phiên bản chính xác phải lấy từ `package.json`, không lấy từ archive này.

---

# 8. UX/UI và Mobile

Các tính năng từng được ghi chú trong quá trình phát triển:

## Smart Swipe Navigation

Mục tiêu:

- Tối ưu thao tác vuốt trên mobile.
- Cho phép trải nghiệm điều hướng tự nhiên hơn trên màn hình cảm ứng.

Các thành phần từng được nhắc tới:

```text
SmartSwipeWrapper
@use-gesture/react
```

## Mobile Widget Indicator

Mục tiêu:

- Hỗ trợ điều hướng/CTA trên màn hình nhỏ.
- Giữ các thao tác quan trọng dễ tiếp cận.

## Visual Style

Phong cách giao diện từng được định hướng:

- Industrial / High-tech.
- Dark mode.
- Màu nền tối.
- Accent cam.
- Icon vector kỹ thuật.
- Responsive cho desktop/mobile.

---

# 9. Nội dung kỹ thuật ngành cơ khí

`lib/services-data.ts` từng là nguồn dữ liệu tập trung quan trọng trước khi dự án chuyển mạnh sang CMS.

Các nội dung từng được quản lý ở đây gồm:

- Gia công CNC.
- Khuôn mẫu.
- PLC / Automation.
- 3D Scan.
- Các thông số kỹ thuật.
- Quy trình gia công.
- Feature/service description.

### Nguyên tắc localization từng đặt ra

Không dịch máy một cách máy móc các thuật ngữ kỹ thuật.

Ví dụ:

```text
"Máy Nhật bãi"
```

không được hiểu theo nghĩa literal kiểu `scrap machine`; phải dịch theo ngữ cảnh thiết bị Nhật đã qua sử dụng.

---

# 10. Form báo giá / Contact

Một số ghi chú cũ mô tả kế hoạch form báo giá kỹ thuật có khả năng hỗ trợ file như:

```text
DWG
DXF
STEP
IGES
STL
PDF
```

Ngoài ra từng có ý tưởng:

- Form nhiều bước.
- Đính kèm file CAD/3D.
- CTA riêng cho mobile.
- Dùng dictionary để dịch label/form.

> Các giới hạn file, dung lượng upload và behavior thực tế phải kiểm tra implementation hiện tại.

---

# 11. Chuyển đổi sang Sanity CMS

Giai đoạn đầu website dùng nhiều dữ liệu tĩnh trong source.

Sau đó định hướng thay đổi thành:

```text
Static data
    ↓
Sanity CMS
    ↓
Dynamic multi-language content
```

Nội dung phù hợp đưa lên CMS:

- Services.
- Products.
- Portfolio/Projects.
- Blog.
- Nội dung SEO.

Dictionary vẫn phù hợp hơn với các thành phần UI nhỏ và text hệ thống.

---

# 12. Những đánh giá marketing cũ

Trong quá trình phát triển từng có các đoạn mô tả website bằng những cụm như:

```text
Global Accessibility - Local Experience
Ready for Global Marketing
Deep Tech
High-Tech UX/UI
```

Các đoạn này chủ yếu là **nhận xét/marketing copy do AI tạo**, không phải kết quả audit kỹ thuật.

Không nên sử dụng trực tiếp các tuyên bố như:

- “đạt Core Web Vitals”;
- “tốc độ cực nhanh”;
- “tự động nhận diện hoàn toàn”;
- “production ready”;

nếu chưa kiểm tra bằng source, Lighthouse, production deployment và dữ liệu thực tế.

---

# 13. Quy trình kiểm tra dữ liệu từng được đề xuất

Trước khi AI sửa/refactor một phần lớn của website, quy trình cũ đề xuất:

```text
1. Xác nhận dữ liệu gốc
2. Kiểm tra cấu trúc thư mục
3. Kiểm tra key/dictionary
4. Chỉnh từng module
5. Chạy build
6. Kiểm tra UI
7. Kiểm tra SEO/routing
```

Mục tiêu là tránh:

- AI tự chế nội dung.
- Mất dữ liệu kỹ thuật.
- Thiếu key dịch.
- Di chuyển file làm vỡ route.
- Dịch sai thuật ngữ chuyên ngành.

---

# 14. Giá trị còn dùng được từ file archive này

Mặc dù phần lớn hướng dẫn thao tác đã lỗi thời, file này vẫn có giá trị ở ba điểm:

### 1. Lịch sử kiến trúc

Cho biết website đã đi từ:

```text
UI tĩnh
→ i18n dictionary
→ multi-page
→ dynamic content
→ Sanity CMS
```

### 2. Bài học localization

- Luôn giữ dictionary cùng cấu trúc.
- Không dịch thiếu key.
- Kiểm tra thuật ngữ kỹ thuật.
- Không dịch hàng loạt mà không review.

### 3. Bài học khi dùng AI sửa source

- Đưa đúng file nguồn.
- Không dựa vào giả định.
- Kiểm tra implementation thật.
- Không coi câu trả lời AI trước đây là tài liệu kỹ thuật chính thức.

---

# 15. Tài liệu nên ưu tiên hiện nay

Khi cần làm việc với repo, thứ tự ưu tiên nên là:

```text
1. Source code hiện tại
2. package.json
3. app/
4. components/
5. lib/
6. sanity/
7. dictionaries/
8. ZINITEK_PROJECT_MEMORIES.md
9. DEVELOPMENT_NOTES_ARCHIVE.md   ← chỉ dùng để tra lịch sử
```

---

## Kết luận

File này chỉ nên được xem là **nhật ký phát triển đã được sắp xếp lại**, giúp tra cứu các quyết định và ý tưởng cũ.

Không dùng nó làm nguồn sự thật cho kiến trúc hiện tại của ZINITEK nếu chưa đối chiếu với source code.