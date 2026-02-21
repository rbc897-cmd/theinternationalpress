'use client';

import { use, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, ArrowRight } from 'lucide-react';

const content = {
    en: {
        heroTitle: 'Talk to Us',
        heroSubtitle: 'Whether you have a story that could make headlines or just have a few questions, we\'d love to hear from you.',
        heroDescription: 'We are committed to ensuring every inquiry is met with a prompt and thoughtful response. At The International Press, we deliver the kind of exceptional service that we\'d be thrilled to experience ourselves!',
        phone: 'Phone',
        phoneValue: '+1 (225) 627-5706',
        email: 'Email',
        emailValue: 'media@internationalpress.com',
        address: 'Address',
        addressValue: '620 Press Avenue\nNew York, NY 10101',
        hours: 'Business Hours',
        hoursValue: 'Monday – Friday\n9:00 AM – 5:00 PM',
        contactNote: 'Please feel free to contact us via phone, email, or through our online form for any inquiries, feedback, or support.',
        formTitle: 'Send Us a Message',
        nameLabel: 'Full Name',
        namePlaceholder: 'Your full name',
        emailLabel: 'Email Address',
        emailPlaceholder: 'you@example.com',
        subjectLabel: 'Subject',
        subjectPlaceholder: 'Select a subject',
        messageLabel: 'Message',
        messagePlaceholder: 'Write your message here...',
        sendButton: 'Send Message',
        sending: 'Sending...',
        successTitle: 'Message Sent!',
        successMessage: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
        sendAnother: 'Send Another Message',
        departmentsTitle: 'Department Contacts',
        subjects: ['General Inquiry', 'Editorial', 'Advertising', 'Media', 'Subscription', 'Feedback'],
        departments: [
            { name: 'Editorial Inquiries', email: 'editorial@internationalpress.com' },
            { name: 'Advertising Inquiries', email: 'advertising@internationalpress.com' },
            { name: 'Media Inquiries', email: 'media@internationalpress.com' },
            { name: 'Subscription Inquiries', email: 'subscription@internationalpress.com' },
        ],
    },
    ne: {
        heroTitle: 'हामीसँग कुरा गर्नुहोस्',
        heroSubtitle: 'तपाईंसँग हेडलाइन बन्न सक्ने कथा छ वा केही प्रश्नहरू छन्, हामी तपाईंबाट सुन्न चाहन्छौं।',
        heroDescription: 'हामी प्रत्येक सोधपुछलाई तुरुन्त र विचारशील प्रतिक्रियासहित पूरा गर्न प्रतिबद्ध छौं। दि इन्टरनेसनल प्रेसमा, हामी असाधारण सेवा प्रदान गर्छौं!',
        phone: 'फोन',
        phoneValue: '+1 (225) 627-5706',
        email: 'इमेल',
        emailValue: 'media@internationalpress.com',
        address: 'ठेगाना',
        addressValue: '६२० प्रेस एभिन्यु\nन्यूयोर्क, NY 10101',
        hours: 'कार्य समय',
        hoursValue: 'सोमबार – शुक्रबार\nबिहान ९:०० – साँझ ५:००',
        contactNote: 'कुनै पनि सोधपुछ, प्रतिक्रिया, वा सहयोगको लागि फोन, इमेल, वा हाम्रो अनलाइन फारम मार्फत हामीलाई सम्पर्क गर्नुहोस्।',
        formTitle: 'हामीलाई सन्देश पठाउनुहोस्',
        nameLabel: 'पूरा नाम',
        namePlaceholder: 'तपाईंको पूरा नाम',
        emailLabel: 'इमेल ठेगाना',
        emailPlaceholder: 'you@example.com',
        subjectLabel: 'विषय',
        subjectPlaceholder: 'विषय चयन गर्नुहोस्',
        messageLabel: 'सन्देश',
        messagePlaceholder: 'तपाईंको सन्देश यहाँ लेख्नुहोस्...',
        sendButton: 'सन्देश पठाउनुहोस्',
        sending: 'पठाउँदै...',
        successTitle: 'सन्देश पठाइयो!',
        successMessage: 'सम्पर्क गर्नुभएकोमा धन्यवाद। हामी २४ घण्टा भित्र जवाफ दिनेछौं।',
        sendAnother: 'अर्को सन्देश पठाउनुहोस्',
        departmentsTitle: 'विभागीय सम्पर्क',
        subjects: ['सामान्य सोधपुछ', 'सम्पादकीय', 'विज्ञापन', 'मिडिया', 'सदस्यता', 'प्रतिक्रिया'],
        departments: [
            { name: 'सम्पादकीय सोधपुछ', email: 'editorial@internationalpress.com' },
            { name: 'विज्ञापन सोधपुछ', email: 'advertising@internationalpress.com' },
            { name: 'मिडिया सोधपुछ', email: 'media@internationalpress.com' },
            { name: 'सदस्यता सोधपुछ', email: 'subscription@internationalpress.com' },
        ],
    },
};

