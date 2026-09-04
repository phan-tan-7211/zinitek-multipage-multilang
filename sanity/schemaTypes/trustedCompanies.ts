const localizedHeadingFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'string' },
  { name: 'en', title: 'English', type: 'string' },
  { name: 'jp', title: '日本語', type: 'string' },
  { name: 'kr', title: '한국어', type: 'string' },
  { name: 'cn', title: '中文', type: 'string' },
]

export default {
  name: 'trustedCompanies',
  title: 'Doanh nghiệp tin tưởng ZINITEK',
  type: 'document',
  description: 'Quản lý dòng “Được tin tưởng bởi các doanh nghiệp hàng đầu” trên trang chủ.',
  initialValue: {
    enabled: true,
    heading: {
      vi: 'Được tin tưởng bởi các doanh nghiệp hàng đầu',
      en: 'Trusted by leading companies',
      jp: '主要企業からの信頼',
      kr: '주요 기업이 신뢰하는 파트너',
      cn: '深受领先企业信赖',
    },
    companies: [
      { _key: 'toyota', name: 'Toyota', enabled: true },
      { _key: 'samsung', name: 'Samsung', enabled: true },
      { _key: 'panasonic', name: 'Panasonic', enabled: true },
      { _key: 'lg', name: 'LG', enabled: true },
      { _key: 'vinfast', name: 'VinFast', enabled: true },
      { _key: 'thaco', name: 'Thaco', enabled: true },
    ],
  },
  fields: [
    {
      name: 'enabled',
      title: 'Hiển thị trên trang chủ',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'heading',
      title: 'Tiêu đề theo ngôn ngữ',
      type: 'object',
      fields: localizedHeadingFields,
    },
    {
      name: 'companies',
      title: 'Danh sách doanh nghiệp',
      type: 'array',
      description: 'Kéo thả để đổi thứ tự hiển thị. Có thể thêm hoặc tắt từng doanh nghiệp mà không sửa code.',
      of: [
        {
          type: 'object',
          name: 'trustedCompany',
          title: 'Doanh nghiệp',
          fields: [
            {
              name: 'name',
              title: 'Tên hiển thị',
              type: 'string',
              validation: (Rule: any) => Rule.required().max(60),
            },
            {
              name: 'url',
              title: 'Liên kết (không bắt buộc)',
              type: 'url',
              validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
            },
            {
              name: 'enabled',
              title: 'Hiển thị',
              type: 'boolean',
              initialValue: true,
            },
          ],
          preview: {
            select: { title: 'name', enabled: 'enabled' },
            prepare({ title, enabled }: any) {
              return {
                title: title || 'Chưa đặt tên',
                subtitle: enabled === false ? 'Đang ẩn' : 'Đang hiển thị',
              }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.max(24),
    },
  ],
  preview: {
    prepare() {
      return { title: 'Doanh nghiệp tin tưởng ZINITEK' }
    },
  },
}
