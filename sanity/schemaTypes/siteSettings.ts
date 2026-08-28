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
      name: 'email',
      title: 'Email liên hệ',
      type: 'string',
    },
    {
      name: 'zaloNumber',
      title: 'Số Zalo',
      type: 'string',
      description: 'Ví dụ: 077291501. Dùng để tạo link zalo.me.',
    },
    {
      name: 'wechatId',
      title: 'WeChat ID',
      type: 'string',
      description: 'ID WeChat hiển thị cho khách hàng.',
    },
    {
      name: 'wechatUrl',
      title: 'Liên kết WeChat',
      type: 'url',
      description: 'Nếu có link/QR landing page WeChat, dán tại đây.',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'lineUrl',
      title: 'Liên kết LINE',
      type: 'url',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'tiktokUrl',
      title: 'TikTok URL',
      type: 'url',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
    },
    {
      name: 'twitterUrl',
      title: 'X / Twitter URL',
      type: 'url',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
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
      return { title: 'Cấu hình liên hệ & mạng xã hội toàn website' }
    },
  },
}
