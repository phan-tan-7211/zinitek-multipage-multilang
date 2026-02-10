// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

export default {
  // Tên định danh đã được thống nhất để tránh xung đột hệ thống
  name: 'blogPost',
  title: 'Bài viết Blog',
  type: 'document',
  fields: [
    // --- 1. TRƯỜNG QUẢN LÝ NGÔN NGỮ (BẮT BUỘC) ---
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    },

    // --- 2. THÔNG TIN CHÍNH CỦA BÀI VIẾT ---
    {
      name: 'title',
      title: 'Tiêu đề bài viết',
      type: 'string',
      description: 'Tiêu đề hấp dẫn cho bài viết kỹ thuật hoặc tin tức.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Đường dẫn định danh (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Mô tả ngắn (Excerpt)',
      type: 'text',
      rows: 3,
      description: 'Đoạn văn ngắn hiển thị ở trang danh sách bài viết.',
      validation: (Rule: any) => Rule.required(),
    },

    // --- 3. HÌNH ẢNH VÀ PHÂN LOẠI (CẬP NHẬT QUAN TRỌNG) ---
    {
      name: 'mainImage',
      title: 'Hình ảnh đại diện',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Danh mục bài viết',
      type: 'reference',
      // SỬA ĐỔI: Trỏ đến blogCategory thay vì service
      to: [{ type: 'blogCategory' }], 
      description: 'Phân loại bài viết (Ví dụ: Tin tức công ty, Kiến thức chuyên ngành).',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'relatedService',
      title: 'Dịch vụ kỹ thuật liên quan',
      type: 'reference',
      // BỔ SUNG: Liên kết bài viết với năng lực sản xuất thực tế
      to: [{ type: 'service' }], 
      description: 'Nếu bài viết nói về kỹ thuật, hãy chọn dịch vụ tương ứng (Ví dụ: Gia công CNC).',
    },

    // --- 4. THÔNG TIN CHI TIẾT VÀ TÁC GIẢ ---
    {
      name: 'publishedAt',
      title: 'Ngày đăng bài',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Tác giả',
      type: 'string',
      initialValue: 'Đội ngũ kỹ sư ZINITEK',
    },
    {
      name: 'readTime',
      title: 'Thời gian đọc (phút)',
      type: 'string',
      description: 'Ví dụ: 5 phút, 10 phút...',
    },
    {
      name: 'body',
      title: 'Nội dung chi tiết',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Nội dung đầy đủ của bài viết blog.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const { author } = selection
      return { ...selection, subtitle: author ? `Tác giả: ${author}` : '' }
    },
  },
}