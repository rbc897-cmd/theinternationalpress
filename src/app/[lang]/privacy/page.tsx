import type { Metadata } from 'next';
import { Shield, Lock, Eye, Database, Cookie, Mail } from 'lucide-react';

type Props = {
    params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'ne' ? 'गोपनीयता नीति' : 'Privacy Policy',
        description: lang === 'ne'
            ? 'दि इन्टरनेसनल प्रेसको गोपनीयता नीति।'
            : 'Privacy Policy of The International Press.',
    };
}

const content = {
    en: {
        heroTitle: 'Privacy Policy',
        heroSubtitle: 'Your Privacy Matters to Us',
        heroDescription: 'We are committed to protecting your personal information and being transparent about how we collect, use, and safeguard your data.',
        lastUpdated: 'Last Updated: February 21, 2026',
        sections: [
            {
                icon: 'database',
                title: 'Information We Collect',
                content: [
                    'When you visit The International Press, we may collect the following types of information:',
                    '• **Personal Information:** Name, email address, and other details you voluntarily provide when subscribing to our newsletter, creating an account, or contacting us.',
                    '• **Usage Data:** Information about how you interact with our website, including pages visited, time spent on pages, browser type, device information, and IP address.',
                    '• **Cookies & Tracking:** We use cookies and similar technologies to enhance your browsing experience. See our Cookie Policy section below for details.',
                ],
            },
            {
                icon: 'eye',
                title: 'How We Use Your Information',
                content: [
                    'We use the information we collect for the following purposes:',
                    '• To provide, maintain, and improve our news services and website functionality.',
                    '• To send you newsletters and updates you have subscribed to.',
                    '• To respond to your inquiries and provide customer support.',
                    '• To analyze website usage patterns and improve user experience.',
                    '• To ensure the security and integrity of our platform.',
                    '• To comply with legal obligations and enforce our terms of service.',
                ],
            },
            {
                icon: 'lock',
                title: 'Data Protection & Security',
                content: [
                    'We implement industry-standard security measures to protect your personal information, including:',
                    '• Encrypted data transmission using SSL/TLS technology.',
                    '• Secure server infrastructure with regular security audits.',
                    '• Restricted access to personal data on a need-to-know basis.',
                    '• Regular monitoring for potential vulnerabilities and threats.',
                    'While we strive to protect your data, no method of internet transmission or electronic storage is 100% secure. We encourage you to take precautions to protect your personal information.',
                ],
            },
            {
                icon: 'cookie',
                title: 'Cookie Policy',
                content: [
                    'Our website uses cookies to improve your experience. Cookies are small text files stored on your device that help us:',
                    '• **Essential Cookies:** Necessary for website functionality, such as remembering your language preference.',
                    '• **Analytics Cookies:** Help us understand how visitors interact with our website through aggregated, anonymous data.',
                    '• **Preference Cookies:** Remember your settings and preferences for future visits.',
                    'You can manage your cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.',
                ],
            },
            {
                icon: 'shield',
                title: 'Your Rights',
                content: [
                    'Depending on your location, you may have the following rights regarding your personal data:',
                    '• **Access:** Request a copy of the personal data we hold about you.',
                    '• **Correction:** Request correction of inaccurate or incomplete data.',
                    '• **Deletion:** Request deletion of your personal data, subject to legal obligations.',
                    '• **Opt-out:** Unsubscribe from marketing communications at any time.',
                    '• **Portability:** Request your data in a portable, machine-readable format.',
                    'To exercise any of these rights, please contact us using the information provided below.',
                ],
            },
            {
                icon: 'mail',
                title: 'Third-Party Services',
                content: [
                    'We may use third-party services for analytics, advertising, and other functionalities. These services may collect information about your online activity across different websites. We are not responsible for the privacy practices of third-party services.',
                    'Our website may contain links to external sites. We encourage you to review the privacy policies of any third-party sites you visit.',
                ],
            },
        ],
        changesTitle: 'Changes to This Policy',
        changesText: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.',
        contactTitle: 'Contact Us',
        contactText: 'If you have questions or concerns about this Privacy Policy, please reach out to us.',
        contactButton: 'Get in Touch',
    },
    ne: {
        heroTitle: 'गोपनीयता नीति',
        heroSubtitle: 'तपाईंको गोपनीयता हाम्रो लागि महत्त्वपूर्ण छ',
        heroDescription: 'हामी तपाईंको व्यक्तिगत जानकारी सुरक्षित राख्न र हामी कसरी तपाईंको डेटा सङ्कलन, प्रयोग र सुरक्षा गर्छौं भन्ने बारेमा पारदर्शी हुन प्रतिबद्ध छौं।',
        lastUpdated: 'अन्तिम अपडेट: फेब्रुअरी २१, २०२६',
        sections: [
            {
                icon: 'database',
                title: 'हामीले सङ्कलन गर्ने जानकारी',
                content: [
                    'जब तपाईं दि इन्टरनेसनल प्रेसमा आउनुहुन्छ, हामी निम्न प्रकारका जानकारी सङ्कलन गर्न सक्छौं:',
                    '• **व्यक्तिगत जानकारी:** नाम, इमेल ठेगाना, र अन्य विवरणहरू जुन तपाईंले हाम्रो न्युजलेटर सब्स्क्राइब गर्दा, खाता बनाउँदा, वा हामीलाई सम्पर्क गर्दा स्वेच्छाले प्रदान गर्नुहुन्छ।',
                    '• **प्रयोग डेटा:** तपाईंले हाम्रो वेबसाइटसँग कसरी अन्तरक्रिया गर्नुहुन्छ भन्ने जानकारी, भ्रमण गरिएका पृष्ठहरू, पृष्ठहरूमा बिताइएको समय, ब्राउजर प्रकार, उपकरण जानकारी, र IP ठेगाना सहित।',
                    '• **कुकीज र ट्र्याकिङ:** हामी तपाईंको ब्राउजिङ अनुभव बढाउन कुकीज र समान प्रविधिहरू प्रयोग गर्छौं।',
                ],
            },
            {
                icon: 'eye',
                title: 'हामी तपाईंको जानकारी कसरी प्रयोग गर्छौं',
                content: [
                    'हामीले सङ्कलन गरेको जानकारी निम्न उद्देश्यहरूका लागि प्रयोग गर्छौं:',
                    '• हाम्रो समाचार सेवाहरू र वेबसाइट कार्यक्षमता प्रदान, मर्मत र सुधार गर्न।',
                    '• तपाईंले सब्स्क्राइब गर्नुभएको न्युजलेटर र अपडेटहरू पठाउन।',
                    '• तपाईंको सोधपुछमा जवाफ दिन र ग्राहक सहायता प्रदान गर्न।',
                    '• वेबसाइट प्रयोग ढाँचा विश्लेषण गर्न र प्रयोगकर्ता अनुभव सुधार गर्न।',
                    '• हाम्रो प्लेटफर्मको सुरक्षा र अखण्डता सुनिश्चित गर्न।',
                ],
            },
            {
                icon: 'lock',
                title: 'डेटा सुरक्षा',
                content: [
                    'हामी तपाईंको व्यक्तिगत जानकारी सुरक्षित गर्न उद्योग-मानक सुरक्षा उपायहरू लागू गर्छौं:',
                    '• SSL/TLS प्रविधि प्रयोग गरी इन्क्रिप्टेड डेटा ट्रान्समिसन।',
                    '• नियमित सुरक्षा अडिटसहित सुरक्षित सर्भर पूर्वाधार।',
                    '• आवश्यकता-आधारित व्यक्तिगत डेटामा सीमित पहुँच।',
                    '• सम्भावित कमजोरीहरू र खतराहरूको लागि नियमित अनुगमन।',
                ],
            },
            {
                icon: 'cookie',
                title: 'कुकी नीति',
                content: [
                    'हाम्रो वेबसाइटले तपाईंको अनुभव सुधार गर्न कुकीज प्रयोग गर्दछ:',
                    '• **आवश्यक कुकीज:** वेबसाइट कार्यक्षमताको लागि आवश्यक, जस्तै तपाईंको भाषा प्राथमिकता सम्झने।',
                    '• **एनालिटिक्स कुकीज:** आगन्तुकहरू हाम्रो वेबसाइटसँग कसरी अन्तरक्रिया गर्छन् भन्ने बुझ्न मद्दत गर्दछ।',
                    '• **प्राथमिकता कुकीज:** भविष्यका भ्रमणहरूको लागि तपाईंको सेटिङ र प्राथमिकताहरू सम्झन्छ।',
                ],
            },
            {
                icon: 'shield',
                title: 'तपाईंका अधिकारहरू',
                content: [
                    'तपाईंको स्थानमा निर्भर गर्दै, तपाईंसँग निम्न अधिकारहरू हुन सक्छन्:',
                    '• **पहुँच:** हामीसँग भएको तपाईंको व्यक्तिगत डेटाको प्रतिलिपि अनुरोध गर्नुहोस्।',
                    '• **सुधार:** गलत वा अपूर्ण डेटाको सुधार अनुरोध गर्नुहोस्।',
                    '• **मेटाउने:** कानूनी दायित्वहरूको अधीनमा, तपाईंको व्यक्तिगत डेटा मेटाउन अनुरोध गर्नुहोस्।',
                    '• **अप्ट-आउट:** कुनै पनि समयमा मार्केटिङ सन्चारबाट सदस्यता रद्द गर्नुहोस्।',
                ],
            },
            {
                icon: 'mail',
                title: 'तेस्रो-पक्ष सेवाहरू',
                content: [
                    'हामी एनालिटिक्स, विज्ञापन, र अन्य कार्यक्षमताहरूका लागि तेस्रो-पक्ष सेवाहरू प्रयोग गर्न सक्छौं। यी सेवाहरूले विभिन्न वेबसाइटहरूमा तपाईंको अनलाइन गतिविधिको बारेमा जानकारी सङ्कलन गर्न सक्छन्।',
                    'हाम्रो वेबसाइटमा बाह्य साइटहरूमा लिंकहरू हुन सक्छन्। हामी तपाईंलाई भ्रमण गर्ने कुनै पनि तेस्रो-पक्ष साइटहरूको गोपनीयता नीतिहरू समीक्षा गर्न प्रोत्साहित गर्छौं।',
                ],
            },
        ],
        changesTitle: 'यस नीतिमा परिवर्तनहरू',
        changesText: 'हामी समय-समयमा यो गोपनीयता नीति अपडेट गर्न सक्छौं। कुनै पनि परिवर्तनहरू अपडेट गरिएको संशोधन मितिसहित यस पृष्ठमा पोस्ट गरिनेछ।',
        contactTitle: 'सम्पर्क गर्नुहोस्',
        contactText: 'यदि तपाईंसँग यो गोपनीयता नीतिको बारेमा प्रश्न वा चिन्ताहरू छन् भने, कृपया हामीलाई सम्पर्क गर्नुहोस्।',
        contactButton: 'सम्पर्कमा रहनुहोस्',
    },
};

