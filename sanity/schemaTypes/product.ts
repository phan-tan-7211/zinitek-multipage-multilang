

export default {
  name: 'product',
  title: 'Sản phẩm (Máy móc)',
  type: 'document',
  fields: [
    // --- Trường quản lý ngôn ngữ (Bắt buộc cho i18n) ---
    {
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    },
    
    // --- Trường phân loại sản phẩm theo dịch vụ (Liên kết quan trọng) ---
    {
      name: 'serviceCategory',
      title: 'Phân loại theo Dịch vụ',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'Chọn dịch vụ liên quan đến sản phẩm này (Ví dụ: Máy Phay CNC thuộc dịch vụ Gia công CNC).',
      validation: (Rule: any) => Rule.required(), // Bắt buộc phải chọn
    },

    // --- Thông tin cơ bản ---
    {
      name: 'title', // Đã đổi từ 'name' thành 'title' để đồng bộ với các schema khác (service, project)
      title: 'Tên sản phẩm / Tên máy',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'modelCode',
      title: 'Mã máy / Model',
      type: 'string',
      description: 'Ví dụ: ZT-500, Fanuc Robodrill T21iFL',
    },
    {
      name: 'slug',
      title: 'Đường dẫn (Slug)',
      type: 'slug',
      options: {
        source: 'title', // Lấy slug từ trường 'title'
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
        name: 'description',
        title: 'Mô tả ngắn',
        type: 'text', // Dạng văn bản thuần, KHÔNG phải Portable Text
        rows: 3,
        description: 'Mô tả ngắn gọn xuất hiện ở danh sách sản phẩm. Đây là trường TEXT thuần để tránh lỗi React.',
    },
    
    // --- Hình ảnh & Tài liệu ---
    {
      name: 'image',
      title: 'Ảnh đại diện chính',
      type: 'image',
      options: {
        hotspot: true, // Cho phép crop ảnh thông minh
      },
    },
    {
      name: 'gallery',
      title: 'Thư viện ảnh sản phẩm',
      type: 'array',
      of: [{ type: 'image' }],
    },
    {
        name: 'attachments',
        title: 'Tài liệu đính kèm (PDF, Manual)',
        type: 'array',
        of: [{ type: 'file', options: { accept: '.pdf,.doc,.docx,.xls,.xlsx' } }],
    },

    // --- Thông số & Tính năng (Dùng để hiển thị chi tiết) ---
    {
      name: 'tags',
      title: 'Tags (Nhãn)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'features',
      title: 'Tính năng nổi bật',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'specifications',
      title: 'Bảng thông số kỹ thuật',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Thông số (Vd: Hành trình X)', type: 'string' },
            { name: 'value', title: 'Giá trị (Vd: 500 mm)', type: 'string' },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'modelCode',
      media: 'image',
    },
  },
}