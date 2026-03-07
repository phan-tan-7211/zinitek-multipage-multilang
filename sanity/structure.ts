// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Quản lý Nội dung Zinitek')
    .items([
      // Hiển thị tất cả các loại tài liệu đã định nghĩa trong schemaTypes
      ...S.documentTypeListItems(),
    ])