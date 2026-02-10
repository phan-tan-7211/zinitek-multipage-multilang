// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

export default {
  // Tên định danh của tài liệu trong hệ thống
  name: 'blogCategory',
  // Tên hiển thị trên giao diện quản trị Sanity Studio
  title: 'Danh mục Blog',
  // Kiểu tài liệu là document (tài liệu độc lập)
  type: 'document',
  fields: [
    // --- 1. TRƯỜNG QUẢN LÝ NGÔN NGỮ (BẮT BUỘC ĐỂ PHÒNG LỖI UNTITLED) ---
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    },

    // --- 2. THÔNG TIN CHÍNH CỦA DANH MỤC ---
    {
      name: 'title',
      title: 'Tiêu đề danh mục',
      type: 'string',
      description: 'Ví dụ: Tin tức công ty, Kiến thức chuyên ngành, Sự kiện...',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Đường dẫn định danh (Slug)',
      type: 'slug',
      options: {
        // Tự động tạo đường dẫn dựa trên tiêu đề
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Mô tả danh mục',
      type: 'text',
      rows: 3,
      description: 'Mô tả ngắn gọn về chủ đề của danh mục này.',
    },
  ],
}