

import { createClient } from "next-sanity";

// --- ĐỊNH NGHĨA PAGE IDENTIFIER AN TOÀN ---
export type PageIdentifier = 'home' | 'about' | 'contact' | 'servicesHub' | 'productsHub' | string;

// --- CẤU HÌNH SANITY CLIENT ---
const client = createClient({
  projectId: 'g4o3uumy',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Định nghĩa hàm lấy dữ liệu SEO
export async function fetchSeoData(language: string, identifier: PageIdentifier) {
    const query = `
      *[_type == "seoPageConfig" && pageIdentifier == $identifier && language == $language][0] { // Dùng Schema mới
        metaTitle,
        metaDescription,
        openGraphImage {
            asset->{url, originalFilename}
        },
        heroHeading,
        mainContent
      }
    `;

    let data = await client.fetch(query, { language, identifier });

    // FALLBACK LOGIC: Fallback về Tiếng Anh, sau đó Tiếng Việt
    if (!data) {
        data = await client.fetch(query, { language: 'en', identifier });
    }
    if (!data) {
        data = await client.fetch(query, { language: 'vi', identifier });
    }

    return data;
}