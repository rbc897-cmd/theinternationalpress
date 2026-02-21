import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'ne']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Server-side admin route protection
    if (pathname.startsWith('/admin')) {
        // Check for InsForge auth cookies (session token)
        const allCookies = request.cookies.getAll()
        const hasAuthCookie = allCookies.some(
            (cookie) => cookie.name.includes('auth-token') || cookie.name.includes('sb-') || cookie.name.includes('insforge')
        )
        if (!hasAuthCookie) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
        return NextResponse.next()
    }

    // Check if there is any supported locale in the pathname
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Redirect if there is no locale
    const locale = defaultLocale
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(request.nextUrl)
}

export const config = {
    matcher: [
        // Skip all internal paths (_next) and login page
        '/((?!api|_next/static|_next/image|favicon.ico|icon|images|login).*)',
    ],
}
