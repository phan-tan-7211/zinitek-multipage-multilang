// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { defineConfig } from 'sanity'
import { EarthGlobeIcon } from '@sanity/icons'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { IconManager } from 'sanity-plugin-icon-manager'
import { schemaTypes } from './sanity/schemaTypes'
import { ImportExportTool } from './sanity/tools/ImportExportTool'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'default',
  title: 'Zinitek Admin',
  projectId: 'g4o3uumy',
  dataset: 'production',
  basePath: '/studio',

  tools: (danhSachCongCuTruoc) => [
    ...danhSachCongCuTruoc,
    {
      name: 'import-export',
      title: 'Nhập/Xuất Dữ Liệu',
      component: ImportExportTool,
    },
  ],

  plugins: [
    structureTool({ structure }),
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
        'blogCategory',
        'legalDoc'
      ],
    })
  ],

  schema: {
    // SỬA LỖI CÚ PHÁP Ở ĐÂY: Đảm bảo hàm types được đóng ngoặc đúng
    types: (cacLoaiSchemaTruoc) => {

      const danhSachSchemaDaSua = cacLoaiSchemaTruoc.map((loaiSchema) => {

        if (loaiSchema.name === 'translation.metadata') {
          return {
            ...loaiSchema,
            preview: {
              select: {
                tieuDeGoc: 'translations.0.value.title',
                danhSachBanDich: 'translations',
                danhSachLoaiTaiLieu: 'schemaTypes',
              },
              prepare(luaChon: any) {
                const { tieuDeGoc, danhSachBanDich, danhSachLoaiTaiLieu, id } = luaChon;

                const tieuDeHienThi = tieuDeGoc || (id ? `Nhóm ID: ${id.slice(0, 8)}...` : 'Đang cập nhật...');

                const maNgonNgu = Array.isArray(danhSachBanDich)
                  ? danhSachBanDich.map((t: any) => t._key ? t._key.toUpperCase() : '').join(', ')
                  : '';

                const tenLoaiTaiLieu = danhSachLoaiTaiLieu?.[0] || 'document';

                return {
                  title: tieuDeHienThi,
                  subtitle: `(${maNgonNgu}) ${tenLoaiTaiLieu}`,
                  media: EarthGlobeIcon
                }
              }
            }
          }
        }
        return loaiSchema
      });

      // Trả về mảng kết hợp: Schema của bạn + Schema đã sửa
      return [...schemaTypes, ...danhSachSchemaDaSua];
    }, // Dấu ngoặc nhọn đóng cho hàm types nằm ở đây
  }, // Dấu ngoặc nhọn đóng cho schema nằm ở đây (CHUẨN LẠI)
})