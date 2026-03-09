
import { Footer } from "@/components/footer"
import { BlueprintBackground } from "@/components/blueprint-background"
import { ContactSection } from "@/components/contact-section"
import { PageHeader } from "@/components/page-header"
import { getDictionary } from "@/lib/get-dictionary"

export const metadata = {
  title: "Liên hệ - ZINITEK",
  description: "Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết cho dự án của bạn.",
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ lang: string }> | { lang: string }
}) {
  const resolvedParams = await params
  const { lang } = resolvedParams
  const dict = await getDictionary(lang)

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50 dark:opacity-10 pointer-events-none">
        <BlueprintBackground />
      </div>

      {/* Loai bỏ pt-20 thừa thãi */}
      <div className="relative z-10">
        <PageHeader
          title={dict.contact?.title || (lang === 'vi' ? "Liên hệ" : "Contact")}
          subtitle={dict.contact?.subtitle || (lang === 'vi' ? "Kết nối" : "Get in touch")}
          description={dict.contact?.description || (lang === 'vi' ? "ZINITEK luôn sẵn sàng lắng nghe và tư vấn các giải pháp kỹ thuật tối ưu cho dự án của bạn." : "ZINITEK is always ready to listen and provide optimal technical solutions for your projects.")}
          lang={lang}
          dict={dict}
        />

        <ContactSection lang={lang} dict={dict} />
      </div>

      <Footer lang={lang} dict={dict} />
    </main>
  )
}