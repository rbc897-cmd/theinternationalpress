'use client'

import { usePathname, useRouter } from 'next/navigation'

export default function LanguageToggle({ lang }: { lang: string }) {
    const pathname = usePathname()
    const router = useRouter()

    const switchLanguage = (newLang: string) => {
        if (!pathname) return
        const segments = pathname.split('/')
        // Ensure we handle cases where path might not have locale correctly (though middleware enforces)
        // segments[0] is empty, segments[1] is locale
        if (segments.length > 1) {
            segments[1] = newLang
            const newPath = segments.join('/')
            router.push(newPath)
        } else {
            // Safe fallback
            router.push(`/${newLang}`)
        }
    }

    return (
        <div className="flex items-center space-x-2 text-sm">
            <button
                onClick={() => switchLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${lang === 'en'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                aria-label="Switch to English"
            >
                EN
            </button>
            <span className="text-gray-300">|</span>
            <button
                onClick={() => switchLanguage('ne')}
                className={`px-2 py-1 rounded transition-colors ${lang === 'ne'
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                aria-label="Switch to Nepali"
            >
                NE
            </button>
        </div>
    )
}
