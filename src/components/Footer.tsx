import Link from 'next/link'

const categories = [
    { en: 'Nepal', ne: 'नेपाल', href: '/category/nepal' },
    { en: 'World', ne: 'विश्व', href: '/category/world' },
    { en: 'Politics', ne: 'राजनीति', href: '/category/politics' },
    { en: 'Business', ne: 'व्यापार', href: '/category/business' },
    { en: 'Tech', ne: 'प्रविधि', href: '/category/tech' },
    { en: 'Science', ne: 'विज्ञान', href: '/category/science' },
    { en: 'Sports', ne: 'खेलकुद', href: '/category/sports' },
    { en: 'Style', ne: 'शैली', href: '/category/style' },
    { en: 'Entertainment', ne: 'मनोरञ्जन', href: '/category/entertainment' },
    { en: 'Climate', ne: 'जलवायु', href: '/category/climate' },
    { en: 'Travel', ne: 'यात्रा', href: '/category/travel' },
]

const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com', icon: '📘' },
    { name: 'Twitter', href: 'https://twitter.com', icon: '🐦' },
    { name: 'Instagram', href: 'https://instagram.com', icon: '📸' },
    { name: 'YouTube', href: 'https://youtube.com', icon: '📺' },
]

export default function Footer({ lang }: { lang: string }) {
    const currentYear = new Date().getFullYear()

    const dict = {
        en: {
            about: 'About Us',
            privacy: 'Privacy Policy',
            contact: 'Contact',
            rights: 'All rights reserved.',
            categories: 'Categories',
            company: 'Company',
            social: 'Follow Us',
            tagline: 'Your trusted source for international news.',
        },
        ne: {
            about: 'हाम्रो बारेमा',
            privacy: 'गोपनीयता नीति',
            contact: 'सम्पर्क',
            rights: 'सर्वाधिकार सुरक्षित।',
            categories: 'श्रेणीहरू',
            company: 'कम्पनी',
            social: 'हामीलाई फलो गर्नुहोस्',
            tagline: 'अन्तर्राष्ट्रिय समाचारको तपाईंको विश्वसनीय स्रोत।',
        }
    }

    const t = lang === 'ne' ? dict.ne : dict.en

    return (
        <footer className="bg-[var(--neutral-900)] text-white mt-auto">
            {/* Top border accent */}
            <div className="h-1 bg-gradient-to-r from-[var(--primary-500)] via-[var(--primary-600)] to-[var(--primary-700)]" />

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <Link href={`/${lang}`} className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-bold">
                                {lang === 'ne' ? 'दि इन्टरनेसनल प्रेस' : 'The International Press'}
                            </span>
                        </Link>
                        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                            {t.tagline}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-[var(--primary-600)] flex items-center justify-center transition-colors"
                                    aria-label={social.name}
                                >
                                    <span>{social.icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">
                            {t.categories}
                        </h4>
                        <ul className="space-y-3">
                            {categories.map((cat) => (
                                <li key={cat.en}>
                                    <Link
                                        href={`/${lang}${cat.href}`}
                                        className="text-neutral-400 hover:text-white hover:pl-1 transition-all text-sm"
                                    >
                                        {lang === 'ne' ? cat.ne : cat.en}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">
                            {t.company}
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href={`/${lang}/about`} className="text-neutral-400 hover:text-white hover:pl-1 transition-all text-sm">
                                    {t.about}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/contact`} className="text-neutral-400 hover:text-white hover:pl-1 transition-all text-sm">
                                    {t.contact}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/privacy`} className="text-neutral-400 hover:text-white hover:pl-1 transition-all text-sm">
                                    {t.privacy}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">
                            {lang === 'ne' ? 'अपडेट पाउनुहोस्' : 'Stay Updated'}
                        </h4>
                        <p className="text-neutral-400 text-sm mb-4">
                            {lang === 'ne'
                                ? 'नवीनतम समाचार सिधै इमेलमा।'
                                : 'Get latest news directly to your inbox.'}
                        </p>
                        <form className="flex flex-col gap-2">
                            <input
                                id="footer-newsletter-email"
                                name="email"
                                type="email"
                                placeholder={lang === 'ne' ? 'इमेल ठेगाना' : 'Email address'}
                                className="px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] text-sm"
                            />
                            <button type="submit" className="btn-primary text-sm py-2.5">
                                {lang === 'ne' ? 'सब्सक्राइब' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
                    <p>&copy; {currentYear} The International Press. {t.rights}</p>
                </div>
            </div>
        </footer>
    )
}
