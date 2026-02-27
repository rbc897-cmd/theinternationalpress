'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { insforge } from '@/lib/insforge'
import Link from 'next/link'
import Image from 'next/image'
import { AlertCircle, Check } from 'lucide-react'

type AuthStep = 'login' | 'forgot-1' | 'forgot-2'

export default function LoginPage() {
    const [step, setStep] = useState<AuthStep>('login')

    // Login State
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // Forgot Password State
    const [resetEmail, setResetEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [retypePassword, setRetypePassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const router = useRouter()

    const handleLoginSubmit = async (e: React.FormEvent) => {
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

    const handleSendResetCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!resetEmail) return

        setLoading(true)
        setError('')
        setSuccessMsg('')

        const { error: resetError } = await insforge.auth.sendResetPasswordEmail({
            email: resetEmail
        })

        if (resetError) {
            setError('Failed to send verification code. Please try again.')
        } else {
            setSuccessMsg('Verification code sent to your email.')
            setStep('forgot-2')
        }
        setLoading(false)
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!verificationCode || !newPassword || !retypePassword) return

        if (newPassword !== retypePassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')
        setSuccessMsg('')

        // 1. Exchange code for reset token
        const { data: exchangeData, error: exchangeError } = await insforge.auth.exchangeResetPasswordToken({
            email: resetEmail,
            code: verificationCode
        })

        if (exchangeError || !exchangeData?.token) {
            setError('Invalid verification code')
            setLoading(false)
            return
        }

        // 2. Reset password
        const { error: updateError } = await insforge.auth.resetPassword({
            newPassword: newPassword,
            otp: exchangeData.token
        })

        if (updateError) {
            setError('Failed to update password')
        } else {
            setSuccessMsg('Password updated successfully. You can now log in.')
            setStep('login')
            setResetEmail('')
            setVerificationCode('')
            setNewPassword('')
            setRetypePassword('')
            setPassword('') // Clear old password just in case
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[var(--primary-900)] via-[var(--primary-800)] to-[var(--primary-950)]">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
                <div className="text-center text-white max-w-md">
                    <div className="flex justify-center mb-8">
                        <svg viewBox="0 0 180 55" className="h-16 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="40" height="40" rx="3" fill="white" />
                            <rect x="45" y="0" width="40" height="40" rx="3" fill="white" />
                            <rect x="90" y="0" width="40" height="40" rx="3" fill="white" />
                            <text x="20" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="#171717">T</text>
                            <text x="65" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="#171717">I</text>
                            <text x="110" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="#171717">P</text>
                            <text x="0" y="53" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1" fill="white">THE INTERNATIONAL PRESS</text>
                        </svg>
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
                            <div className="flex justify-center mb-6">
                                <svg viewBox="0 0 180 55" className="h-12 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0" y="0" width="40" height="40" rx="3" fill="#171717" />
                                    <rect x="45" y="0" width="40" height="40" rx="3" fill="#171717" />
                                    <rect x="90" y="0" width="40" height="40" rx="3" fill="#171717" />
                                    <text x="20" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">T</text>
                                    <text x="65" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">I</text>
                                    <text x="110" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">P</text>
                                    <text x="0" y="53" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1" fill="#171717">THE INTERNATIONAL PRESS</text>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-neutral-800">The International Press Admin</h2>
                        </div>

                        {step === 'login' && (
                            <div className="hidden lg:block mb-8">
                                <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome back</h2>
                                <p className="text-neutral-500">Sign in to access the admin panel</p>
                            </div>
                        )}

                        {step === 'forgot-1' && (
                            <div className="mb-8 hidden lg:block">
                                <h2 className="text-2xl font-bold text-neutral-800 mb-2">Forgot Password</h2>
                                <p className="text-neutral-500">Enter your email to receive a reset code</p>
                            </div>
                        )}

                        {step === 'forgot-2' && (
                            <div className="mb-8 hidden lg:block">
                                <h2 className="text-2xl font-bold text-neutral-800 mb-2">Reset Password</h2>
                                <p className="text-neutral-500">Enter the verification code and your new password</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                <Check size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-green-700 text-sm font-medium">{successMsg}</p>
                            </div>
                        )}

                        {step === 'login' && (
                            <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-neutral-700">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => { setStep('forgot-1'); setError(''); setSuccessMsg(''); }}
                                            className="text-sm text-[var(--primary-600)] hover:text-[var(--primary-700)] font-medium"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
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
                        )}

                        {step === 'forgot-1' && (
                            <form onSubmit={handleSendResetCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all text-neutral-800"
                                        placeholder="admin@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                                    Send Code
                                </button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setStep('login'); setError(''); setSuccessMsg(''); }}
                                        className="text-sm text-neutral-500 hover:text-[var(--primary-600)] font-medium"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 'forgot-2' && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        required
                                        maxLength={6}
                                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all tracking-[0.25em] font-mono text-center text-lg"
                                        placeholder="••••••"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all"
                                        placeholder="Enter new password"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                        Retype New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={retypePassword}
                                        onChange={(e) => setRetypePassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[var(--primary-500)] focus:ring-2 focus:ring-[var(--primary-100)] outline-none transition-all"
                                        placeholder="Retype new password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                                >
                                    {loading && <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                                    Reset Password
                                </button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setStep('login'); setError(''); setSuccessMsg(''); }}
                                        className="text-sm text-neutral-500 hover:text-[var(--primary-600)] font-medium"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        )}

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

