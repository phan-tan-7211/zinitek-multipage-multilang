// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

import service from './service'
import pageContent from './pageContent'
import product from './product' 
import seoPageConfig from './seoPageConfig'
import project from './project' 
import post from './post' 
// Nhập định nghĩa cấu trúc dữ liệu Danh mục Blog mới tạo từ Bước 1
import blogCategory from './blogCategory' 

export const schemaTypes = [
  service, 
  product,
  pageContent,
  seoPageConfig,
  project,
  post,
  // Thêm danh mục blog vào danh sách các loại tài liệu được quản lý bởi Sanity
  blogCategory
]