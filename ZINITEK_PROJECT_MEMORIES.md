# ZINITEK PROJECT MEMORIES

Tài liệu này tổng hợp toàn bộ bối cảnh, trạng thái hiện tại, chi tiết kỹ thuật và lộ trình tương lai của dự án **Zinitek High-tech Precision Web**. Được trích xuất từ lịch sử phát triển và các bản ghi chú.

---

## 1. Current State (Trạng thái hiện tại)
Dự án đã vượt qua giai đoạn "xây dựng cơ bản" và đạt đến cấp độ **Production Ready** (Sẵn sàng vận hành) về mặt tính năng hiển thị và quản trị.

### Tech Stack
*   **Framework:** Next.js 16 (App Router, Turbopack). Tuân thủ nghiêm ngặt Next.js 16 params (`await params`).
*   **Language:** TypeScript / React 19.
*   **Styling:** Tailwind CSS v4 (Cấu hình CSS-first với `@theme` trong `globals.css`).
*   **CMS:** Sanity.io (Headless CMS).
*   **i18n (Đa ngôn ngữ):** Hỗ trợ 5 ngôn ngữ (Việt, Anh, Nhật, Hàn, Trung).

### Các Module Đã Hoàn Thành
*   **Services (Dịch vụ):** 100% dữ liệu fetch động từ Sanity. Hỗ trợ hệ thống Icon động và cơ chế ngôn ngữ dự phòng thông minh.
*   **Products (Sản phẩm):** Hoàn thiện 100%. Grid hiển thị dạng thẻ mật độ cao (Dense Grid), bộ lọc kép (Hybrid Filter), hiệu ứng tải Skeleton Loading và trang chi tiết lấy dữ liệu PDF động.
*   **Featured Projects & Blog (Dự án & Tin tức):** 100% dữ liệu fetch động. Đã tích hợp **High-end Carousel** hỗ trợ tự động chạy (Autoplay) và kéo chuột (Mouse-drag) chuẩn Pro Max.
*   **Navigation (Điều hướng):** Mega Menu cho Desktop và Menu vuốt trên Mobile đã được đồng bộ để lấy dữ liệu động từ CMS, không còn dùng JSON cứng.
*   **Admin Tools:** Đã xây dựng hoàn thiện công cụ **Import/Export Excel** ngay trong Sanity Studio giúp nhập liệu hàng loạt an toàn.

---

## 2. Technical Details (Chi tiết Kỹ thuật)

### Logic Đa ngôn ngữ (i18n) & Smart Fallback
Hệ thống sử dụng cơ chế **Smart Fallback** (Dự phòng thông minh) đa tầng:
1.  Nếu khách đang xem bản Tiếng Nhật (`jp`) mà chưa có nội dung dịch, hệ thống tự động tìm và trả về nội dung Tiếng Anh (`en`).
2.  Nếu Tiếng Anh cũng không có, hệ thống sẽ trả về Tiếng Việt (`vi`).
> Nhờ đó, website không bao giờ gặp lỗi 404 hoặc trang trắng. Các bản dịch được liên kết chặt chẽ (Strong Reference) thông qua mã `_translationKey` trong bảng `translation.metadata` của Sanity.

### Cách hoạt động của Dynamic Icon
*   **Trong CMS:** Thay vì gõ text thủ công, Sanity được tích hợp plugin `sanity-plugin-icon-manager`. Admin có thể tìm kiếm và chọn icon trực quan với giao diện UI. Plugin này bị giới hạn chỉ sử dụng bộ icon **Lucide**.
*   **Dưới Frontend:** Component `<DynamicIcon />` làm nhiệm vụ thông dịch. Nếu dữ liệu trả về là object icon từ Sanity (ví dụ `lucide:cpu`), component sẽ sử dụng `@iconify/react` kết hợp `lucide-react` để render ra mã SVG tương ứng mà không làm phình dung lượng bundle.

---

## 3. Change Log (Lịch sử Nâng cấp)

