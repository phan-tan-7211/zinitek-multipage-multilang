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
    { name: 'zaloNumber', title: 'Số Zalo', type: 'string', description: 'Ví dụ: 077291501. Dùng để tạo link zalo.me.' },
    { name: 'email', title: 'Email liên hệ', type: 'string' },
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
    {
      name: 'googleRating',
      title: 'Điểm đánh giá Google',
      type: 'number',
      description: 'Ví dụ: 5 hoặc 4.9. Chỉ dùng để hiển thị, không gọi Google API.',
      validation: (Rule: any) => Rule.min(0).max(5),
    },
    {
      name: 'googleReviewCount',
      title: 'Tổng số đánh giá Google',
      type: 'number',
      description: 'Ví dụ: 20. Cập nhật thủ công khi số lượng trên Google thay đổi.',
      validation: (Rule: any) => Rule.min(0).integer(),
    },
    {
      name: 'googleReviews',
      title: 'Đánh giá Google hiển thị trên website',
      type: 'array',
      description: 'Nhập các đánh giá thật từ Google. Giữ nguyên ngôn ngữ gốc; không cần tạo bản dịch.',
      of: [
        {
          type: 'object',
          name: 'googleReview',
          title: 'Đánh giá Google',
          fields: [
            {
              name: 'author',
              title: 'Tên người đánh giá',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'rating',
              title: 'Số sao',
              type: 'number',
              initialValue: 5,
              validation: (Rule: any) => Rule.required().min(1).max(5).integer(),
            },
            {
              name: 'content',
              title: 'Nội dung đánh giá',
              type: 'text',
              rows: 4,
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'meta',
              title: 'Ghi chú',
              type: 'string',
              description: 'Ví dụ: Local Guide, Khách doanh nghiệp, Google review.',
            },
            {
              name: 'reviewUrl',
              title: 'Link đánh giá trên Google',
              type: 'url',
              description: 'Không bắt buộc. Nếu có, icon mở ngoài sẽ dẫn tới review này.',
              validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
            },
          ],
          preview: {
            select: { title: 'author', subtitle: 'content' },
          },
        },
      ],
    },
    { name: 'wechatId', title: 'WeChat ID', type: 'string' },
    { name: 'wechatUrl', title: 'WeChat URL', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
    { name: 'lineUrl', title: 'LINE URL', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
    { name: 'facebookUrl', title: 'Facebook URL', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
    { name: 'youtubeUrl', title: 'YouTube URL', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
    { name: 'tiktokUrl', title: 'TikTok URL', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
    { name: 'twitterUrl', title: 'X / Twitter URL', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
  ],
  preview: {
    prepare() {
      return { title: 'Cấu hình liên hệ toàn website' }
    },
  },
}
