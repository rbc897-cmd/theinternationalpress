'use client';

import Link from 'next/link';
import { Post } from '@/utils/types';
import { useState } from 'react';

// Define the shape of props
interface NewsTickerClientProps {
    initialPosts: Post[];
    lang: string;
}

export default function NewsTickerClient({ initialPosts, lang }: NewsTickerClientProps) {
    const [posts, setPosts] = useState<Post[]>(initialPosts);

    // If no posts, don't render anything
    if (!posts || posts.length === 0) return null;

    // Duplicate posts to create seamless loop effect if there are few posts
    // We need enough content to fill the width for the scrolling effect to look good
    const displayPosts = [...posts, ...posts, ...posts];

    const getContent = (obj: any, field: string) => {
        if (!obj) return '';
        return obj[`${field}_${lang}`] || obj[`${field}_en`] || '';
    };

    return (
        <div className="w-full bg-white border-b border-neutral-200 overflow-hidden relative z-30 h-10 flex items-center">

            {/* Label - Absolute positioned to stay fixed */}
            <div className="absolute left-0 z-40 h-full flex items-center bg-[var(--primary-600)] text-white px-4 text-xs font-bold uppercase tracking-wider shadow-[4px_0_12px_-2px_rgba(0,0,0,0.1)]">
                {lang === 'ne' ? 'ताजा खबर' : 'Latest News'}
            </div>

            {/* Scrolling Content */}
            <div className="ticker-wrapper w-full pl-32">
                <div className="ticker-content flex items-center">
                    {displayPosts.map((post, idx) => (
                        <div key={`${post.id}-${idx}`} className="flex items-center mx-4 whitespace-nowrap">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--primary-500)] mr-3"></span>

                            {/* Category Badge */}
                            <span className="text-[10px] font-bold text-[var(--primary-600)] uppercase mr-2 bg-[var(--primary-50)] px-1.5 py-0.5 rounded border border-[var(--primary-100)]">
                                {getContent(post.category, 'name')}
                            </span>

                            {/* Headline Link */}
                            <Link
                                href={`/${lang}/news/${getContent(post, 'slug')}`}
                                className="text-sm text-neutral-700 hover:text-[var(--primary-700)] transition-colors font-medium"
                            >
                                {getContent(post, 'title')}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fade effect on the right */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-30"></div>
        </div>
    );
}