const iconMap: Record<string, React.ReactNode> = {
    database: <Database className="w-6 h-6" />,
    eye: <Eye className="w-6 h-6" />,
    lock: <Lock className="w-6 h-6" />,
    cookie: <Cookie className="w-6 h-6" />,
    shield: <Shield className="w-6 h-6" />,
    mail: <Mail className="w-6 h-6" />,
};

export default async function PrivacyPage({ params }: Props) {
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
                        <Shield className="w-4 h-4" />
                        {lang === 'ne' ? 'गोपनीयता' : 'Privacy'}
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
                    <div className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/50">
                        {t.lastUpdated}
                    </div>
                </div>
            </section>

            {/* ═══════════════ POLICY SECTIONS ═══════════════ */}
            <section className="max-w-4xl mx-auto space-y-6">
                {t.sections.map((section, idx) => (
                    <div
                        key={idx}
                        className="group bg-white rounded-2xl p-8 md:p-10 border border-neutral-100 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-start gap-5">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] group-hover:scale-110 transition-transform duration-300">
                                {iconMap[section.icon]}
                            </div>
                            <div className="space-y-4 flex-1 min-w-0">
                                <h2 className="text-xl md:text-2xl font-bold text-neutral-900">
                                    {section.title}
                                </h2>
                                <div className="space-y-3">
                                    {section.content.map((paragraph, pIdx) => (
                                        <p
                                            key={pIdx}
                                            className="text-neutral-600 leading-relaxed text-sm md:text-base"
                                            dangerouslySetInnerHTML={{
                                                __html: paragraph
                                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-800 font-semibold">$1</strong>')
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ═══════════════ CHANGES NOTICE ═══════════════ */}
            <section className="max-w-4xl mx-auto">
                <div className="rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-200 p-8 md:p-10">
                    <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-3">
                        {t.changesTitle}
                    </h2>
                    <p className="text-neutral-600 leading-relaxed">
                        {t.changesText}
                    </p>
                </div>
            </section>

            {/* ═══════════════ CONTACT CTA ═══════════════ */}
            <section className="max-w-3xl mx-auto pb-8">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 text-center space-y-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">{t.contactTitle}</h2>
                    <p className="text-neutral-600 max-w-lg mx-auto">{t.contactText}</p>
                    <a
                        href={`/${lang}/contact`}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-xl"
                        style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))' }}
                    >
                        {t.contactButton}
                    </a>
                </div>
            </section>
        </div>
    );
}
