import { StructureResolver } from 'sanity/structure'
import {
  EarthGlobeIcon,
  CogIcon,
  PackageIcon,
  CaseIcon,
  DocumentIcon,
  TagIcon,
  SearchIcon,
  DatabaseIcon,
  UsersIcon
} from '@sanity/icons'

const taoMucDaNgonNgu = (S: any, id: string, title: string, icon: any, tenLoaiDoc: string) =>
  S.listItem()
    .id(`${id}-parent`)
    .title(title)
    .icon(icon)
    .child(
      S.list()
        .title(title)
        .items([
          S.listItem()
            .id(`${id}-grouped`)
            .title('Nhóm theo bản dịch')
            .icon(EarthGlobeIcon)
            .child(
              S.documentList()
                .title(`Nhóm ${title}`)
                .filter(`_type == "translation.metadata" && "${tenLoaiDoc}" in schemaTypes`)
                .initialValueTemplates([
                  S.initialValueTemplateItem('translation.metadata', {
                    schemaTypes: [tenLoaiDoc],
                  })
                ])
            ),
          S.listItem()
            .id(`${id}-flat`)
            .title('Tất cả bản dịch')
            .icon(DatabaseIcon)
            .child(S.documentTypeList(tenLoaiDoc).title(`Tất cả ${title}`)),
        ])
    )

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Quản lý Nội dung Zinitek')
    .items([
      S.listItem()
        .id('site-settings')
        .title('Cấu hình website')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Cấu hình toàn website')
        ),
      S.listItem()
        .id('google-reviews-settings')
        .title('Đánh giá Google')
        .icon(EarthGlobeIcon)
        .child(
          S.document()
            .schemaType('googleReviewsSettings')
            .documentId('googleReviewsSettings')
            .title('Đánh giá Google hiển thị trên website')
        ),
      S.listItem()
        .id('trusted-companies')
        .title('Doanh nghiệp tin tưởng')
        .icon(UsersIcon)
        .child(
          S.document()
            .schemaType('trustedCompanies')
            .documentId('trustedCompanies')
            .title('Doanh nghiệp tin tưởng ZINITEK')
        ),

      S.divider(),
      taoMucDaNgonNgu(S, 'services', 'Dịch vụ', CogIcon, 'service'),
      taoMucDaNgonNgu(S, 'products', 'Sản phẩm', PackageIcon, 'product'),
      taoMucDaNgonNgu(S, 'projects', 'Dự án', CaseIcon, 'project'),
      S.divider(),
      taoMucDaNgonNgu(S, 'blog-posts', 'Bài viết Blog', DocumentIcon, 'blogPost'),
      taoMucDaNgonNgu(S, 'blog-categories', 'Danh mục Blog', TagIcon, 'blogCategory'),
      S.divider(),
      taoMucDaNgonNgu(S, 'seo-configs', 'Cấu hình Trang & SEO', SearchIcon, 'seoPageConfig'),
      taoMucDaNgonNgu(S, 'legal-docs', 'Văn bản Pháp lý', EarthGlobeIcon, 'legalDoc'),
      taoMucDaNgonNgu(S, 'page-content', 'Nội dung tĩnh', DatabaseIcon, 'pageContent'),

      ...S.documentTypeListItems().filter(
        (listItem: any) => ![
          'service', 'product', 'project', 'blogPost',
          'blogCategory', 'seoPageConfig', 'legalDoc',
          'pageContent', 'translation.metadata', 'siteSettings',
          'trustedCompanies', 'googleReviewsSettings'
        ].includes(listItem.getId() || '')
      ),
    ])
