export default {
  name: 'pageContent',
  title: 'Nội dung tĩnh (Từ điển)',
  type: 'document',
  fields: [
    { name: 'language', type: 'string', readOnly: true, hidden: true },
    { name: 'key', title: 'Mã định danh (Key)', type: 'string', description: 'Ví dụ: hero, footer, common...' },
    {
      name: 'content',
      title: 'Dữ liệu JSON',
      type: 'text',
      description: 'Dán phần nội dung tương ứng từ file JSON vào đây'
    }
  ]
}