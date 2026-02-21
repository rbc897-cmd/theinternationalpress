import { insforge } from '@/lib/insforge';
import Link from 'next/link';
import type { Metadata } from 'next';

const getContent = (obj: any, lang: string, field: string) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
};

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'ne' ? 'सबै समाचार' : 'All News',
        description: lang === 'ne' ? 'युरोप भिसा र जानकारी सम्बन्धी समाचार।' : 'Europe visa and information news.',
    };
}

export default async function NewsListing({ params }: Props) {
    const { lang } = await params;

    const { data: posts, error } = await insforge.database
        .from('posts')
        .select(`
      id,
      slug_en, slug_ne,
      title_en, title_ne,
      excerpt_en, excerpt_ne,
      featured_image,
      published_at,
      category:categories(slug, name_en, name_ne)
    `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20);

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-neutral-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">Error loading news</h2>
                    <p className="text-neutral-500">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-8">
            {/* Page Header */}
            <div className="section-header">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                    {lang === 'ne' ? 'सबै समाचार' : 'All News'}
                </h1>
            </div>

            {/* Articles Grid */}
            {posts && posts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <article key={post.id} className="article-card group">
                            {post.featured_image ? (
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={post.featured_image}
                                        alt={getContent(post, lang, 'title')}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ) : (
                                <div className="h-56 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] flex items-center justify-center">
                                    <span className="text-5xl opacity-50">📰</span>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="mb-3">
                                    <span className="category-badge-outline">
                                        {getContent(post.category, lang, 'name')}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold mb-3 text-neutral-800 line-clamp-2 leading-snug group-hover:text-[var(--primary-700)] transition-colors">
                                    <Link href={`/${lang}/news/${getContent(post, lang, 'slug')}`}>
                                        {getContent(post, lang, 'title')}
                                    </Link>
                                </h2>

                                <p className="text-neutral-500 text-sm mb-4 line-clamp-3">
                                    {getContent(post, lang, 'excerpt')}
                                </p>

                                <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-100">
                                    <span className="flex items-center gap-2">
                                        📅 {new Date(post.published_at).toLocaleDateString()}
                                    </span>
                                    <Link
                                        href={`/${lang}/news/${getContent(post, lang, 'slug')}`}
                                        className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                                    >
                                        {lang === 'ne' ? 'पुरा पढ्नुहोस् →' : 'Read Full →'}
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-neutral-300">
                    <div className="text-6xl mb-4">📰</div>
                    <p className="text-neutral-500 text-lg">
                        {lang === 'ne' ? 'कुनै समाचार भेटिएन।' : 'No news articles found.'}
                    </p>
                </div>
            )}
        </div>
    );
}