export default function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params);
    const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const t = lang === 'ne' ? content.ne : content.en;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate sending
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    const contactCards = [
        {
            icon: <Phone className="w-6 h-6" />,
            label: t.phone,
            value: t.phoneValue,
            href: `tel:${t.phoneValue.replace(/\s|\(|\)|-/g, '')}`,
        },
        {
            icon: <Mail className="w-6 h-6" />,
            label: t.email,
            value: t.emailValue,
            href: `mailto:${t.emailValue}`,
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            label: t.address,
            value: t.addressValue,
            href: undefined,
        },
        {
            icon: <Clock className="w-6 h-6" />,
            label: t.hours,
            value: t.hoursValue,
            href: undefined,
        },
    ];

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
                        <Mail className="w-4 h-4" />
                        {lang === 'ne' ? 'सम्पर्क' : 'Contact'}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                        {t.heroTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
                        {t.heroSubtitle}
                    </p>
                    <p className="text-sm text-blue-200/70 max-w-xl mx-auto">
                        {t.heroDescription}
                    </p>
                </div>
            </section>

            {/* ═══════════════ CONTACT INFO CARDS ═══════════════ */}
            <section className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {contactCards.map((card, idx) => {
                        const CardWrapper = card.href ? 'a' : 'div';
                        return (
                            <CardWrapper
                                key={idx}
                                {...(card.href ? { href: card.href } : {})}
                                className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-xl hover:border-[var(--primary-200)] hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-50)] to-[var(--primary-100)] flex items-center justify-center text-[var(--primary-600)] mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {card.icon}
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
                                    {card.label}
                                </h3>
                                <p className="text-sm font-semibold text-neutral-800 whitespace-pre-line leading-relaxed">
                                    {card.value}
                                </p>
                                {card.href && (
                                    <ArrowRight className="absolute top-6 right-6 w-4 h-4 text-neutral-300 group-hover:text-[var(--primary-500)] group-hover:translate-x-1 transition-all duration-300" />
                                )}
                            </CardWrapper>
                        );
                    })}
                </div>
                <p className="text-center text-sm text-neutral-500 mt-6">
                    {t.contactNote}
                </p>
            </section>

            {/* ═══════════════ CONTACT FORM ═══════════════ */}
            <section className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100">
                    <div className="section-header mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
                            {t.formTitle}
                        </h2>
                    </div>

                    {isSuccess ? (
                        <div className="text-center py-12 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900">{t.successTitle}</h3>
                            <p className="text-neutral-600">{t.successMessage}</p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[var(--primary-600)] bg-[var(--primary-50)] rounded-xl hover:bg-[var(--primary-100)] transition-colors"
                            >
                                {t.sendAnother}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label htmlFor="contact-name" className="block text-sm font-semibold text-neutral-700">
                                        {t.nameLabel}
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        required
                                        value={formState.name}
                                        onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                                        placeholder={t.namePlaceholder}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label htmlFor="contact-email" className="block text-sm font-semibold text-neutral-700">
                                        {t.emailLabel}
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        required
                                        value={formState.email}
                                        onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                                        placeholder={t.emailPlaceholder}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-2">
                                <label htmlFor="contact-subject" className="block text-sm font-semibold text-neutral-700">
                                    {t.subjectLabel}
                                </label>
                                <select
                                    id="contact-subject"
                                    required
                                    value={formState.subject}
                                    onChange={e => setFormState(s => ({ ...s, subject: e.target.value }))}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                                >
                                    <option value="" disabled>{t.subjectPlaceholder}</option>
                                    {t.subjects.map((subj, i) => (
                                        <option key={i} value={subj}>{subj}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <label htmlFor="contact-message" className="block text-sm font-semibold text-neutral-700">
                                    {t.messageLabel}
                                </label>
                                <textarea
                                    id="contact-message"
                                    required
                                    rows={6}
                                    value={formState.message}
                                    onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                                    placeholder={t.messagePlaceholder}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: isSubmitting
                                        ? 'var(--primary-400)'
                                        : 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
                                }}
                                onMouseEnter={e => {
                                    if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, var(--primary-700), var(--primary-800))';
                                }}
                                onMouseLeave={e => {
                                    if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, var(--primary-600), var(--primary-700))';
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        {t.sending}
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        {t.sendButton}
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* ═══════════════ DEPARTMENT EMAILS ═══════════════ */}
            <section className="max-w-5xl mx-auto pb-8">
                <div className="section-header mb-8">
                    <h2 className="text-2xl font-bold text-neutral-900">{t.departmentsTitle}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {t.departments.map((dept, idx) => (
                        <a
                            key={idx}
                            href={`mailto:${dept.email}`}
                            className="group bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-lg hover:border-[var(--primary-200)] transition-all duration-300"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[var(--primary-50)] flex items-center justify-center mb-3 group-hover:bg-[var(--primary-100)] transition-colors">
                                <Mail className="w-5 h-5 text-[var(--primary-600)]" />
                            </div>
                            <h3 className="text-sm font-bold text-neutral-800 mb-1">{dept.name}</h3>
                            <p className="text-xs text-[var(--primary-600)] font-medium group-hover:underline">
                                {dept.email}
                            </p>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
