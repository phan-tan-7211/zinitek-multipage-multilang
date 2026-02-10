'use client'

import { Analytics } from "@vercel/analytics/react"
import Clarity from "./Clarity" // Chúng ta sẽ tách Clarity ra file riêng cùng thư mục

export default function TrackingProvider() {
  return (
    <>
      {/* 1. Vercel Analytics (Tốc độ & Lượt truy cập) */}
      <Analytics />
      
      {/* 2. Microsoft Clarity (Quay video hành vi) */}
      <Clarity />
      
      {/* Sau này muốn thêm Google Analytics thì chỉ cần dán thêm vào đây */}
    </>
  )
}