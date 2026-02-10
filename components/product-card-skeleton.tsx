
"use client"

import React from 'react'
import { HardHat } from 'lucide-react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton' // Giả định bạn có component Skeleton

// Component Skeleton Card
function ProductCardSkeleton() {
  return (
    // Tái sử dụng 100% lớp nền của Card Sản phẩm/Dịch vụ để đồng bộ giao diện
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="group bg-[#0f172a]/50 border border-[#334155]/50 p-8 rounded-2xl flex flex-col h-full animate-pulse"
    >
      
      {/* Icon/Category Placeholder */}
      <div className="flex items-center text-sm font-medium text-[#f97316] mb-4">
        <HardHat className="w-4 h-4 mr-1 animate-spin-slow" /> {/* Dùng hiệu ứng xoay chậm đã định nghĩa */}
        <Skeleton className="h-4 w-2/5 bg-[#1e293b]" />
      </div>

      {/* Tiêu đề Placeholder */}
      <Skeleton className="h-8 w-3/4 bg-[#1e293b] mb-4" />
      
      {/* Ảnh Placeholder */}
      <Skeleton className="h-40 w-full bg-[#1e293b] rounded-lg mb-6" />

      {/* Mô tả Placeholder */}
      <div className="flex-grow space-y-2 mb-6">
        <Skeleton className="h-3 w-full bg-[#1e293b]" />
        <Skeleton className="h-3 w-11/12 bg-[#1e293b]" />
        <Skeleton className="h-3 w-4/5 bg-[#1e293b]" />
      </div>

      {/* Nút Xem chi tiết Placeholder */}
      <div className="flex items-center gap-2 text-[#f97316] font-medium text-sm">
        <Skeleton className="h-4 w-1/4 bg-[#1e293b]" />
      </div>

    </motion.div>
  )
}

// Component tổng hợp để render nhiều Skeleton
export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}