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
  ],
  preview: {
    prepare() {
      return { title: 'Cấu hình liên hệ toàn website' }
    },
  },
}
