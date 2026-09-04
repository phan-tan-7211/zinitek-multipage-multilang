const localizedStringFields = [
  { name: 'vi', title: 'Tiếng Việt', type: 'string' },
  { name: 'en', title: 'English', type: 'string' },
  { name: 'jp', title: '日本語', type: 'string' },
  { name: 'kr', title: '한국어', type: 'string' },
  { name: 'cn', title: '中文', type: 'string' },
]

export default {
  name: 'locationsSettings',
  title: 'Địa điểm công ty',
  type: 'document',
  description: 'Quản lý linh hoạt nhà máy, văn phòng hoặc địa điểm dùng chung. Item không bật hoặc không có địa chỉ sẽ tự ẩn trên website.',
  fields: [
    {
      name: 'locations',
      title: 'Danh sách địa điểm',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'companyLocation',
          title: 'Địa điểm',
          fields: [
            { name: 'enabled', title: 'Hiển thị', type: 'boolean', initialValue: true },
            {
              name: 'kind',
              title: 'Loại địa điểm',
              type: 'string',
              initialValue: 'factory',
              options: {
                list: [
                  { title: 'Nhà máy', value: 'factory' },
                  { title: 'Văn phòng', value: 'office' },
                  { title: 'Nhà máy + Văn phòng', value: 'factory_office' },
                  { title: 'Khác', value: 'other' },
                ],
                layout: 'radio',
              },
            },
            {
              name: 'name',
              title: 'Tên hiển thị · 5 ngôn ngữ',
              type: 'object',
              description: 'Có thể đặt tên riêng như “Nhà máy chính”, “Văn phòng TP.HCM”. Nếu bỏ trống, website dùng tên theo loại địa điểm.',
              fields: localizedStringFields,
            },
            {
              name: 'address',
              title: 'Địa chỉ',
              type: 'string',
              description: 'Nhập địa chỉ thực tế. Không có địa chỉ thì item này không hiển thị.',
            },
            {
              name: 'googleMapsUrl',
              title: 'Liên kết Google Maps',
              type: 'url',
              description: 'Không bắt buộc. Nếu bỏ trống, website tự tạo link tìm kiếm Google Maps từ địa chỉ.',
              validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'] }),
            },
          ],
          preview: {
            select: { vi: 'name.vi', address: 'address', kind: 'kind', enabled: 'enabled' },
            prepare({ vi, address, kind, enabled }: any) {
              const kindLabel = kind === 'office' ? 'Văn phòng' : kind === 'factory_office' ? 'Nhà máy + Văn phòng' : kind === 'other' ? 'Địa điểm' : 'Nhà máy'
              return {
                title: vi || kindLabel,
                subtitle: `${enabled === false ? 'Ẩn · ' : ''}${address || 'Chưa nhập địa chỉ'}`,
              }
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Địa điểm công ty' }
    },
  },
}
