export default {
  name: 'pageContent',
  title: 'Nội dung giao diện động',
  type: 'document',
  description: 'Các khối nội dung giao diện theo ngôn ngữ. Dữ liệu cũ được hệ thống tự đồng bộ vào đây; không cần copy thủ công.',
  fields: [
    { name: 'language', title: 'Ngôn ngữ', type: 'string', readOnly: true },
    { name: 'key', title: 'Khối nội dung', type: 'string', readOnly: true, description: 'Ví dụ: hero, footer, common, about_page...' },
    {
      name: 'content',
      title: 'Dữ liệu nội dung JSON',
      type: 'text',
      rows: 24,
      description: 'Có thể chỉnh trực tiếp để cập nhật toàn bộ khối nội dung. Hệ thống chỉ tự điền khi document/field còn trống và không ghi đè dữ liệu đã chỉnh.',
      validation: (Rule: any) => Rule.required().custom((value: string) => {
        if (!value) return true
        try {
          JSON.parse(value)
          return true
        } catch {
          return 'JSON không hợp lệ'
        }
      }),
    },
  ],
  preview: {
    select: { key: 'key', language: 'language' },
    prepare({ key, language }: any) {
      return {
        title: key || 'Nội dung giao diện',
        subtitle: language ? `Ngôn ngữ: ${String(language).toUpperCase()}` : 'Chưa xác định ngôn ngữ',
      }
    },
  },
}
