// Không viết tắt; dùng tên biến đầy đủ; giải thích thay đổi bằng tiếng Việt rõ ràng.

export default {
    name: 'legalDoc',
    title: 'Văn bản Pháp lý',
    type: 'document',
    fields: [
        // 1. Quản lý ngôn ngữ (Ẩn đối với người dùng)
        {
            name: 'language',
            type: 'string',
            readOnly: true,
            hidden: true,
        },

        // 2. Tiêu đề văn bản
        {
            name: 'title',
            title: 'Tiêu đề văn bản',
            type: 'string',
            description: 'Ví dụ: Chính sách bảo mật, Điều khoản sử dụng...',
            validation: (Rule: any) => Rule.required(),
        },

        // 3. Đường dẫn định danh (Slug)
        {
            name: 'slug',
            title: 'Đường dẫn (Slug)',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
                // Cho phép trùng Slug nếu khác ngôn ngữ (vì URL có tiền tố /[lang]/ rồi)
                isUnique: async (slug: string, context: any) => {
                    const { document, getClient } = context;
                    if (!getClient) return true;

                    try {
                        const client = getClient({ apiVersion: '2024-01-01' });
                        const id = document._id.replace(/^drafts\./, '');
                        const ngonNgu = document.language || 'vi';

                        const query = `count(*[_type == "legalDoc" && slug.current == $slug && language == $ngonNgu && _id != $id && _id != "drafts." + $id])`;
                        const params = { slug, ngonNgu, id };

                        const result = await client.fetch(query, params);
                        return result === 0;
                    } catch (error) {
                        console.error("Slug uniqueness check failed:", error);
                        return true; // Fallback: allow if network/query fails
                    }
                }
            },
            validation: (Rule: any) => Rule.required(),
        },

        // 4. Nội dung chi tiết (Sử dụng Portable Text)
        {
            name: 'content',
            title: 'Nội dung chi tiết',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image', options: { hotspot: true } },
            ],
            description: 'Nội dung đầy đủ của văn bản pháp lý.',
            validation: (Rule: any) => Rule.required(),
        },

        // 5. Ngày cập nhật cuối
        {
            name: 'lastUpdated',
            title: 'Ngày cập nhật cuối',
            type: 'date',
            initialValue: (new Date()).toISOString().split('T')[0],
        },
    ],
    preview: {
        select: {
            title: 'title',
            language: 'language',
        },
        prepare(selection: any) {
            const { title, language } = selection;
            return {
                title: title,
                subtitle: `Ngôn ngữ: ${language?.toUpperCase() || 'Chưa chọn'}`,
            };
        },
    },
}
