import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { BlogSection } from "@/components/blog-section"
import { PageHeader } from "@/components/page-header"
// Import hàm lấy từ điển
import { getDictionary } from "@/lib/get-dictionary"

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  
  return {
    title: dict.blog?.meta_title || "Blog - ZINITEK",
    description: dict.blog?.meta_desc || "Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK.",
  }
}

// Chuyển sang async function và nhận params
export default async function BlogPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> | { lang: string } 
}) {
  // 1. Lấy ngôn ngữ an toàn
  const resolvedParams = await params
  const { lang } = resolvedParams
  
  // 2. Lấy dữ liệu ngôn ngữ tương ứng
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-[#020617] text-foreground relative overflow-hidden">
      {/* Nền Blueprint */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* 3. Truyền lang và dict vào Navigation để dập lỗi 'undefined' */}
      <Navigation lang={lang} dict={dict} />
      
      <div className="relative z-10">
        <PageHeader 
          title={dict.blog?.title || "Blog"}
          subtitle={dict.blog?.subtitle || "Kiến thức chuyên sâu"}
          description={dict.blog?.description || "Cập nhật xu hướng công nghệ và chia sẻ kinh nghiệm từ đội ngũ kỹ sư ZINITEK."}
          lang={lang}
          dict={dict}
        />
        
        {/* Truyền dữ liệu vào BlogSection để hiển thị bài viết theo ngôn ngữ */}
        <BlogSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}