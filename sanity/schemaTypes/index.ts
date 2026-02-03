import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // 1. QUẢN LÝ CẤU HÌNH & SEO
    {
      name: 'settings',
      title: 'Cấu hình hệ thống',
      type: 'document',
      fields: [
        { name: 'logo', title: 'Logo Website', type: 'image', options: { hotspot: true } },
        { name: 'favicon', title: 'Favicon', type: 'image' },
        { name: 'companyName', title: 'Tên công ty', type: 'string' },
        { name: 'slogan', title: 'Slogan', type: 'string' },
        { name: 'emailContact', title: 'Email nhận thông báo', type: 'string' },
        {
          name: 'seoGroup',
          title: 'Cấu hình SEO mặc định',
          type: 'object',
          fields: [
            { name: 'metaTitle', title: 'Tiêu đề SEO', type: 'string' },
            { name: 'metaDesc', title: 'Mô tả SEO', type: 'text' },
          ]
        }
      ]
    },
    // 2. QUẢN LÝ DỊCH VỤ
    {
      name: 'service',
      title: 'Dịch vụ',
      type: 'document',
      fields: [
        { name: 'title', title: 'Tên dịch vụ', type: 'string' },
        { name: 'slug', title: 'Đường dẫn', type: 'slug', options: { source: 'title' } },
        { name: 'icon', title: 'Icon (Lucide name)', type: 'string' },
        { name: 'description', title: 'Mô tả ngắn', type: 'text' },
      ]
    },
    // 3. QUẢN LÝ SẢN PHẨM
    {
      name: 'product',
      title: 'Sản phẩm',
      type: 'document',
      fields: [
        { name: 'productName', title: 'Tên sản phẩm', type: 'string' },
        { name: 'mainImage', title: 'Ảnh sản phẩm', type: 'image' },
        { name: 'price', title: 'Giá (nếu có)', type: 'string' },
        { name: 'category', title: 'Danh mục', type: 'string' }
      ]
    }
  ],
}