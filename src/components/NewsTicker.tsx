import { insforge } from '@/lib/insforge';
import { MOCK_POSTS } from '@/lib/mock-data';
import NewsTickerClient from './NewsTickerClient';
import { Post } from '@/utils/types';

// Fetch verification revalidation time (e.g. 5 minutes)
export const revalidate = 300;

export default async function NewsTicker({ lang }: { lang: string }) {

    // Fetch latest 5 posts for the ticker
    let { data: posts, error } = await insforge.database
        .from('posts')
        .select(`
            *,
            category:categories(slug, name_en, name_ne)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5);

    if (error || !posts || posts.length === 0) {
        console.warn(`[NewsTicker] Fetch failed or no data, using mock data. Error: ${error ? (error as any).message : 'No data'}`);
        // Cast mock data to Post type roughly (ignoring some strict check for simplicity in fallback)
        posts = MOCK_POSTS as unknown as Post[];
    }

    return <NewsTickerClient initialPosts={posts as Post[]} lang={lang} />;
}
