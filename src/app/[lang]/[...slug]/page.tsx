import { insforge } from '@/lib/insforge';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const getContent = (obj: any, lang: string, field: string) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
};

type Props = {
    params: Promise<{ lang: string; slug: string[] }>
}

// Full category/subcategory info map
const categoryMap: Record<string, {
    en: string
    ne: string
    parentSlug?: string  // for subcategories, the DB slug to query
    type?: 'media'       // special marker for media pages
}> = {
    // Main categories
    'nepal': { en: 'Nepal', ne: 'नेपाल' },
    'world': { en: 'World', ne: 'विश्व' },
    'politics': { en: 'Politics', ne: 'राजनीति' },
    'economy': { en: 'Economy', ne: 'अर्थतन्त्र' },
    'business': { en: 'Business', ne: 'व्यवसाय' },
    'climate': { en: 'Climate', ne: 'जलवायु' },
    'science': { en: 'Science', ne: 'विज्ञान' },
    'opinion': { en: 'Opinion', ne: 'विचार' },
    'media': { en: 'Media', ne: 'मिडिया', type: 'media' },

    // Nepal subcategories
    'nepal/politics': { en: 'Politics', ne: 'राजनीति', parentSlug: 'nepal' },
    'nepal/economy': { en: 'Economy', ne: 'अर्थतन्त्र', parentSlug: 'nepal' },
    'nepal/opinion': { en: 'Opinion', ne: 'विचार', parentSlug: 'nepal' },
    'nepal/technology': { en: 'Technology', ne: 'प्रविधि', parentSlug: 'nepal' },
    'nepal/lifestyle': { en: 'Lifestyle', ne: 'जीवनशैली', parentSlug: 'nepal' },

    // World subcategories
    'world/asia': { en: 'Asia', ne: 'एशिया', parentSlug: 'world' },
    'world/europe': { en: 'Europe', ne: 'युरोप', parentSlug: 'world' },
    'world/americas': { en: 'Americas', ne: 'अमेरिका', parentSlug: 'world' },
    'world/middle-east': { en: 'Middle East', ne: 'मध्यपूर्व', parentSlug: 'world' },
    'world/africa': { en: 'Africa', ne: 'अफ्रिका', parentSlug: 'world' },
    'world/global-institutions': { en: 'Global Institutions', ne: 'विश्व संस्था', parentSlug: 'world' },

    // Media subcategories
    'media/watch': { en: 'Watch', ne: 'हेर्नुहोस्', type: 'media' },
    'media/listen': { en: 'Listen', ne: 'सुन्नुहोस्', type: 'media' },
}

