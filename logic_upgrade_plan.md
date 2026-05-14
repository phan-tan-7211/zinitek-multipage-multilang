# Kế hoạch Nâng cấp Logic & Tối ưu hóa Hệ thống Zinitek

Tài liệu này tổng hợp kết quả kiểm tra logic (Audit) và đề xuất các hạng mục nâng cấp cho website Zinitek nhằm đảm bảo tính nhất quán, hiệu suất và khả năng mở rộng.

## 1. Kết quả Kiểm tra Logic Hiện tại (Audit Results)

### 🔴 Lỗ hổng Nghiêm trọng (Critical Issues)
*   **Hardcoded Routes & Slugs**: File `SmartSwipeWrapper.tsx` và `MobileWidgetIndicator.tsx` đang chứa danh sách các route và slug dịch vụ cứng (hardcoded). Khi thêm dịch vụ mới trên Sanity, các tính năng vuốt (swipe) và menu icon di động sẽ không hoạt động với các trang mới này.
*   **Bất đồng bộ Dữ liệu (Data Fetching Inconsistency)**:
    *   `Navigation.tsx` thực hiện fetch danh sách dịch vụ phía Client.
    *   `LanguageLayout.tsx` thực hiện fetch phía Server.
    *   Điều này có thể dẫn đến lỗi Hydration hoặc hiển thị dữ liệu cũ/mới khác nhau giữa các thành phần.
*   **Dịch thuật Slug (Slug Translation Hack)**: Việc sử dụng biến toàn cục `(window as any).zinitekTranslations` để chuyển đổi slug khi đổi ngôn ngữ là một giải pháp tạm thời, dễ lỗi và khó bảo trì.

### 🟡 Vấn đề Cần Cải thiện (Improvement Areas)
*   **SEO Quốc tế**: Metadata Alternates trong `app/[lang]/layout.tsx` đang chỉ hỗ trợ 3 ngôn ngữ (vi, en, jp) trong khi dự án hỗ trợ 5 ngôn ngữ (thêm kr, cn).
*   **Nội dung Trang chủ**: Các bài viết Blog trên trang chủ đang được viết cứng (hardcoded) trong JSX, chưa được đồng bộ từ Sanity.
*   **Type Safety**: Sử dụng `any` quá nhiều trong các component xử lý dữ liệu từ Sanity và Dictionary, làm mất đi lợi thế của TypeScript.
*   **Logic Vuốt (Swipe logic)**: Ngưỡng vuốt (threshold) đang cố định, chưa thực sự linh hoạt theo kích thước màn hình hoặc tốc độ vuốt của người dùng.

---

## 2. Kế hoạch Nâng cấp Chi tiết

### Phase 1: Đồng nhất hóa Dữ liệu & Routing (Data & Routing Consolidation)
*   [x] **Dynamic Route Registry**: Thay thế các mảng hardcoded trong `SmartSwipeWrapper` bằng dữ liệu fetch động từ Sanity hoặc generate từ `StaticParams`.
*   [ ] **Server-Side Navigation Data**: Chuyển toàn bộ việc fetch danh sách menu/dịch vụ về Server Component (Layout) và truyền xuống các Client Component qua Props để đảm bảo tính nhất quán (Single Source of Truth).
*   [ ] **Robust Slug Translation**: Triển khai logic ánh xạ slug đa ngôn ngữ dựa trên `_translationKey` từ Sanity ngay trong component Navigation, không phụ thuộc vào biến `window`.

### Phase 2: Tối ưu hóa SEO & Nội dung (SEO & Content Optimization)
*   [x] **Full i18n Metadata**: Cập nhật hàm `generateMetadata` để tự động tạo đầy đủ thẻ `alternates` cho tất cả 5 ngôn ngữ (vi, en, jp, kr, cn).
*   [x] **Dynamic Blog Section**: Kết nối Section Tin tức/Blog trên trang chủ với dữ liệu thực tế từ Sanity.
*   [ ] **Sanity Schema Sync**: Kiểm tra và đồng bộ lại các trường dữ liệu trong Sanity để đảm bảo tất cả các ngôn ngữ đều có đầy đủ thông tin (tránh fallback về Tiếng Anh/Tiếng Việt quá nhiều).

### Phase 3: Cải thiện Trải nghiệm Người dùng (UX Enhancement)
*   [x] **High-end Homepage Carousels**: Tích hợp Embla Carousel với Autoplay và Mouse-drag cho khối Dự án và Blog trên trang chủ.
*   [x] **Dynamic Featured Projects**: Đồng bộ khối Dự án tiêu biểu với dữ liệu thực tế từ Sanity CMS.
*   [ ] **Adaptive Swipe Thresholds**: Điều chỉnh `SmartSwipeWrapper` để tính toán ngưỡng vuốt dựa trên `velocity` (tốc độ) thay vì chỉ `distance` (khoảng cách).
*   [ ] **Mobile Menu Performance**: Tối ưu hóa logic `scrollIntoView` và khóa cuộn (scroll lock) trên di động để tránh giật lag (jank).
*   [ ] **Skeleton Loading**: Thêm trạng thái chờ (loading) mượt mà cho các thành phần fetch dữ liệu động.

### Phase 4: Kỹ thuật & Bảo trì (Engineering & Maintenance)
*   [ ] **TypeScript Interfaces**: Định nghĩa các Interface rõ ràng cho dữ liệu Sanity (Service, Post, Dictionary) để loại bỏ `any`.
*   [ ] **Cleanup Legacy Files**: Rà soát và xóa bỏ các file dữ liệu cứng cũ như `lib/services-data.ts` nếu không còn sử dụng.

---

## 3. Lộ trình Thực hiện (Roadmap)

| Hạng mục | Ưu tiên | Trạng thái |
| :--- | :---: | :--- |
| Fix Hardcoded Routes trong Swipe | 🔥 Cao | ✅ Hoàn thành |
| Đồng bộ Fetching Navigation (Server) | 🔥 Cao | Đang chờ |
| Cập nhật SEO Metadata (5 ngôn ngữ) | ⚡ Trung bình | ✅ Hoàn thành |
| Kết nối Dynamic Blog trên Home | ⚡ Trung bình | ✅ Hoàn thành |
| Đồng bộ Dự án tiêu biểu (Home) | ⚡ Trung bình | ✅ Hoàn thành |
| Homepage Carousels (Autoplay) | ⚡ Trung bình | ✅ Hoàn thành |
| **Bộ lọc Sản phẩm Pro Max (Filter + Search)** | ⚡ Trung bình | ✅ Hoàn thành |
| Refactor Type Safety (Interfaces) | 🧊 Thấp | Đang chờ |
