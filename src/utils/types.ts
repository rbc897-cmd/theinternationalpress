export type Profile = {
    id: string;
    full_name: string | null;
    role: 'user' | 'editor' | 'admin';
    created_at: string;
};

export type Category = {
    id: string;
    slug: string;
    name_en: string;
    name_ne: string;
    created_at: string;
};

export type Post = {
    id: string;
    slug_en: string;
    slug_ne: string | null;
    title_en: string;
    title_ne: string | null;
    excerpt_en: string | null;
    excerpt_ne: string | null;
    content_en: string | null;
    content_ne: string | null;
    status: 'draft' | 'published' | 'archived';
    category_id: string;
    author_id: string;
    featured_image: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    // Joins
    category?: Category;
    author?: Profile;
};
