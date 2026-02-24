'use client'

import Link from 'next/link'
import { useState } from 'react'
import LanguageToggle from './LanguageToggle'
import { Menu, X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = [
    // News Group
    { en: 'Nepal', ne: 'नेपाल', href: '/category/nepal', group: 'news' },
    { en: 'World', ne: 'विश्व', href: '/category/world', group: 'news' },
    { en: 'Politics', ne: 'राजनीति', href: '/category/politics', group: 'news' },
    { en: 'Business', ne: 'व्यापार', href: '/category/business', group: 'news' },
    { en: 'Markets', ne: 'बजार', href: '/category/markets', group: 'news' },
    { en: 'Health', ne: 'स्वास्थ्य', href: '/category/health', group: 'news' },
    { en: 'Tech', ne: 'प्रविधि', href: '/category/tech', group: 'news' },
    { en: 'Entertainment', ne: 'मनोरञ्जन', href: '/category/entertainment', group: 'news' },
    { en: 'Style', ne: 'शैली', href: '/category/style', group: 'news' },
    { en: 'Travel', ne: 'यात्रा', href: '/category/travel', group: 'news' },
    { en: 'Sports', ne: 'खेलकुद', href: '/category/sports', group: 'news' },
    { en: 'Science', ne: 'विज्ञान', href: '/category/science', group: 'news' },
    { en: 'Climate', ne: 'जलवायु', href: '/category/climate', group: 'news' },

    // Media Group (Kept as separate group but maybe merged into dropdown later if needed, user only asked to remove Visa Info)
    { en: 'Watch', ne: 'हेर्नुहोस्', href: '/watch', group: 'media' },
    { en: 'Listen', ne: 'सुन्नुहोस्', href: '/listen', group: 'media' },
]

export default function Navbar({ lang }: { lang: string }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const dict = {
        en: {
            home: 'Home',
            news: 'News',
            media: 'Media',
            about: 'About',
            contact: 'Contact',
            categories: 'Categories',
            searchPlaceholder: 'Search news...'
        },
        ne: {
            home: 'गृहपृष्ठ',
            news: 'समाचार',
            media: 'मिडिया',
            about: 'हाम्रो बारेमा',
            contact: 'सम्पर्क',
            categories: 'श्रेणीहरू',
            searchPlaceholder: 'समाचार खोज्नुहोस्...'
        }
    }

    const t = lang === 'ne' ? dict.ne : dict.en

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/${lang}/search?q=${encodeURIComponent(searchQuery)}`)
            setIsSearchOpen(false)
            setSearchQuery('')
        }
    }

    const renderDropdown = (groupName: string, label: string) => {
        const items = categories.filter(cat => cat.group === groupName)
        // Check if this is the "news" group to apply specific styling
        const isNewsGroup = groupName === 'news'

        return (
            <div
                className="relative group"
                onMouseEnter={() => setActiveDropdown(groupName)}
                onMouseLeave={() => setActiveDropdown(null)}
            >
                <button className="flex items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors py-6">
                    {label}
                    <svg className={`w-4 h-4 transition-transform ${activeDropdown === groupName ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {activeDropdown === groupName && (
                    <div
                        className={`absolute top-full border-t bg-white/95 backdrop-blur-md border border-neutral-100 shadow-xl py-6 z-50 animate-in fade-in slide-in-from-top-2 ${isNewsGroup
                            ? 'left-1/2 -translate-x-1/2 w-[800px] rounded-b-xl border-t-0 mt-1'
                            : 'left-0 w-48 rounded-b-xl border-t-0'
                            }`}
                    >
                        <div className={`${isNewsGroup ? 'px-6' : ''}`}>
                            <div className={`grid ${isNewsGroup ? 'grid-cols-4 gap-4' : 'grid-cols-1 gap-1'}`}>
                                {items.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={`/${lang}${item.href}`}
                                        className={`
                                            ${isNewsGroup
                                                ? 'px-4 py-3 rounded-xl hover:bg-[var(--primary-50)] group/item border border-transparent hover:border-[var(--primary-100)]'
                                                : 'px-4 py-2 hover:bg-[var(--primary-50)]'
                                            }
                                            text-sm text-neutral-700 hover:text-[var(--primary-700)] transition-all flex items-center gap-3
                                        `}
                                    >
                                        <span className="font-medium">{lang === 'ne' ? item.ne : item.en}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <header className="sticky top-0 z-50 w-full">


            {/* Main Navigation */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm relative z-40">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href={`/${lang}`} className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center shadow-lg shadow-blue-900/20">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold tracking-tight text-[var(--primary-900)]">
                                    {lang === 'ne' ? 'दि इन्टरनेसनल प्रेस' : 'The International Press'}
                                </span>
                                <span className="block text-xs text-neutral-500 -mt-1">
                                    {lang === 'ne' ? 'समाचार पोर्टल' : 'News Portal'}
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center gap-8">
                            <Link
                                href={`/${lang}`}
                                className="text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors"
                            >
                                {t.home}
                            </Link>

                            {renderDropdown('news', t.news)}
                            {renderDropdown('media', t.media)}

                            <Link
                                href={`/${lang}/about`}
                                className="text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors"
                            >
                                {t.about}
                            </Link>
                            <Link
                                href={`/${lang}/contact`}
                                className="text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors"
                            >
                                {t.contact}
                            </Link>
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            {/* Search Bar - hidden on mobile since mobile menu has its own search */}
                            <div className="relative hidden xl:flex items-center">
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
                                    aria-label="Search"
                                >
                                    <Search size={20} />
                                </button>

                                {isSearchOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-neutral-100 p-2 animate-in fade-in slide-in-from-top-2">
                                        <form onSubmit={handleSearch}>
                                            <input
                                                id="desktop-search"
                                                name="search"
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder={t.searchPlaceholder}
                                                className="w-full px-4 py-2 bg-neutral-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                                autoFocus
                                            />
                                        </form>
                                    </div>
                                )}
                            </div>

                            <div className="h-6 w-px bg-neutral-200 mx-2"></div>

                            <LanguageToggle lang={lang} />

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="xl:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg ml-2"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="xl:hidden bg-white border-t border-neutral-100 max-h-[80vh] overflow-y-auto">
                        <div className="container mx-auto px-4 py-6 space-y-6">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="px-4">
                                <div className="relative">
                                    <input
                                        id="mobile-search"
                                        name="search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t.searchPlaceholder}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)]"
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                </div>
                            </form>

                            <Link
                                href={`/${lang}`}
                                className="block text-lg font-bold text-neutral-800 px-4"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t.home}
                            </Link>

                            {/* Groups in Mobile Menu - Removed info group */}
                            {[
                                { id: 'news', label: t.news },
                                { id: 'media', label: t.media }
                            ].map(group => (
                                <div key={group.id} className="space-y-3 px-4">
                                    <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest">
                                        {group.label}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.filter(c => c.group === group.id).map((item, idx) => (
                                            <Link
                                                key={idx}
                                                href={`/${lang}${item.href}`}
                                                className="text-sm text-neutral-600 py-1"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {lang === 'ne' ? item.ne : item.en}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-neutral-100 space-y-4 px-4">
                                <Link
                                    href={`/${lang}/about`}
                                    className="block text-neutral-700 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.about}
                                </Link>
                                <Link
                                    href={`/${lang}/contact`}
                                    className="block text-neutral-700 font-medium"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.contact}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}
