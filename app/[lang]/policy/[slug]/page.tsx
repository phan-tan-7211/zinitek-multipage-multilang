

import { notFound } from "next/navigation"
import { createClient } from "next-sanity"
import { getDictionary } from "@/lib/get-dictionary"
import { PortableText } from "@portabletext/react"
import { Clock, ShieldCheck } from "lucide-react"
// Import Client Component nút quay lại (dùng router.back())
import { NutQuayLai } from "@/components/nut-quay-lai"

// --- 1. CẤU HÌNH TRÌNH KẾT NỐI SANITY ---
const trinhKetNoiSanity = createClient({
    projectId: 'g4o3uumy',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
})

// --- 2. HÀM TRUY VẤN VĂN BẢN PHÁP LÝ ---
async function layVanBanPhapLy(duongDanSlug: string, ngonNguHienTai: string) {
    const cauTruyVan = `
    *[_type == "legalDoc" && (slug.current == $duongDanSlug || slug.current == ($ngonNguHienTai + "/" + $duongDanSlug)) && language == $ngonNguHienTai][0] {
      _id,
      title,
      content,
      lastUpdated,
      language,
      "slug": slug.current
    }
  `;

    return await trinhKetNoiSanity.fetch(cauTruyVan, { duongDanSlug, ngonNguHienTai });
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
    const thamSoTrang = await params;
    const vanBan = await layVanBanPhapLy(thamSoTrang.slug, thamSoTrang.lang);
    if (!vanBan) return { title: "Policy | ZINITEK" };
    return { title: `${vanBan.title} - ZINITEK` };
}

export default async function PolicyPage({
    params
}: {
    params: Promise<{ lang: string; slug: string }>
}) {
    const thamSoTrang = await params;
    const { lang, slug } = thamSoTrang;

    const [tuDienNgonNgu, duLieuVanBan] = await Promise.all([
        getDictionary(lang),
        layVanBanPhapLy(slug, lang)
    ]);

    if (!duLieuVanBan) {
        notFound();
    }

    const ngayCapNhat = duLieuVanBan.lastUpdated
        ? new Date(duLieuVanBan.lastUpdated).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
        : null;

    return (
        <main className="min-h-screen bg-background text-foreground pt-24 md:pt-32 pb-20">
            <div className="container mx-auto px-4 lg:px-6">

                {/* Sửa: Dùng Client Component NutQuayLai thay vì Link cứng href=lang
                    Mục đích: Khi nhấn, sẽ dùng router.back() quay về trang link tới trang lúc trước
                    (ví dụ: Footer → Trang pháp lý → nhấn nút → quay về Footer),
                    thay vì luôn về Trang chủ.
                    Label vẫn lấy từ Dictionary đúng ngôn ngữ hiện tại. */}
                <NutQuayLai
                    nhanHienThi={lang === 'vi' ? 'Quay lại' : 'Back'}
                    ngonNgu={lang}
                />

                <div className="max-w-4xl mx-auto">
                    <header className="mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f97316]/10 border border-[#f97316]/20 rounded-full text-[#f97316] text-xs font-black uppercase tracking-widest mb-6">
                            <ShieldCheck className="w-4 h-4" />
                            Legal Document
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-foreground">
                            {duLieuVanBan.title}
                        </h1>
                        {ngayCapNhat && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4 text-[#f97316]" />
                                <span>Last updated: {ngayCapNhat}</span>
                            </div>
                        )}
                    </header>

                    {/* Nội dung chính với Custom Scrollbar */}
                    <div className="bg-card rounded-3xl border border-border/50 p-8 md:p-12 shadow-xl shadow-black/5 dark:shadow-none relative overflow-hidden group/content">
                        <div className="max-h-[70vh] overflow-y-auto pr-6 
              scrollbar-thin scrollbar-thumb-transparent group-hover/content:scrollbar-thumb-[#f97316] scrollbar-track-transparent
              [&::-webkit-scrollbar]:w-1
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              group-hover/content:[&::-webkit-scrollbar-thumb]:bg-[#f97316]
              transition-all duration-300"
                        >
                            <article className="prose prose-invert prose-orange max-w-none prose-headings:font-serif prose-p:text-slate-300 prose-p:leading-relaxed prose-a:text-[#f97316]">
                                <PortableText value={duLieuVanBan.content} />
                            </article>
                        </div>

                        {/* Hiệu ứng mờ ở đáy để báo hiệu còn nội dung */}
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-card to-transparent pointer-events-none opacity-60 dark:opacity-100" />
                    </div>

                    {duLieuVanBan.language !== lang && (
                        <div className="mt-8 text-center text-xs text-slate-500 italic">
                            * This document is currently displayed in the <strong>{duLieuVanBan.language.toUpperCase()}</strong> version.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
