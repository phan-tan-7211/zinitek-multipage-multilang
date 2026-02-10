// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

export default {
  name: 'service',
  title: 'Dịch vụ',
  type: 'document',
  fields: [
    // 1. Quản lý ngôn ngữ (Ẩn đối với người dùng)
    { 
      name: 'language', 
      type: 'string', 
      readOnly: true, 
      hidden: true 
    },

    // 2. Đường dẫn định danh (Slug)
    {
      name: 'slug',
      title: 'Slug (Đường dẫn)',
      type: 'slug',
      options: { source: 'title' },
      description: 'Ví dụ: gia-cong-cnc, thiet-ke-khuon, tu-dong-hoa-plc...',
      validation: (Rule: any) => Rule.required(),
    },

    // 3. Biểu tượng dịch vụ (Sử dụng Plugin Icon Manager)
    {
      name: 'icon',
      title: 'Icon (Chọn trực quan từ thư viện Lucide)',
      type: 'icon.manager',
      description: 'Truy cập https://lucide.dev/icons/ để tìm tên biểu tượng phù hợp',
    },

    // 4. Thông tin tiêu đề và mô tả
    { 
      name: 'title', 
      title: 'Tiêu đề đầy đủ', 
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    { 
      name: 'shortTitle', 
      title: 'Tiêu đề ngắn', 
      type: 'string',
      description: 'Dùng cho Breadcrumbs hoặc Menu hẹp'
    },
    { 
      name: 'description', 
      title: 'Mô tả chính', 
      type: 'text',
      validation: (Rule: any) => Rule.required(),
    },

    // 5. Hình ảnh minh họa
    { 
      name: 'image', 
      title: 'Hình ảnh (URL)', 
      type: 'string', 
      description: 'Dán liên kết ảnh từ Unsplash hoặc kho lưu trữ ảnh vào đây' 
    },

    // 6. Các nhãn phân loại (Tags)
    {
      name: 'tags',
      title: 'Tags (Nhãn phân loại)',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // 7. Danh sách tính năng nổi bật
    {
      name: 'features',
      title: 'Tính năng (Features)',
      type: 'array',
      of: [{ type: 'string' }],
    },

    // 8. Thông số kỹ thuật chi tiết
    {
      name: 'specs',
      title: 'Thông số kỹ thuật (Specs)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Tên thông số', type: 'string' },
            { name: 'value', title: 'Giá trị thông số', type: 'string' },
          ],
        },
      ],
    },

    // 9. Quy trình thực hiện dịch vụ
    {
      name: 'process',
      title: 'Quy trình thực hiện (Process)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'step', title: 'Bước số', type: 'number' },
            { name: 'title', title: 'Tiêu đề bước', type: 'string' },
            { name: 'description', title: 'Mô tả chi tiết bước', type: 'text' },
          ],
        },
      ],
    },

    // 10. PHẦN CẬP NHẬT: NHÃN TIÊU ĐỀ TÙY CHỈNH (LABELS)
    {
      name: 'labels',
      title: 'Nhãn tiêu đề (Tùy chỉnh cho từng dịch vụ)',
      type: 'object',
      description: 'Cho phép thay đổi các tiêu đề mặc định của trang để phù hợp với nội dung thực tế.',
      fields: [
        { 
          name: 'featuresTitle', 
          title: 'Tiêu đề phần Tính năng', 
          type: 'string', 
          initialValue: 'Tính năng nổi bật' 
        },
        { 
          name: 'specsTitle', 
          title: 'Tiêu đề phần Thông số', 
          type: 'string', 
          initialValue: 'Thông số kỹ thuật' 
        },
        { 
          name: 'processTitle', 
          title: 'Tiêu đề phần Quy trình', 
          type: 'string', 
          initialValue: 'Quy trình làm việc' 
        },
        { 
          name: 'relatedTitle', 
          title: 'Tiêu đề phần Dịch vụ liên quan', 
          type: 'string', 
          initialValue: 'Dịch vụ liên quan' 
        },
      ],
      options: { 
        collapsible: true, // Cho phép thu gọn nhóm trường này
        collapsed: true    // Mặc định sẽ đóng lại để giao diện Studio gọn gàng
      }
    },
  ],
}