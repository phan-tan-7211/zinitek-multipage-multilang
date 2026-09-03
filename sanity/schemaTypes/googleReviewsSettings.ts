const localizedTextFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'string' },
  { name: 'en', title: 'English', type: 'string' },
  { name: 'jp', title: '日本語', type: 'string' },
  { name: 'kr', title: '한국어', type: 'string' },
  { name: 'cn', title: '中文', type: 'string' },
]

export default {
  name: 'googleReviewsSettings',
  title: 'Đánh giá Google hiển thị trên website',
  type: 'document',
  description: 'Quản lý riêng phần đánh giá Google. Nội dung đánh giá giữ nguyên ngôn ngữ gốc; chỉ các nhãn giao diện được cấu hình 5 ngôn ngữ.',
  initialValue: {
    enabled: true,
    badge: {
      vi: 'Khách hàng',
      en: 'Testimonials',
      jp: 'お客様の声',
      kr: '고객 후기',
      cn: '客户见证',
    },
    titlePart1: {
      vi: 'Đối tác',
      en: 'Trusted',
      jp: '信頼される',
      kr: '신뢰할 수 있는',
      cn: '可靠的',
    },
    titleHighlight: {
      vi: 'tin cậy',
      en: 'Partners',
      jp: 'パートナー',
      kr: '파트너',
      cn: '合作伙伴',
    },
    description: {
      vi: 'Những đánh giá từ các đối tác đã đồng hành cùng ZINITEK trong nhiều năm qua.',
      en: 'Feedback from partners who have accompanied ZINITEK over the years.',
      jp: '長年にわたりZINITEKと共に歩んできたパートナー様からの評価をご紹介します。',
      kr: '수년 동안 ZINITEK과 함께해온 파트너사들의 소중한 평가입니다.',
      cn: '多年来与 ZINITEK 携手同行的合作伙伴给出的评价。',
    },
    reviewsLabel: {
      vi: 'đánh giá trên Google',
      en: 'reviews on Google',
      jp: 'Google のクチコミ',
      kr: 'Google 리뷰',
      cn: 'Google 评价',
    },
    viewGoogleLabel: {
      vi: 'Xem trên Google',
      en: 'View on Google',
      jp: 'Googleで見る',
      kr: 'Google에서 보기',
      cn: '在 Google 上查看',
    },
  },
  fields: [
    { name: 'enabled', title: 'Hiển thị khối Google Reviews', type: 'boolean', initialValue: true },
    {
      name: 'badge',
      title: 'Nhãn nhỏ · 5 ngôn ngữ',
      type: 'object',
      fields: localizedTextFields,
    },
    {
      name: 'titlePart1',
      title: 'Tiêu đề phần 1 · 5 ngôn ngữ',
      type: 'object',
      fields: localizedTextFields,
    },
    {
      name: 'titleHighlight',
      title: 'Tiêu đề nhấn mạnh · 5 ngôn ngữ',
      type: 'object',
      fields: localizedTextFields,
    },
    {
      name: 'description',
      title: 'Mô tả · 5 ngôn ngữ',
      type: 'object',
      fields: [
        { name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 2 },
        { name: 'en', title: 'English', type: 'text', rows: 2 },
        { name: 'jp', title: '日本語', type: 'text', rows: 2 },
        { name: 'kr', title: '한국어', type: 'text', rows: 2 },
        { name: 'cn', title: '中文', type: 'text', rows: 2 },
      ],
    },
    {
      name: 'reviewsLabel',
      title: 'Nhãn số lượng đánh giá · 5 ngôn ngữ',
      type: 'object',
      fields: localizedTextFields,
    },
    {
      name: 'viewGoogleLabel',
      title: 'Nút xem trên Google · 5 ngôn ngữ',
      type: 'object',
      fields: localizedTextFields,
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
      description: 'Cập nhật thủ công khi số lượng trên Google thay đổi.',
      validation: (Rule: any) => Rule.min(0).integer(),
    },
    {
      name: 'googleMapsUrl',
      title: 'Liên kết Google Maps',
      type: 'url',
      validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
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
            { name: 'author', title: 'Tên người đánh giá', type: 'string', validation: (Rule: any) => Rule.required().max(100) },
            { name: 'rating', title: 'Số sao', type: 'number', initialValue: 5, validation: (Rule: any) => Rule.min(1).max(5) },
            { name: 'content', title: 'Nội dung đánh giá', type: 'text', rows: 4, validation: (Rule: any) => Rule.required() },
            { name: 'meta', title: 'Thông tin phụ', type: 'string', description: 'Ví dụ: Local Guide · 3 reviews' },
            { name: 'reviewUrl', title: 'Link đánh giá trên Google', type: 'url', validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }) },
          ],
          preview: {
            select: { title: 'author', subtitle: 'content', rating: 'rating' },
            prepare({ title, subtitle, rating }: any) {
              return { title: `${title || 'Google user'} · ${rating || 5}★`, subtitle }
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Đánh giá Google hiển thị trên website' }
    },
  },
}
