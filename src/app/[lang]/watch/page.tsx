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
        title: lang === 'ne' ? 'हेर्नुहोस्' : 'Watch',
        description: lang === 'ne' ? 'भिडियो समाचार र सामग्री।' : 'Video news and content.',
    };
}

export default async function WatchPage({ params }: Props) {
    const { lang } = await params;

    return (
        <div className="space-y-8 py-8">
            {/* Page Header */}
            <div className="section-header">
                <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary-900)]">
                    {lang === 'ne' ? 'हेर्नुहोस्' : 'Watch'}
                </h1>
                <p className="text-neutral-600 mt-2">
                    {lang === 'ne' ? 'भिडियो समाचार र सामग्री' : 'Video news and content'}
                </p>
            </div>

            {/* Coming Soon Placeholder */}
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
