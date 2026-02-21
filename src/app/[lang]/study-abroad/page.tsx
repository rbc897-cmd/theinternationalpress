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
        title: lang === 'ne' ? 'विदेश अध्ययन' : 'Study Abroad',
        description: lang === 'ne' ? 'युरोपमा अध्ययन र छात्रवृत्ति सम्बन्धी जानकारी।' : 'Information about studying and scholarships in Europe.',
    };
}

export default async function StudyAbroadPage({ params }: Props) {
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
        .eq('categories.slug', 'study-abroad')
        .order('published_at', { ascending: false })
        .limit(20);

    return (
        <div className="space-y-8 py-8">
            <div className="section-header">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                    {lang === 'ne' ? 'विदेश अध्ययन' : 'Study Abroad'}
                </h1>
                <p className="text-neutral-600 mt-2">
                    {lang === 'ne' ? 'युरोपमा अध्ययन र कोर्स पोर्टल' : 'Study and course portal for Europe'}
                </p>
            </div>

            {posts && posts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <article key={post.id} className="article-card group">
                            {post.featured_image && (
                                <div className="h-56 overflow-hidden">
                                    <img
                                        src={post.featured_image}
                                        alt={getContent(post, lang, 'title')}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-xl font-bold mb-3 text-neutral-800 line-clamp-2">
                                    <Link href={`/${lang}/news/${getContent(post, lang, 'slug')}`}>
                                        {getContent(post, lang, 'title')}
                                    </Link>
                                </h2>
                                <p className="text-neutral-500 text-sm line-clamp-3">
                                    {getContent(post, lang, 'excerpt')}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-neutral-300">
                    <p className="text-neutral-500">
                        {lang === 'ne' ? 'कुनै लेख भेटिएन।' : 'No articles found.'}
                    </p>
                </div>
            )}
        </div>
    );
}
