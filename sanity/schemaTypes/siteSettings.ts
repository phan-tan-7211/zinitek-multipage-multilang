export default {
  name: 'siteSettings',
  title: 'Cấu hình website',
  type: 'document',
  fields: [
    {
      name: 'phoneDisplay',
      title: 'Số điện thoại hiển thị',
      type: 'string',
      description: 'Ví dụ: +84 77 291 501. Số này sẽ hiển thị trên toàn website.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'phoneTel',
      title: 'Số điện thoại dùng để gọi',
      type: 'string',
      description: 'Chỉ nhập số và dấu +, ví dụ: +8477291501.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'zaloNumber',
      title: 'Số Zalo',
      type: 'string',
      description: 'Ví dụ: 077291501. Dùng để tạo link zalo.me.',
    },
    {
      name: 'email',
      title: 'Email liên hệ',
      type: 'string',
    },
    {
      name: 'addressDisplay',
      title: 'Địa chỉ hiển thị',
      type: 'string',
      description: 'Địa chỉ công ty hiển thị ở Footer, Contact và dữ liệu SEO.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'googleMapsUrl',
      title: 'Liên kết Google Maps',
      type: 'url',
      description: 'Dán link Share từ Google Maps. Người dùng bấm địa chỉ hoặc nút MAP sẽ mở link này.',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
  ],
  preview: {
    prepare() {
      return { title: 'Cấu hình liên hệ toàn website' }
    },
  },
}
