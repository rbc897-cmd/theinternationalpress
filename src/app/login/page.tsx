'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { insforge } from '@/lib/insforge'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { data, error } = await insforge.auth.signInWithPassword({
            email,
            password
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else if (data?.user) {
            router.push('/admin')
        } else {
            setError('Login failed. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-950)]">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-8">
                        <span className="text-4xl font-bold text-white">T</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">The International Press</h1>
                    <p className="text-primary-200 text-lg leading-relaxed">
                        Admin Portal for managing news, articles, and content for The International Press.
                    </p>
                    <div className="mt-12 flex justify-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--primary-600)] to-[var(--primary-800)] flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">T</span>
                            </div>
                            <h2 className="text-xl font-bold text-neutral-800">The International Press Admin</h2>
                        </div>

                        <div className="hidden lg:block mb-8">
                            <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome back</h2>
                            <p className="text-neutral-500">Sign in to access the admin panel</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all text-neutral-800"
                                    placeholder="admin@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all text-neutral-800"
                                    placeholder="••••••••"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
                            <Link
                                href="/en"
                                className="text-sm text-neutral-500 hover:text-[var(--primary-600)] transition-colors"
                            >
                                ← Back to Website
                            </Link>
                        </div>
                    </div>

                    <p className="text-center text-white/60 text-sm mt-8">
                        © {new Date().getFullYear()} The International Press. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
