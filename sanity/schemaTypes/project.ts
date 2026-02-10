// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

export default {
  name: 'project',
  title: 'Dự án (Portfolio)',
  type: 'document',
  fields: [
    // --- Trường quản lý ngôn ngữ (Bắt buộc cho i18n) ---
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    },

    // --- Thông tin chính của Dự án ---
    {
      name: 'title',
      title: 'Tiêu đề dự án',
      type: 'string',
      description: 'Ví dụ: Gia công linh kiện hàng không, Khuôn dập Toyota...',
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
      name: 'client',
      title: 'Tên khách hàng / Đối tác',
      type: 'string',
      description: 'Ví dụ: Samsung Electronics, Toyota Boshoku...',
    },
    {
      name: 'projectYear',
      title: 'Năm thực hiện',
      type: 'string',
      description: 'Ví dụ: 2024, 2025...',
    },

    // --- Liên kết danh mục (Reference) ---
    {
      name: 'serviceCategory',
      title: 'Thuộc loại Dịch vụ',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'Dự án này sử dụng dịch vụ kỹ thuật nào của công ty?',
      validation: (Rule: any) => Rule.required(),
    },

    // --- Hình ảnh & Nội dung ---
    {
      name: 'mainImage',
      title: 'Hình ảnh đại diện',
      type: 'image',
      options: {
        hotspot: true, // Cho phép cắt ảnh tập trung vào điểm quan trọng
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Mô tả ngắn gọn',
      type: 'text',
      rows: 3,
      description: 'Tóm tắt nội dung dự án sẽ hiển thị ở trang danh sách.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Nội dung chi tiết',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Nội dung đầy đủ hiển thị ở trang chi tiết dự án.',
    },
    
    // --- Thư viện ảnh dự án (Dành cho bản High-end) ---
    {
      name: 'gallery',
      title: 'Thư viện ảnh thực tế',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Các hình ảnh chi tiết trong quá trình sản xuất hoặc sản phẩm hoàn thiện.',
    }
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const { title, client, media } = selection
      return {
        title: title,
        subtitle: client ? `Khách hàng: ${client}` : 'Dự án nội bộ',
        media: media,
      }
    },
  },
}