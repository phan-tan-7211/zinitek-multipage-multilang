'use client'

/**
 * FILE CẤU HÌNH GIAO DIỆN STUDIO (CLIENT SIDE)
 * Nhiệm vụ: Hiển thị giao diện và nạp cấu hình từ file gốc (sanity.config.ts)
 */

import { NextStudio } from 'next-sanity/studio'
// Import cấu hình từ file gốc để đồng bộ 100% (Bao gồm IconManager và ImportExportTool)
import config from '../../../sanity.config' 

export default function StudioPage() {
  return (
    // Giữ nguyên style height 100vh để Studio hiển thị full màn hình
    <div style={{ height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <NextStudio config={config} />
    </div>
  )
}

// Giữ nguyên thuộc tính này để tránh lỗi Cache của Next.js khi build
export const dynamic = 'force-dynamic'