*   **Chuyển đổi Kiến trúc:** Nâng cấp từ cấu trúc tĩnh sang cấu trúc 100% Dynamic Content bằng Sanity CMS. Toàn bộ Dịch vụ, Sản phẩm và Menu đều được trả về từ API.
*   **Tối ưu i18n Routing:** Chuyển đổi ngôn ngữ mượt mà ngay tại trang chi tiết (ví dụ: chuyển từ `/vi/services/cnc` sang `/en/services/cnc` tự động dịch đúng slug) mà không làm vỡ trang.
*   **Hoàn thiện Công cụ Quản trị:** Công cụ `ImportExportTool` đã nâng cấp lên bản Master Final. Hỗ trợ:
    *   Tự động gom nhóm Metadata I18n và tạo Strong Reference (Hết lỗi cảnh báo vàng).
    *   Làm sạch chuỗi Icon khi import từ Excel (Auto Icon Cleaning).
    *   Xử lý an toàn các trường JSON phức tạp như `specs` và `process`.
*   **Giao diện:** Đã áp dụng hoàn toàn chuẩn màu và hiệu ứng của phong cách Industrial High-tech (Nền `#020617`, Cam `#f97316`).

---

## 4. Future Roadmap (Lộ trình tiếp theo)

Hệ thống giao diện hiển thị đã cơ bản hoàn thiện. Bước tiếp theo tập trung vào **Tương tác và Vận hành**:

1.  **Chức năng Lọc Sản phẩm (Product Filter):** Cần tích hợp bộ lọc vào trang `/products` để người dùng có thể lọc máy móc theo danh mục "Dịch vụ" (dựa trên `serviceCategory` trong Schema).
2.  **Xử lý Form Liên hệ (Contact Form):** Kết nối form tại trang `/contact` để gửi email thực tế (có thể dùng EmailJS hoặc Nodemailer qua Next.js API Routes).
3.  **Sitemap & Robots.txt:** Xây dựng `app/sitemap.ts` tự động đọc tất cả các `slug` dịch vụ và sản phẩm để Google Index chuẩn SEO.
4.  **Triển khai (Deployment):** Đưa dự án lên Vercel, cài đặt lại biến môi trường `NEXT_PUBLIC_SANITY_...` và thêm URL Vercel vào danh sách CORS Origins của Sanity.

---

## 5. Guide for Admin (Hướng dẫn Quản trị viên)

### Thêm Dịch vụ/Sản phẩm mới bằng Excel
1.  Vào Sanity Studio -> Tool **Nhập/Xuất Dữ Liệu**.
2.  Bấm **Xuất Excel Mẫu** để lấy file form.
3.  **QUAN TRỌNG:**
    *   Để tạo mới một Dịch vụ/Sản phẩm: **TUYỆT ĐỐI ĐỂ TRỐNG cột `_id`**.
    *   Để tạo các bản dịch cho cùng 1 dịch vụ: Hãy nhập chung 1 mã bất kỳ (ví dụ: `MAY-CNC-01`) vào cột `_translationKey`. Hệ thống sẽ tự liên kết chúng lại với nhau.
4.  Upload file lên để Import.

### Hướng dẫn sử dụng Icon
*   **Trên Giao diện CMS:** Chọn trực tiếp từ trường Icon (Select Icon) trong bài viết.
*   **Khi nhập bằng Excel:** 
    1. Vào trang [Lucide Icons](https://lucide.dev/icons).
    2. Tìm và copy tên của icon (Ví dụ: `box`, `cpu`, `monitor`).
    3. Dán đúng tên đó vào cột `icon` trong Excel. Hệ thống sẽ tự động chuyển hóa thành icon chuẩn của Sanity mà không bị lỗi.

### Hướng dẫn nhập Nội dung Đa ngôn ngữ
*   Luôn tạo bài viết bằng **Tiếng Việt (`vi`)** đầu tiên.
*   Sau khi Publish, dùng nút "Translate" ở cột bên phải màn hình Studio để tạo ra các bản sao cho Tiếng Anh, Nhật, Hàn, Trung để hệ thống tự động sinh đúng mã `_translationKey`.
