'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import LanguageToggle from './LanguageToggle'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NavItem = {
    en: string
    ne: string
    href: string
    children?: NavItem[]
}

const navItems: NavItem[] = [
    { en: 'Home', ne: 'गृहपृष्ठ', href: '/' },
    {
        en: 'Nepal', ne: 'नेपाल', href: '/nepal',
        children: [
            { en: 'Politics', ne: 'राजनीति', href: '/nepal/politics' },
            { en: 'Economy', ne: 'अर्थतन्त्र', href: '/nepal/economy' },
            { en: 'Opinion', ne: 'विचार', href: '/nepal/opinion' },
            { en: 'Technology', ne: 'प्रविधि', href: '/nepal/technology' },
            { en: 'Lifestyle', ne: 'जीवनशैली', href: '/nepal/lifestyle' },
        ]
    },
    {
        en: 'World', ne: 'विश्व', href: '/world',
        children: [
            { en: 'Asia', ne: 'एशिया', href: '/world/asia' },
            { en: 'Europe', ne: 'युरोप', href: '/world/europe' },
            { en: 'Americas', ne: 'अमेरिका', href: '/world/americas' },
            { en: 'Middle East', ne: 'मध्यपूर्व', href: '/world/middle-east' },
            { en: 'Africa', ne: 'अफ्रिका', href: '/world/africa' },
            { en: 'Global Institutions', ne: 'विश्व संस्था', href: '/world/global-institutions' },
        ]
    },
    { en: 'Politics', ne: 'राजनीति', href: '/politics' },
    { en: 'Economy', ne: 'अर्थतन्त्र', href: '/economy' },
    { en: 'Business', ne: 'व्यवसाय', href: '/business' },
    { en: 'Climate', ne: 'जलवायु', href: '/climate' },
    { en: 'Science', ne: 'विज्ञान', href: '/science' },
    { en: 'Opinion', ne: 'विचार', href: '/opinion' },
    {
        en: 'Media', ne: 'मिडिया', href: '/media',
        children: [
            { en: 'Watch', ne: 'हेर्नुहोस्', href: '/media/watch' },
            { en: 'Listen', ne: 'सुन्नुहोस्', href: '/media/listen' },
        ]
    },
]

export default function Navbar({ lang }: { lang: string }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const dict = {
        en: {
            home: 'Home',
            about: 'About',
            contact: 'Contact',
            searchPlaceholder: 'Search news...'
        },
        ne: {
            home: 'गृहपृष्ठ',
            about: 'हाम्रो बारेमा',
            contact: 'सम्पर्क',
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

    const getLabel = (item: NavItem) => lang === 'ne' ? item.ne : item.en

    const renderDesktopItem = (item: NavItem) => {
        // Home link — simple
        if (item.href === '/') {
            return (
                <Link
                    key={item.en}
                    href={`/${lang}`}
                    className="text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors"
                >
                    {getLabel(item)}
                </Link>
            )
        }

        // Items with dropdowns
        if (item.children && item.children.length > 0) {
            return (
                <div
                    key={item.en}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.en)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <button className="flex items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors py-6">
                        {getLabel(item)}
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.en ? 'rotate-180' : ''}`} />
                    </button>

                    {activeDropdown === item.en && (
                        <div className="absolute top-full left-0 bg-white/95 backdrop-blur-md border border-neutral-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 w-56 rounded-b-xl border-t-0 mt-1">
                            {/* Parent category link */}
                            <Link
                                href={`/${lang}${item.href}`}
                                className="block px-4 py-2.5 text-sm font-semibold text-[var(--primary-700)] hover:bg-[var(--primary-50)] transition-colors border-b border-neutral-100 mb-1"
                            >
                                {lang === 'ne' ? `सबै ${getLabel(item)}` : `All ${getLabel(item)}`}
                            </Link>
                            {item.children.map((child) => (
                                <Link
                                    key={child.en}
                                    href={`/${lang}${child.href}`}
                                    className="block px-4 py-2.5 text-sm text-neutral-700 hover:text-[var(--primary-700)] hover:bg-[var(--primary-50)] transition-all"
                                >
                                    {getLabel(child)}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        // Plain link (no dropdown)
        return (
            <Link
                key={item.en}
                href={`/${lang}${item.href}`}
                className="text-sm font-semibold text-neutral-700 hover:text-[var(--primary-600)] transition-colors"
            >
                {getLabel(item)}
            </Link>
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
                            <svg viewBox="0 0 180 55" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="0" width="40" height="40" rx="3" fill="#171717" />
                                <rect x="45" y="0" width="40" height="40" rx="3" fill="#171717" />
                                <rect x="90" y="0" width="40" height="40" rx="3" fill="#171717" />
                                <text x="20" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">T</text>
                                <text x="65" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">I</text>
                                <text x="110" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">P</text>
                                <text x="0" y="53" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1" fill="#171717">THE INTERNATIONAL PRESS</text>
                            </svg>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden xl:flex items-center gap-6">
                            {navItems.map((item) => renderDesktopItem(item))}
                        </nav>

                        {/* Right Section */}
                        <div className="flex items-center gap-2">
                            {/* Search Bar */}
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
                        <div className="container mx-auto px-4 py-6 space-y-1">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="px-2 mb-4">
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

                            {navItems.map((item) => {
                                if (item.href === '/') {
                                    return (
                                        <Link
                                            key={item.en}
                                            href={`/${lang}`}
                                            className="block text-base font-bold text-neutral-800 px-3 py-3 rounded-lg hover:bg-neutral-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {getLabel(item)}
                                        </Link>
                                    )
                                }

                                if (item.children && item.children.length > 0) {
                                    const isExpanded = mobileExpanded === item.en
                                    return (
                                        <div key={item.en} className="border-b border-neutral-50">
                                            <button
                                                className="flex items-center justify-between w-full text-base font-bold text-neutral-800 px-3 py-3 rounded-lg hover:bg-neutral-50"
                                                onClick={() => setMobileExpanded(isExpanded ? null : item.en)}
                                            >
                                                {getLabel(item)}
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                            {isExpanded && (
                                                <div className="pl-4 pb-2 space-y-1">
                                                    <Link
                                                        href={`/${lang}${item.href}`}
                                                        className="block text-sm font-semibold text-[var(--primary-600)] px-3 py-2 rounded-lg hover:bg-[var(--primary-50)]"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {lang === 'ne' ? `सबै ${getLabel(item)}` : `All ${getLabel(item)}`}
                                                    </Link>
                                                    {item.children.map((child) => (
                                                        <Link
                                                            key={child.en}
                                                            href={`/${lang}${child.href}`}
                                                            className="block text-sm text-neutral-600 px-3 py-2 rounded-lg hover:bg-neutral-50"
                                                            onClick={() => setMobileMenuOpen(false)}
                                                        >
                                                            {getLabel(child)}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }

                                return (
                                    <Link
                                        key={item.en}
                                        href={`/${lang}${item.href}`}
                                        className="block text-base font-bold text-neutral-800 px-3 py-3 rounded-lg hover:bg-neutral-50"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {getLabel(item)}
                                    </Link>
                                )
                            })}

                            <div className="pt-4 border-t border-neutral-100 space-y-1 mt-2">
                                <Link
                                    href={`/${lang}/about`}
                                    className="block text-neutral-700 font-medium px-3 py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t.about}
                                </Link>
                                <Link
                                    href={`/${lang}/contact`}
                                    className="block text-neutral-700 font-medium px-3 py-2"
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
