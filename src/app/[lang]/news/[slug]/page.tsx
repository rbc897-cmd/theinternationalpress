import { insforge } from '@/lib/insforge';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Clock, Calendar, ChevronRight, ArrowLeft, Facebook, Twitter, Share2, Link2, User } from 'lucide-react';

const getContent = (obj: any, lang: string, field: string) => {
    if (!obj) return '';
    return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
};

const estimateReadTime = (html: string): number => {
    const text = html?.replace(/<[^>]*>/g, '') || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (dateStr: string, lang: string): string => {
    const date = new Date(dateStr);
    if (lang === 'ne') {
        return date.toLocaleDateString('ne-NP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

type Props = {
    params: Promise<{ lang: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang, slug } = await params;

    const { data: post } = await insforge.database
        .from('posts')
        .select('*')
        .or(`slug_en.eq.${slug},slug_ne.eq.${slug}`)
        .eq('status', 'published')
        .maybeSingle();

    if (!post) {
        return { title: 'Article Not Found' };
    }

    const title = getContent(post, lang, 'title') || 'Article';
    const description = getContent(post, lang, 'excerpt') || '';
    const images = post.featured_image ? [post.featured_image] : [];

    return {
        title,
        description,
        openGraph: { title, description, images },
    };
}

export default async function ArticlePage({ params }: Props) {
    const { lang, slug } = await params;

    const { data: post, error } = await insforge.database
        .from('posts')
        .select(`
      *,
      category:categories(id, slug, name_en, name_ne),
      author:profiles(full_name)
    `)
        .or(`slug_en.eq.${slug},slug_ne.eq.${slug}`)
        .eq('status', 'published')
        .maybeSingle();

    if (error) {
        console.error('Article fetch error:', JSON.stringify(error, null, 2));
        throw error;
    }

    if (!post) {
        console.warn(`Article not found: slug=${slug}, lang=${lang}`);
        notFound();
    }

    const articleContent = getContent(post, lang, 'content');
    const readTime = estimateReadTime(articleContent);
    const title = getContent(post, lang, 'title');
    const excerpt = getContent(post, lang, 'excerpt');
    const categoryName = getContent(post.category, lang, 'name');

    // Fetch related posts (same category, exclude current)
    let relatedPosts: any[] = [];
    if (post.category_id) {
        const { data } = await insforge.database
            .from('posts')
            .select(`
                *,
                category:categories(slug, name_en, name_ne),
                author:profiles(full_name)
            `)
            .eq('category_id', post.category_id)
            .eq('status', 'published')
            .neq('id', post.id)
            .order('published_at', { ascending: false })
            .limit(3);

        relatedPosts = data || [];
    }

    // If we don't have enough related, backfill with latest posts
    if (relatedPosts.length < 3) {
        const excludeIds = [post.id, ...relatedPosts.map((p: any) => p.id)];
        const { data } = await insforge.database
            .from('posts')
            .select(`
                *,
                category:categories(slug, name_en, name_ne),
                author:profiles(full_name)
            `)
            .eq('status', 'published')
            .not('id', 'in', `(${excludeIds.join(',')})`)
            .order('published_at', { ascending: false })
            .limit(3 - relatedPosts.length);

        relatedPosts = [...relatedPosts, ...(data || [])];
    }

    const dict = {
        en: {
            home: 'Home',
            news: 'News',
            minRead: 'min read',
            share: 'Share this article',
            shareOn: 'Share on',
            copyLink: 'Copy link',
            backToNews: 'Back to News',
            relatedPosts: 'Related Articles',
            relatedSubtitle: 'More stories you might enjoy',
            readMore: 'Read More',
            by: 'By',
        },
        ne: {
            home: 'गृहपृष्ठ',
            news: 'समाचार',
            minRead: 'मिनेट पढ्ने',
            share: 'यो लेख साझा गर्नुहोस्',
            shareOn: 'मा साझा गर्नुहोस्',
            copyLink: 'लिंक कपी गर्नुहोस्',
            backToNews: 'सबै समाचार हेर्नुहोस्',
            relatedPosts: 'सम्बन्धित लेखहरू',
            relatedSubtitle: 'तपाईंलाई मन पर्न सक्ने थप कथाहरू',
            readMore: 'थप पढ्नुहोस्',
            by: 'द्वारा',
        },
    };
    const t = lang === 'ne' ? dict.ne : dict.en;

    return (
        <div className="pb-16">
            {/* ═══════════════ BREADCRUMBS ═══════════════ */}
            <nav className="flex items-center gap-2 text-sm text-neutral-400 py-4 -mt-2 mb-2">
                <Link href={`/${lang}`} className="hover:text-[var(--primary-600)] transition-colors">
                    {t.home}
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href={`/${lang}/news`} className="hover:text-[var(--primary-600)] transition-colors">
                    {t.news}
                </Link>
                {categoryName && (
                    <>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link
                            href={`/${lang}/${post.category?.slug || ''}`}
                            className="hover:text-[var(--primary-600)] transition-colors"
                        >
                            {categoryName}
                        </Link>
                    </>
                )}
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-neutral-600 font-medium truncate max-w-[200px]">{title}</span>
            </nav>

            <article>
                {/* ═══════════════ HERO IMAGE SECTION ═══════════════ */}
                {post.featured_image ? (
                    <div className="relative h-[420px] md:h-[540px] rounded-3xl overflow-hidden mb-10 -mx-4 md:mx-0 shadow-2xl">
                        <Image
                            src={post.featured_image}
                            alt={title}
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                            <div className="max-w-4xl">
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span className="category-badge">
                                        {categoryName}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                                        <Clock className="w-3.5 h-3.5" />
                                        {readTime} {t.minRead}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
                                    {title}
                                </h1>
                                {excerpt && (
                                    <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed line-clamp-2">
                                        {excerpt}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative rounded-3xl overflow-hidden mb-10 -mx-4 md:mx-0 shadow-2xl">
                        <div className="bg-gradient-to-br from-[var(--primary-700)] via-[var(--primary-800)] to-[var(--primary-950)] p-10 md:p-14 lg:p-20">
                            {/* Decorative elements */}
                            <div className="absolute inset-0 opacity-[0.07]">
                                <div className="absolute top-8 right-8 w-64 h-64 bg-white rounded-full blur-3xl" />
                                <div className="absolute bottom-8 left-8 w-80 h-80 bg-[var(--accent)] rounded-full blur-3xl" />
                            </div>

                            <div className="relative z-10 max-w-4xl">
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span className="category-badge bg-white/20 backdrop-blur-sm">
                                        {categoryName}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white/80 bg-white/10 backdrop-blur-sm rounded-full border border-white/15">
                                        <Clock className="w-3.5 h-3.5" />
                                        {readTime} {t.minRead}
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
                                    {title}
                                </h1>
                                {excerpt && (
                                    <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed line-clamp-2">
                                        {excerpt}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════ ARTICLE BODY ═══════════════ */}
                <div className="max-w-4xl mx-auto">
                    {/* ── AUTHOR & META BAR ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-neutral-200 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-black/10">
                                {(post.author?.full_name || 'A')[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-neutral-800 text-base">
                                    {post.author?.full_name || 'Admin'}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-neutral-400">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {formatDate(post.published_at, lang)}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-300" />
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {readTime} {t.minRead}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Share buttons (desktop) */}
                        <div className="hidden sm:flex items-center gap-2">
                            <span className="text-xs font-medium text-neutral-400 mr-1">{t.share}:</span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/${lang}/news/${slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-800 text-neutral-500 hover:text-white flex items-center justify-center transition-all duration-200"
                                aria-label={`${t.shareOn} Facebook`}
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`/${lang}/news/${slug}`)}&text=${encodeURIComponent(title)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-800 text-neutral-500 hover:text-white flex items-center justify-center transition-all duration-200"
                                aria-label={`${t.shareOn} Twitter`}
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <button
                                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-800 text-neutral-500 hover:text-white flex items-center justify-center transition-all duration-200"
                                aria-label={t.copyLink}
                            >
                                <Link2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* ── ARTICLE CONTENT ── */}
                    <div className="prose prose-lg max-w-none
                        prose-headings:text-neutral-900 prose-headings:font-extrabold prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-neutral-100
                        prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-neutral-700 prose-p:leading-[1.85] prose-p:text-[1.05rem] prose-p:md:text-lg
                        prose-a:text-[var(--primary-600)] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8
                        prose-blockquote:border-l-[var(--primary-500)] prose-blockquote:bg-[var(--primary-50)] prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-2 prose-blockquote:not-italic prose-blockquote:text-neutral-700
                        prose-strong:text-neutral-900
                        prose-ul:my-6 prose-li:text-neutral-700
                        prose-code:text-[var(--primary-700)] prose-code:bg-[var(--primary-50)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-medium
                    ">
                        <div dangerouslySetInnerHTML={{ __html: articleContent }} />
                    </div>

                    {/* ── BOTTOM SHARE & NAVIGATION ── */}
                    <div className="border-t border-neutral-200 mt-14 pt-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold text-neutral-700 mb-3">
                                    {t.share}
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/${lang}/news/${slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 hover:shadow-lg hover:shadow-black/15 transition-all duration-200"
                                        aria-label={`${t.shareOn} Facebook`}
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`/${lang}/news/${slug}`)}&text=${encodeURIComponent(title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-11 h-11 rounded-xl bg-neutral-700 text-white flex items-center justify-center hover:bg-neutral-600 hover:shadow-lg hover:shadow-black/15 transition-all duration-200"
                                        aria-label={`${t.shareOn} Twitter`}
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <button
                                        className="w-11 h-11 rounded-xl bg-neutral-800 text-white flex items-center justify-center hover:bg-neutral-700 hover:shadow-lg hover:shadow-neutral-800/25 transition-all duration-200"
                                        aria-label={t.copyLink}
                                    >
                                        <Link2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <Link
                                href={`/${lang}/news`}
                                className="group inline-flex items-center gap-2 text-[var(--primary-600)] hover:text-[var(--primary-700)] font-semibold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                {t.backToNews}
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* ═══════════════ RELATED ARTICLES ═══════════════ */}
            {relatedPosts.length > 0 && (
                <section className="mt-20 max-w-6xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary-50)] text-[var(--primary-600)] text-xs font-bold uppercase tracking-widest mb-3">
                            <Share2 className="w-3.5 h-3.5" />
                            {t.relatedPosts}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                            {t.relatedSubtitle}
                        </h2>
                    </div>

                    {/* Related posts grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((rPost: any) => {
                            const rTitle = getContent(rPost, lang, 'title');
                            const rExcerpt = getContent(rPost, lang, 'excerpt');
                            const rSlug = getContent(rPost, lang, 'slug') || rPost.slug_en;
                            const rCategory = getContent(rPost.category, lang, 'name');
                            const rReadTime = estimateReadTime(getContent(rPost, lang, 'content'));

                            return (
                                <Link
                                    key={rPost.id}
                                    href={`/${lang}/news/${rSlug}`}
                                    className="group article-card flex flex-col"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                                        {rPost.featured_image ? (
                                            <Image
                                                src={rPost.featured_image}
                                                alt={rTitle}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] flex items-center justify-center">
                                                <span className="text-4xl font-extrabold text-[var(--primary-300)]">
                                                    {rTitle?.[0] || 'T'}
                                                </span>
                                            </div>
                                        )}
                                        {rCategory && (
                                            <div className="absolute top-3 left-3">
                                                <span className="category-badge text-[10px] shadow-lg">
                                                    {rCategory}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-base font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-[var(--primary-600)] transition-colors mb-2">
                                            {rTitle}
                                        </h3>
                                        {rExcerpt && (
                                            <p className="text-sm text-neutral-500 line-clamp-2 mb-4 flex-1">
                                                {rExcerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--primary-400)] to-[var(--primary-600)] flex items-center justify-center">
                                                    <User className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-xs font-medium text-neutral-600">
                                                    {rPost.author?.full_name || 'Admin'}
                                                </span>
                                            </div>
                                            <span className="flex items-center gap-1 text-xs text-neutral-400">
                                                <Clock className="w-3 h-3" />
                                                {rReadTime} {t.minRead}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
}
