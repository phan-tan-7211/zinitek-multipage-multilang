

export default {
  name: 'seoPageConfig', // Đổi tên để tránh xung đột với pageContent gốc của bạn
  title: 'Cấu hình Trang & SEO',
  type: 'document',
  fields: [
    // --- Trường quản lý ngôn ngữ (Bắt buộc cho i18n) ---
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    
    // --- Trường Page Identifier (Định danh trang) ---
    {
        name: 'pageIdentifier',
        title: 'Định danh Trang',
        type: 'string',
        options: {
            list: [
                { title: 'Trang Chủ (Home)', value: 'home' },
                { title: 'Giới Thiệu (About)', value: 'about' },
                { title: 'Liên Hệ (Contact)', value: 'contact' },
                { title: 'Dịch Vụ (Services Hub)', value: 'servicesHub' },
                { title: 'Sản Phẩm (Products Hub)', value: 'productsHub' },
            ],
        },
        validation: (Rule: any) => Rule.required(),
        description: 'Dùng để xác định nội dung SEO cho trang tĩnh nào.',
    },

    // --- Cấu hình SEO ---
    {
      name: 'metaTitle',
      title: 'Meta Title (Tiêu đề SEO)',
      type: 'string',
      description: 'Tiêu đề hiển thị trên tab trình duyệt (Tối đa 60 ký tự).',
      validation: (Rule: any) => Rule.max(60).required(),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (Mô tả SEO)',
      type: 'text',
      rows: 3,
      description: 'Mô tả ngắn gọn cho công cụ tìm kiếm (Tối đa 160 ký tự).',
      validation: (Rule: any) => Rule.max(160).required(),
    },
    {
        name: 'openGraphImage',
        title: 'Open Graph Image (Ảnh chia sẻ MXH)',
        type: 'image',
        description: 'Ảnh sẽ hiển thị khi chia sẻ đường dẫn trên Facebook, Zalo, LinkedIn...',
    },
    
    // --- Nội dung trang (Chỉ dùng cho các trang nhỏ) ---
    {
        name: 'heroHeading',
        title: 'Tiêu đề Chính của Trang (Hero)',
        type: 'string',
    },
    {
        name: 'mainContent',
        title: 'Nội dung Trang (Portable Text)',
        type: 'array',
        of: [{ type: 'block' }],
        description: 'Nội dung chi tiết của trang tĩnh (Không phải SEO).',
    },
  ],
  preview: {
    select: {
      title: 'metaTitle',
      subtitle: 'pageIdentifier',
      media: 'openGraphImage',
    },
  },
}