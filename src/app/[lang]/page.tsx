import { insforge } from '@/lib/insforge';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { MOCK_POSTS } from '@/lib/mock-data';

const getContent = (obj: any, lang: string, field: string) => {
  if (!obj) return '';
  return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
};

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === 'ne'
    ? 'युरोप जानकारी र भिसा ब्लग - गृहपृष्ठ'
    : 'Europe Information & Visa Blog - Home';
  const description = lang === 'ne'
    ? 'नेपाली विद्यार्थी र कामदारहरूका लागि विश्वसनीय युरोप समाचार र भिसा जानकारी।'
    : 'Reliable Europe news and visa information for Nepali students and workers.';

  return { title, description };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;

  let { data: posts, error } = await insforge.database
    .from('posts')
    .select(`
      *,
      category:categories(slug, name_en, name_ne),
      author:profiles(full_name)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10);

  // Fallback to mock data if fetch fails
  if (error || !posts) {
    console.warn(`[Home] Fetch failed, using mock data. Error: ${error ? (error as any).message : 'No data'}`);
    posts = MOCK_POSTS;
  }

  // Filter posts for sections (using mock data or real data logic)
  // Note: Real DB usage queries directly by category_id, but here we filter the fetched list 
  // to ensure consistency if we fall back to mock data.
  // For production with real DB, separate queries are better for pagination, 
  // but for this fix/mock hybrid, filtering the main list is safer.

  const nepalPosts = posts?.filter((p: any) =>
    p.category?.slug === 'nepal' ||
    p.category_id === 'b8b86756-74d2-4666-ba2f-45761b538e30'
  )?.slice(0, 4) || [];

  const worldPosts = posts?.filter((p: any) =>
    p.category?.slug === 'world' ||
    p.category_id === '8e8d232c-d4d1-4347-bd5f-86a39a628b37'
  )?.slice(0, 4) || [];

  const hasPosts = posts && posts.length > 0;
  const featuredPost = hasPosts ? posts[0] : null;
  const recentPosts = hasPosts && posts.length > 1 ? posts.slice(1, 7) : [];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Featured Section */}
      <section>
        {featuredPost ? (
          <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden group">
            {featuredPost.featured_image ? (
              <Image
                src={featuredPost.featured_image}
                alt={getContent(featuredPost, lang, 'title')}
                fill
                priority
                sizes="100vw"
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] to-[var(--primary-950)]" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 hero-overlay" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-3xl">
                <span className="category-badge mb-4">
                  {getContent(featuredPost.category, lang, 'name')}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  <Link
                    href={`/${lang}/news/${getContent(featuredPost, lang, 'slug')}`}
                    className="hover:underline decoration-2 underline-offset-4"
                  >
                    {getContent(featuredPost, lang, 'title')}
                  </Link>
                </h1>
                <p className="text-neutral-200 text-lg md:text-xl mb-6 line-clamp-2">
                  {getContent(featuredPost, lang, 'excerpt')}
                </p>
                <div className="flex items-center gap-4 text-sm text-neutral-300">
                  <span className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                      {(featuredPost.author?.full_name || 'A')[0]}
                    </span>
                    {featuredPost.author?.full_name || 'Admin'}
                  </span>
                  <span className="text-neutral-400">•</span>
                  <span>{new Date(featuredPost.published_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] rounded-2xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-2xl font-bold mb-2">
                {lang === 'ne' ? 'स्वागत छ' : 'Welcome'}
              </h2>
              <p className="text-primary-200">
                {lang === 'ne' ? 'समाचार छिट्टै आउँदैछ' : 'News coming soon'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Latest News Section */}
      <section>
        <div className="section-header">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-900)]">
            {lang === 'ne' ? 'ताजा अपडेट' : 'Latest Updates'}
          </h2>
          <Link
            href={`/${lang}/news`}
            className="ml-auto text-sm font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
          >
            {lang === 'ne' ? 'सबै हेर्नुहोस् →' : 'View All →'}
          </Link>
        </div>

        {recentPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post: any) => (
              <article key={post.id} className="article-card">
                {post.featured_image ? (
                  <div className="h-52 overflow-hidden relative">
                    <Image
                      src={post.featured_image}
                      alt={getContent(post, lang, 'title')}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-52 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] flex items-center justify-center">
                    <span className="text-4xl opacity-50">📰</span>
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-3">
                    <span className="category-badge-outline text-xs">
                      {getContent(post.category, lang, 'name')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-neutral-800 mb-3 line-clamp-2 leading-snug hover:text-[var(--primary-700)] transition-colors">
                    <Link href={`/${lang}/news/${getContent(post, lang, 'slug')}`}>
                      {getContent(post, lang, 'title')}
                    </Link>
                  </h3>

                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                    {getContent(post, lang, 'excerpt')}
                  </p>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-100">
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    <Link
                      href={`/${lang}/news/${getContent(post, lang, 'slug')}`}
                      className="font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)]"
                    >
                      {lang === 'ne' ? 'पढ्नुहोस्' : 'Read More'}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-neutral-300">
            <p className="text-neutral-500 text-lg">
              {lang === 'ne' ? 'अन्य समाचार उपलब्ध छैन।' : 'No other updates found.'}
            </p>
          </div>
        )}
      </section>

      {/* Nepal Section */}
      <section>
        <div className="section-header mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇳🇵</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-900)]">
              {lang === 'ne' ? 'नेपाल' : 'Nepal'}
            </h2>
          </div>
          <Link
            href={`/${lang}/news/nepal`}
            className="ml-auto text-sm font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
          >
            {lang === 'ne' ? 'सबै हेर्नुहोस् →' : 'View All →'}
          </Link>
        </div>

        {nepalPosts && nepalPosts.length > 0 ? (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Featured Post - Left Side (7 columns) */}
            <div className="lg:col-span-8">
              {nepalPosts[0] && (
                <article className="group relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {nepalPosts[0].featured_image ? (
                    <Image
                      src={nepalPosts[0].featured_image}
                      alt={getContent(nepalPosts[0], lang, 'title')}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block px-3 py-1 bg-[var(--primary-600)] text-white text-xs font-bold rounded-full mb-4">
                      {lang === 'ne' ? 'मुख्य खबर' : 'FEATURED'}
                    </span>
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      <Link href={`/${lang}/news/${getContent(nepalPosts[0], lang, 'slug')}`} className="hover:text-primary-200 transition-colors">
                        {getContent(nepalPosts[0], lang, 'title')}
                      </Link>
                    </h3>
                    <p className="text-neutral-200 text-lg line-clamp-2 md:line-clamp-3 mb-6 max-w-2xl">
                      {getContent(nepalPosts[0], lang, 'excerpt')}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-neutral-300">
                      <span>{new Date(nepalPosts[0].published_at).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-neutral-400 rounded-full"></span>
                      <span>{nepalPosts[0].author?.full_name || 'Admin'}</span>
                    </div>
                  </div>
                </article>
              )}
            </div>

            {/* Side List - Right Side (5 columns) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {nepalPosts.slice(1).map((post: any) => (
                <article key={post.id} className="flex gap-4 group items-start">
                  <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    {post.featured_image ? (
                      <Image
                        src={post.featured_image}
                        alt={getContent(post, lang, 'title')}
                        fill
                        sizes="128px"
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-2xl">🇳🇵</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-neutral-800 mb-2 leading-snug group-hover:text-[var(--primary-700)] transition-colors line-clamp-2">
                      <Link href={`/${lang}/news/${getContent(post, lang, 'slug')}`}>
                        {getContent(post, lang, 'title')}
                      </Link>
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}

              {nepalPosts.length < 2 && (
                <div className="h-full bg-neutral-50 rounded-xl border border-dashed border-neutral-200 flex items-center justify-center p-8 text-center">
                  <p className="text-neutral-400 text-sm">
                    {lang === 'ne' ? 'थप समाचार आउँदैछ...' : 'More stories coming soon...'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-4">🇳🇵</span>
            <h3 className="text-lg font-semibold text-neutral-700 mb-1">
              {lang === 'ne' ? 'अहिले कुनै समाचार छैन' : 'No Nepal news yet'}
            </h3>
            <p className="text-neutral-500 text-sm">
              {lang === 'ne' ? 'यो खण्डमा छिट्टै अपडेट हुनेछ' : 'Content for this section is coming soon'}
            </p>
          </div>
        )}
      </section>

      {/* World Section */}
      <section>
        <div className="section-header mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌍</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--primary-900)]">
              {lang === 'ne' ? 'विश्व' : 'World'}
            </h2>
          </div>
          <Link
            href={`/${lang}/news/world`}
            className="ml-auto text-sm font-semibold text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
          >
            {lang === 'ne' ? 'सबै हेर्नुहोस् →' : 'View All →'}
          </Link>
        </div>

        {worldPosts && worldPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {worldPosts.map((post: any) => (
              <article key={post.id} className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={getContent(post, lang, 'title')}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full mb-2 border border-white/10">
                    {getContent(post.category, lang, 'name')}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-gray-200 transition-colors">
                    <Link href={`/${lang}/news/${getContent(post, lang, 'slug')}`}>
                      <span className="absolute inset-0"></span>
                      {getContent(post, lang, 'title')}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-12 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-4">🌍</span>
            <h3 className="text-lg font-semibold text-neutral-700 mb-1">
              {lang === 'ne' ? 'अहिले कुनै समाचार छैन' : 'No World news yet'}
            </h3>
            <p className="text-neutral-500 text-sm">
              {lang === 'ne' ? 'यो खण्डमा छिट्टै अपडेट हुनेछ' : 'Content for this section is coming soon'}
            </p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-[var(--primary-900)] to-[var(--primary-950)] rounded-2xl p-8 md:p-12 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {lang === 'ne' ? 'न्यूजलेटर सब्सक्राइब गर्नुहोस्' : 'Subscribe to Our Newsletter'}
          </h2>
          <p className="text-neutral-300 mb-8">
            {lang === 'ne'
              ? 'युरोप भिसा र आप्रवासन सम्बन्धी नवीनतम अपडेट सिधै तपाईंको इमेलमा पाउनुहोस्।'
              : 'Get the latest updates on Europe visa and immigration directly to your inbox.'}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              id="homepage-newsletter-email"
              name="email"
              type="email"
              placeholder={lang === 'ne' ? 'तपाईंको इमेल' : 'Your email address'}
              className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              {lang === 'ne' ? 'सब्सक्राइब' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
