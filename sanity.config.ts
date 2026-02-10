// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' 
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { IconManager } from 'sanity-plugin-icon-manager'
import { schemaTypes } from './sanity/schemaTypes'
import { ImportExportTool } from './sanity/tools/ImportExportTool'

export default defineConfig({
  name: 'default',
  title: 'Zinitek Admin',
  projectId: 'g4o3uumy',
  dataset: 'production',
  basePath: '/studio',

  /** 
   * 1. CẤU HÌNH CÔNG CỤ BỔ SUNG (TOOLS)
   */
  tools: (prev) => [
    ...prev,
    {
      name: 'import-export',
      title: 'Nhập/Xuất Dữ Liệu',
      component: ImportExportTool,
    },
  ],

  /** 
   * 2. HỆ THỐNG TIỆN ÍCH MỞ RỘNG (PLUGINS)
   */
  plugins: [
    structureTool(), 
    visionTool(), 
    IconManager(), 
    
    /**
     * 🔮 CÂU THẦN CHÚ PHÒNG LỖI "UNTITLED":
     * Đã thêm 'blogCategory' vào danh sách schemaTypes bên dưới.
     */
    documentInternationalization({
      supportedLanguages: [
        { id: 'vi', title: 'Tiếng Việt' },
        { id: 'en', title: 'English' },
        { id: 'cn', title: 'Chinese' },
        { id: 'jp', title: 'Japanese' },
        { id: 'kr', title: 'Korean' },
      ],
      // ĐĂNG KÝ CÁC LOẠI TÀI LIỆU HỖ TRỢ ĐA NGÔN NGỮ TẠI ĐÂY:
      schemaTypes: [
        'service', 
        'product', 
        'project', 
        'blogPost', 
        'pageContent', 
        'seoPageConfig',
        'blogCategory' // <--- THÊM DÒNG NÀY ĐỂ KÍCH HOẠT ĐA NGÔN NGỮ CHO DANH MỤC BLOG
      ], 
    })
  ],

  /** 
   * 3. CẤU CẤU TRÚC DỮ LIỆU (SCHEMA)
   */
  schema: {
    types: schemaTypes,
  },
})