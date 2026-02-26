import { insforge } from '@/lib/insforge';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ q?: string }>;
}

const getContent = (obj: any, lang: string, field: string) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
};

// Sanitize search input to prevent PostgREST query injection
const sanitizeSearch = (input: string): string => {
    return input
        .replace(/[%_\\]/g, '\\$&')   // Escape LIKE wildcards
        .replace(/[,().]/g, '')        // Remove PostgREST operators
        .trim()
        .substring(0, 100);            // Enforce length limit
};

export default async function SearchPage({ params, searchParams }: Props) {
    const { lang } = await params;
    const { q } = await searchParams;
    const query = q || '';

    let posts: any[] = [];
    let error = null;

    if (query.trim()) {
        const safeQuery = sanitizeSearch(query);

        // Perform search on title and excerpt (in both languages)
        const { data, error: searchError } = await insforge.database
            .from('posts')
            .select(`
        *,
        category:categories(slug, name_en, name_ne),
        author:profiles(full_name)
      `)
            .eq('status', 'published')
            .or(`title_en.ilike.%${safeQuery}%,title_ne.ilike.%${safeQuery}%,excerpt_en.ilike.%${safeQuery}%,excerpt_ne.ilike.%${safeQuery}%`)
            .order('published_at', { ascending: false })
            .limit(20);

        if (searchError) {
            error = searchError;
        } else {
            posts = data || [];
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-neutral-900 mb-8">
                    {lang === 'ne' ? 'खोज परिणामहरू' : 'Search Results'}
                    {query && <span className="text-neutral-500 font-normal ml-2">- "{query}"</span>}
                </h1>

                {error ? (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {lang === 'ne' ? 'खोज्दा त्रुटि भयो' : 'Error performing search. Please try again.'}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <article key={post.id} className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-neutral-100">
                                {post.featured_image && (
                                    <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden relative">
                                        <Image
                                            src={post.featured_image}
                                            alt={getContent(post, lang, 'title')}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 192px"
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <span className="inline-block px-2 py-0.5 bg-[var(--primary-50)] text-[var(--primary-700)] text-xs font-semibold rounded-full border border-[var(--primary-100)]">
                                            {getContent(post.category, lang, 'name')}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-neutral-800 mb-2 leading-snug">
                                        <Link href={`/${lang}/news/${getContent(post, lang, 'slug')}`} className="hover:text-[var(--primary-600)] transition-colors">
                                            {getContent(post, lang, 'title')}
                                        </Link>
                                    </h2>
                                    <p className="text-neutral-600 text-sm line-clamp-2 mb-3">
                                        {getContent(post, lang, 'excerpt')}
                                    </p>
                                    <div className="text-xs text-neutral-400">
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-200">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-medium text-neutral-700">
                            {query
                                ? (lang === 'ne' ? 'कुनै नतिजा फेला परेन' : 'No results found')
                                : (lang === 'ne' ? 'कृपया केही खोज्नुहोस्' : 'Please enter a search term')}
                        </h3>
                        <p className="text-neutral-500 mt-2">
                            {query && (lang === 'ne' ? `"${query}" को लागि कुनै मेल खाएन` : `No matches for "${query}"`)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
