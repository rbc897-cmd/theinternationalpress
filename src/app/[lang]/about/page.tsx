import type { Metadata } from 'next';
import { Target, Eye, Users, Newspaper, Globe, Award } from 'lucide-react';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'ne' ? 'हाम्रो बारेमा' : 'About Us',
        description: lang === 'ne' ? 'दि इन्टरनेसनल प्रेसको बारेमा।' : 'About The International Press.',
    };
}

const content = {
    en: {
        heroTitle: 'About Us',
        heroSubtitle: 'Your Trusted Source for International News & Information',
        heroDescription: 'We are committed to delivering accurate, timely, and impactful journalism that keeps our readers informed and engaged across the globe.',
        storyTitle: 'Our Story',
        storyText: 'The International Press is a comprehensive news portal dedicated to providing accurate, timely, and relevant information about life, work, and travel across the world, with a special focus on the global Nepali community. Since our founding, we have grown into a trusted name in international journalism.',
        mission: 'Our Mission',
        missionText: 'To bridge the information gap for individuals seeking opportunities worldwide by providing reliable news, visa guides, and success stories that empower informed decisions.',
        vision: 'Our Vision',
        visionText: 'To become the leading platform for the Nepali diaspora and aspiring travelers, fostering a well-informed and connected community across borders.',
        values: 'Our Values',
        valuesList: [
            { icon: 'newspaper', title: 'Accuracy', text: 'We verify every story and prioritize factual reporting above all else.' },
            { icon: 'globe', title: 'Global Reach', text: 'We cover stories from every continent, bringing the world closer to our readers.' },
            { icon: 'users', title: 'Community', text: 'We serve our community with stories that matter, voices that count, and information that empowers.' },
            { icon: 'award', title: 'Excellence', text: 'We strive for the highest standards in journalism, design, and reader experience.' },
        ],
        statsTitle: 'By the Numbers',
        stats: [
            { value: '50K+', label: 'Monthly Readers' },
            { value: '1,000+', label: 'Articles Published' },
            { value: '25+', label: 'Countries Covered' },
            { value: '24/7', label: 'News Coverage' },
        ],
        ctaTitle: 'Connect With Us',
        ctaText: 'Have a story to share, a question to ask, or feedback to give? We\'d love to hear from you.',
        ctaButton: 'Contact Us',
    },
    ne: {
        heroTitle: 'हाम्रो बारेमा',
        heroSubtitle: 'अन्तर्राष्ट्रिय समाचार र जानकारीको लागि तपाईंको विश्वसनीय स्रोत',
        heroDescription: 'हामी विश्वभर हाम्रा पाठकहरूलाई सही, समयसान्दर्भिक, र प्रभावकारी पत्रकारिता प्रदान गर्न प्रतिबद्ध छौं।',
        storyTitle: 'हाम्रो कथा',
        storyText: 'दि इन्टरनेसनल प्रेस एक व्यापक समाचार पोर्टल हो जुन विश्वभर जीवन, काम र यात्राको बारेमा सही, समयसान्दर्भिक र सान्दर्भिक जानकारी प्रदान गर्न समर्पित छ, विशेष गरी विश्वभरका नेपाली समुदायमा केन्द्रित छ।',
        mission: 'हाम्रो मिशन',
        missionText: 'विश्वभर अवसरहरू खोजिरहेका व्यक्तिहरूका लागि भरपर्दो समाचार, भिसा गाइडहरू र सफलताका कथाहरू प्रदान गरेर सूचनाको कमीलाई हटाउने।',
        vision: 'हाम्रो दृष्टिकोण',
        visionText: 'नेपाली डायस्पोरा र उदीयमान यात्रीहरूका लागि नेतृत्वदायी प्लेटफर्म बन्ने, जसले सुसूचित र जोडिएको समुदायलाई बढावा दिन्छ।',
        values: 'हाम्रा मूल्यहरू',
        valuesList: [
            { icon: 'newspaper', title: 'शुद्धता', text: 'हामी प्रत्येक कथा प्रमाणित गर्छौं र तथ्यपरक रिपोर्टिङलाई सधैं प्राथमिकता दिन्छौं।' },
            { icon: 'globe', title: 'विश्वव्यापी पहुँच', text: 'हामी हरेक महाद्वीपबाट कथाहरू कभर गर्छौं, विश्वलाई हाम्रा पाठकहरू नजिक ल्याउँछौं।' },
            { icon: 'users', title: 'समुदाय', text: 'हामी हाम्रो समुदायलाई महत्त्वपूर्ण कथा, गणनीय आवाज, र सशक्त जानकारीसहित सेवा गर्छौं।' },
            { icon: 'award', title: 'उत्कृष्टता', text: 'हामी पत्रकारिता, डिजाइन र पाठक अनुभवमा उच्चतम मापदण्डको लागि प्रयास गर्छौं।' },
        ],
        statsTitle: 'संख्यामा',
        stats: [
            { value: '५०K+', label: 'मासिक पाठकहरू' },
            { value: '१,०००+', label: 'प्रकाशित लेखहरू' },
            { value: '२५+', label: 'कभर गरिएका देशहरू' },
            { value: '२४/७', label: 'समाचार कभरेज' },
        ],
        ctaTitle: 'हामीसँग जोडिनुहोस्',
        ctaText: 'साझा गर्न कथा, सोध्नुपर्ने प्रश्न, वा दिनुपर्ने प्रतिक्रिया छ? हामी तपाईंबाट सुन्न चाहन्छौं।',
        ctaButton: 'सम्पर्क गर्नुहोस्',
    },
};

