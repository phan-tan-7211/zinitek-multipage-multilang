

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { IconManager } from 'sanity-plugin-icon-manager'
import { schemaTypes } from './index'
import { ImportExportTool } from '../tools/ImportExportTool'

export default defineConfig({
  name: 'default',
  title: 'Zinitek Admin',
  projectId: 'g4o3uumy',
  dataset: 'production',
  basePath: '/studio',

  tools: (prev) => [
    ...prev,
    {
      name: 'import-export',
      title: 'Nhập/Xuất Dữ Liệu',
      component: ImportExportTool,
    },
  ],

  plugins: [
    structureTool(),
    visionTool(),
    IconManager(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'vi', title: 'Tiếng Việt' },
        { id: 'en', title: 'English' },
        { id: 'cn', title: 'Chinese' },
        { id: 'jp', title: 'Japanese' },
        { id: 'kr', title: 'Korean' },
      ],
      schemaTypes: [
        'service',
        'product',
        'project',
        'blogPost',
        'pageContent',
        'seoPageConfig',
        'blogCategory'
      ],
    })
  ],

  schema: {
    types: schemaTypes,

    /**
     * CẬP NHẬT QUAN TRỌNG: Ghi đè cấu hình hiển thị cho Metadata
     * Đoạn mã này sẽ thay đổi cách Sanity hiển thị danh sách trong mục "Translation metadata"
     * mà không cần tạo tệp tin schema riêng.
     */
    templates: (mauTruoc) => [
      ...mauTruoc,
      {
        id: 'translation-metadata-preview',
        title: 'Metadata Preview',
        schemaType: 'translation.metadata',
        value: {
          // Bỏ trống để dùng logic prepare bên dưới
        },
        // SỬA ĐỔI: Sử dụng 'preview' trực tiếp trong schema config
        preview: {
          select: {
            // Lấy tiêu đề từ bản dịch đầu tiên trong mảng
            tieuDeBaiViet: 'translations[0].value->title',
            soLuongNgonNgu: 'translations',
          },
          prepare(luaChon: any) {
            const { tieuDeBaiViet, soLuongNgonNgu } = luaChon;

            // Đếm số lượng ngôn ngữ
            const tongSoNgonNgu = soLuongNgonNgu ? soLuongNgonNgu.length : 0;

            return {
              title: tieuDeBaiViet || 'Nhóm tài liệu chưa có tiêu đề',
              subtitle: `Đã dịch sang ${tongSoNgonNgu} ngôn ngữ`,
            };
          },
        },
      },
    ],
  },
})