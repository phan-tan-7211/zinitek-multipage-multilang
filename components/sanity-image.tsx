
"use client"
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface SanityImageProps {
  imageData: { url?: string, _id?: string } | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

// URL Placeholder an toàn: sử dụng một ảnh cố định trong public/images
const PLACEHOLDER_URL = "/images/placeholder-machine.webp"; 
// GHI CHÚ: Bạn cần đặt một ảnh máy móc màu tối vào public/images/placeholder-machine.webp

export function SanityImage({ imageData, alt, width, height, className, priority }: SanityImageProps) {
    
    // Kiểm tra tính hợp lệ của URL ảnh từ Sanity
    const imageUrl = imageData?.url;
    
    if (!imageUrl) {
        // Fallback về ảnh Placeholder cục bộ
        return (
            <Image
                src={PLACEHOLDER_URL}
                alt={`Placeholder cho ${alt}`}
                width={width}
                height={height}
                className={cn("object-cover", className)}
                priority={priority}
            />
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width}
            height={height}
            className={cn("object-cover", className)}
            priority={priority}
        />
    )
}