const iconMap: Record<string, React.ReactNode> = {
    newspaper: <Newspaper className="w-6 h-6" />,
    globe: <Globe className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    award: <Award className="w-6 h-6" />,
};

export default async function AboutPage({ params }: Props) {
    const { lang } = await params;
    const t = lang === 'ne' ? content.ne : content.en;

    return (
        <div className="space-y-16 -mt-8">
            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-900)] to-[var(--primary-950)] text-white py-20 md:py-28 px-6 text-center">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[var(--accent)] rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium">
                        <Users className="w-4 h-4" />
                        {lang === 'ne' ? 'हाम्रो बारेमा' : 'About'}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        {t.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                        {t.heroSubtitle}
                    </p>
                    <p className="text-sm text-white/60 max-w-xl mx-auto">
                        {t.heroDescription}
                    </p>
                </div>
            </section>

            {/* ═══════════════ OUR STORY ═══════════════ */}
            <section className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100">
                    <div className="section-header mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                            {t.storyTitle}
                        </h2>
                    </div>
                    <p className="text-neutral-600 leading-relaxed text-lg">
                        {t.storyText}
                    </p>
                </div>
            </section>

            {/* ═══════════════ MISSION & VISION ═══════════════ */}
            <section className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm hover:shadow-xl hover:border-[var(--primary-200)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">{t.mission}</h3>
                        <p className="text-neutral-700 leading-relaxed font-medium text-lg mb-2">
                            {t.missionText}
                        </p>
                    </div>

                    <div className="group bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm hover:shadow-xl hover:border-[var(--primary-200)] hover:-translate-y-1 transition-all duration-300">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] mb-5 group-hover:scale-110 transition-transform duration-300">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">{t.vision}</h3>
                        <p className="text-neutral-700 leading-relaxed font-medium text-lg mb-2">
                            {t.visionText}
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══════════════ STATS ═══════════════ */}
            <section className="max-w-5xl mx-auto">
                <div className="rounded-3xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] p-10 md:p-14 text-white">
                    <h2 className="text-center text-2xl md:text-3xl font-bold mb-10">{t.statsTitle}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {t.stats.map((stat, idx) => (
                            <div key={idx} className="text-center space-y-1">
                                <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{stat.value}</div>
                                <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ VALUES ═══════════════ */}
            <section className="max-w-5xl mx-auto">
                <div className="section-header mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{t.values}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {t.valuesList.map((item, idx) => (
                        <div
                            key={idx}
                            className="group bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-xl hover:border-[var(--primary-200)] hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] mb-4 group-hover:scale-110 transition-transform duration-300">
                                {iconMap[item.icon]}
                            </div>
                            <h3 className="text-sm font-bold text-neutral-800 mb-2">{item.title}</h3>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="max-w-3xl mx-auto pb-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 text-center space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{t.ctaTitle}</h2>
                    <p className="text-neutral-600 max-w-lg mx-auto">{t.ctaText}</p>
                    <a
                        href={`/${lang}/contact`}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))' }}
                    >
                        {t.ctaButton}
                    </a>
                </div>
            </section>
        </div>
    );
}
