// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
// GIẢI PHÁP CHO VẤN ĐỀ "SCHEMA TYPES":
// Khi chỉ dùng filter(_type == "translation.metadata"), Sanity không biết nên tạo loại document nào.
// Giải pháp: Dùng S.documentTypeList(schemaType) trực tiếp thay vì list metadata.
// Khi nhấn "+" ở mục "Dịch vụ", nó sẽ tạo "service" ngay lập tức, không cần chọn Schema Types.

import { StructureResolver } from 'sanity/structure'
import {
  EarthGlobeIcon,
  CogIcon,
  PackageIcon,
  CaseIcon,
  DocumentIcon,
  TagIcon,
  SearchIcon,
  DatabaseIcon
} from '@sanity/icons'

// Hàm tạo mục có 2 chế độ xem: Nhóm (theo metadata) và Phẳng (đầy đủ, không sót)
const taoMucDaNgonNgu = (S: any, id: string, title: string, icon: any, tenLoaiDoc: string) =>
  S.listItem()
    .id(`${id}-parent`)
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title(title)
        .items([
          // CHẾ ĐỘ 1: Nhóm theo Translation Metadata
          // "+" trong chế độ này tạo translation.metadata mới với schemaType được tự điền sẵn
          S.listItem()
            .id(`${id}-grouped`)
            .title('Nhóm theo bản dịch')
            .icon(EarthGlobeIcon)
            .child(
              S.documentList()
                .title(`Nhóm ${title}`)
                .filter(`_type == "translation.metadata" && "${tenLoaiDoc}" in schemaTypes`)
                .initialValueTemplates([
                  // Khi tạo mới từ đây, tự điền sẵn schemaTypes
                  S.initialValueTemplateItem('translation.metadata', {
                    schemaTypes: [tenLoaiDoc],
                  })
                ])
            ),
          // CHẾ ĐỘ 2: Danh sách phẳng để tránh sót tài liệu chưa gán metadata
          // "+" trong chế độ này tạo document loại đúng (service/product...) ngay
          S.listItem()
            .id(`${id}-flat`)
            .title('Tất cả bản dịch')
            .icon(DatabaseIcon)
            .child(
              S.documentTypeList(tenLoaiDoc).title(`Tất cả ${title}`)
            ),
        ])
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Quản lý Nội dung Zinitek')
    .items([
      // 1. DỊCH VỤ
      taoMucDaNgonNgu(S, 'services', 'Dịch vụ', CogIcon, 'service'),

      // 2. SẢN PHẨM
      taoMucDaNgonNgu(S, 'products', 'Sản phẩm', PackageIcon, 'product'),

      // 3. DỰ ÁN
      taoMucDaNgonNgu(S, 'projects', 'Dự án', CaseIcon, 'project'),

      S.divider(),

      // 4. BLOG: BÀI VIẾT
      taoMucDaNgonNgu(S, 'blog-posts', 'Bài viết Blog', DocumentIcon, 'blogPost'),

      // 5. BLOG: DANH MỤC
      taoMucDaNgonNgu(S, 'blog-categories', 'Danh mục Blog', TagIcon, 'blogCategory'),

      S.divider(),

      // 6. CẤU HÌNH TRANG & SEO
      taoMucDaNgonNgu(S, 'seo-configs', 'Cấu hình Trang & SEO', SearchIcon, 'seoPageConfig'),

      // 7. VĂN BẢN PHÁP LÝ
      taoMucDaNgonNgu(S, 'legal-docs', 'Văn bản Pháp lý', EarthGlobeIcon, 'legalDoc'),

      // 8. NỘI DUNG TĨNH
      taoMucDaNgonNgu(S, 'page-content', 'Nội dung tĩnh', DatabaseIcon, 'pageContent'),

      // CÁC MỤC KHÁC KHÔNG THUỘC NHÓM i18n (HIỂN THỊ BÌNH THƯỜNG)
      ...S.documentTypeListItems().filter(
        (listItem: any) => ![
          'service', 'product', 'project', 'blogPost',
          'blogCategory', 'seoPageConfig', 'legalDoc',
          'pageContent', 'translation.metadata'
        ].includes(listItem.getId() || '')
      ),
    ])