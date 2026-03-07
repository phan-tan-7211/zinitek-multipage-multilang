// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.
import React from 'react'

export const metadata = {
  title: 'Zinitek Sanity Studio',
  description: 'Backend quản trị nội dung cho website Zinitek',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // THÊM DÒNG NÀY: suppressHydrationWarning={true} để chặn lỗi Hydration
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body 
        style={{ margin: 0 }}
        suppressHydrationWarning={true} // Giữ nguyên ở body để an toàn tuyệt đối
      >
        {children}
      </body>
    </html>
  )
}