// Parent category names for breadcrumbs
const parentNames: Record<string, { en: string; ne: string }> = {
    'nepal': { en: 'Nepal', ne: 'नेपाल' },
    'world': { en: 'World', ne: 'विश्व' },
    'media': { en: 'Media', ne: 'मिडिया' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;
    const slugPath = slug.join('/');
    const catInfo = categoryMap[slugPath];

    if (!catInfo) {
        return { title: 'Not Found' };
    }

    const name = lang === 'ne' ? catInfo.ne : catInfo.en;
    return {
        title: lang === 'ne' ? `${name} - समाचार` : `${name} - News`,
        description: lang === 'ne' ? `${name} सम्बन्धी ताजा समाचार।` : `Latest news about ${name}.`,
    };
}

export default async function CategoryPage({ params }: Props) {
    const { lang, slug } = await params;
    const slugPath = slug.join('/');
    const catInfo = categoryMap[slugPath];

    if (!catInfo) {
        notFound();
    }

    const name = lang === 'ne' ? catInfo.ne : catInfo.en;

    // Media pages: Watch and Listen (special "coming soon" pages)
    if (catInfo.type === 'media') {
        if (slugPath === 'media/watch') {
            return (
                <div className="space-y-8 py-8">
                    <div className="section-header">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                            {lang === 'ne' ? 'हेर्नुहोस्' : 'Watch'}
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            {lang === 'ne' ? 'भिडियो समाचार र सामग्री' : 'Video news and content'}
                        </p>
                    </div>
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-neutral-300">
                        <div className="text-6xl mb-4">📺</div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                            {lang === 'ne' ? 'चाँडै आउँदैछ' : 'Coming Soon'}
                        </h2>
                        <p className="text-neutral-500 text-lg">
                            {lang === 'ne' ? 'भिडियो सामग्री छिट्टै उपलब्ध हुनेछ।' : 'Video content will be available soon.'}
                        </p>
                    </div>
                </div>
            );
        }
        if (slugPath === 'media/listen') {
            return (
                <div className="space-y-8 py-8">
                    <div className="section-header">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                            {lang === 'ne' ? 'सुन्नुहोस्' : 'Listen'}
                        </h1>
                        <p className="text-neutral-600 mt-2">
                            {lang === 'ne' ? 'अडियो समाचार र पोडकास्ट' : 'Audio news and podcasts'}
                        </p>
                    </div>
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-neutral-300">
                        <div className="text-6xl mb-4">🎧</div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                            {lang === 'ne' ? 'चाँडै आउँदैछ' : 'Coming Soon'}
                        </h2>
                        <p className="text-neutral-500 text-lg">
                            {lang === 'ne' ? 'अडियो सामग्री छिट्टै उपलब्ध हुनेछ।' : 'Audio content will be available soon.'}
                        </p>
                    </div>
                </div>
            );
        }
        // Media index page
        return (
            <div className="space-y-8 py-8">
                <div className="section-header">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                        {lang === 'ne' ? 'मिडिया' : 'Media'}
                    </h1>
                    <p className="text-neutral-600 mt-2">
                        {lang === 'ne' ? 'भिडियो र अडियो सामग्री' : 'Video and audio content'}
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <Link href={`/${lang}/media/watch`} className="group p-8 bg-white rounded-2xl border border-neutral-200 hover:border-[var(--primary-200)] hover:shadow-lg transition-all">
                        <div className="text-5xl mb-4">📺</div>
                        <h2 className="text-xl font-bold text-neutral-800 group-hover:text-[var(--primary-700)] transition-colors mb-2">
                            {lang === 'ne' ? 'हेर्नुहोस्' : 'Watch'}
                        </h2>
                        <p className="text-neutral-500">
                            {lang === 'ne' ? 'भिडियो समाचार र सामग्री' : 'Video news and content'}
                        </p>
                    </Link>
                    <Link href={`/${lang}/media/listen`} className="group p-8 bg-white rounded-2xl border border-neutral-200 hover:border-[var(--primary-200)] hover:shadow-lg transition-all">
                        <div className="text-5xl mb-4">🎧</div>
                        <h2 className="text-xl font-bold text-neutral-800 group-hover:text-[var(--primary-700)] transition-colors mb-2">
                            {lang === 'ne' ? 'सुन्नुहोस्' : 'Listen'}
                        </h2>
                        <p className="text-neutral-500">
                            {lang === 'ne' ? 'अडियो समाचार र पोडकास्ट' : 'Audio news and podcasts'}
                        </p>
                    </Link>
                </div>
            </div>
        );
    }

    // Regular category pages — query the database
    const categorySlug = slug[slug.length - 1]; // The most specific slug segment for querying
    const parentSegment = slug.length > 1 ? slug[0] : null;

    let query = insforge.database
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

    // For subcategories, try to filter by the subcategory slug
    // For main categories, filter by the main category slug
    query = query.eq('categories.slug', categorySlug);

    const { data: posts, error } = await query;

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-neutral-200">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-800 mb-2">
                        {lang === 'ne' ? 'त्रुटि भयो' : 'Error loading news'}
                    </h2>
                    <p className="text-neutral-500">
                        {lang === 'ne' ? 'कृपया पछि फेरि प्रयास गर्नुहोस्।' : 'Please try again later.'}
                    </p>
                </div>
            </div>
        );
    }

    // Breadcrumb for subcategories
    const parentInfo = parentSegment ? parentNames[parentSegment] : null;

    return (
        <div className="space-y-8 py-8">
            {/* Breadcrumb for subcategories */}
            {parentInfo && (
                <nav className="flex items-center gap-2 text-sm text-neutral-500">
                    <Link href={`/${lang}`} className="hover:text-[var(--primary-600)] transition-colors">
                        {lang === 'ne' ? 'गृहपृष्ठ' : 'Home'}
                    </Link>
                    <span>/</span>
                    <Link href={`/${lang}/${parentSegment}`} className="hover:text-[var(--primary-600)] transition-colors">
                        {lang === 'ne' ? parentInfo.ne : parentInfo.en}
                    </Link>
                    <span>/</span>
                    <span className="text-neutral-800 font-medium">{name}</span>
                </nav>
            )}

            {/* Page Header */}
            <div className="section-header">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                    {name}
                </h1>
                <p className="text-neutral-600 mt-2">
                    {lang === 'ne' ? `${name} सम्बन्धी ताजा समाचार` : `Latest news about ${name}`}
                </p>
            </div>

            {/* Articles Grid */}
            {posts && posts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <article key={post.id} className="article-card group">
                            {post.featured_image ? (
                                <div className="h-56 overflow-hidden relative">
                                    <Image
                                        src={post.featured_image}
                                        alt={getContent(post, lang, 'title')}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
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
                        {lang === 'ne' ? `${name} मा कुनै समाचार भेटिएन।` : `No articles found in ${name}.`}
                    </p>
                </div>
            )}
        </div>
    );
}
