'use client'

import { useState, useEffect } from 'react'
import { insforge } from '@/lib/insforge'
import { Check, AlertCircle, ShieldCheck, Mail, Lock } from 'lucide-react'

export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [retypePassword, setRetypePassword] = useState('')
    const [verificationCode, setVerificationCode] = useState('')

    const [step, setStep] = useState<1 | 2>(1)
    const [loading, setLoading] = useState(false)
    const [userEmail, setUserEmail] = useState<string | null>(null)

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await insforge.auth.getCurrentSession()
            if (session?.user?.email) {
                setUserEmail(session.user.email)
            }
        }
        fetchUser()
    }, [])

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userEmail) return

        if (!currentPassword || !newPassword || !retypePassword) {
            setMessage({ type: 'error', text: 'Please fill in all fields' })
            return
        }

        if (newPassword !== retypePassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            return
        }

        setLoading(true)
        setMessage(null)

        // 1. Verify current password
        const { error: signInError } = await insforge.auth.signInWithPassword({
            email: userEmail,
            password: currentPassword
        })

        if (signInError) {
            setMessage({ type: 'error', text: 'Wrong current password' })
            setLoading(false)
            return
        }

        // 2. Send verification code
        const { error: resetError } = await insforge.auth.sendResetPasswordEmail({
            email: userEmail
        })

        if (resetError) {
            setMessage({ type: 'error', text: 'Failed to send verification code. Please try again.' })
        } else {
            setMessage({ type: 'success', text: 'Verification code sent to your email.' })
            setStep(2)
        }
        setLoading(false)
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!userEmail) return

        if (!verificationCode) {
            setMessage({ type: 'error', text: 'Please enter the verification code' })
            return
        }

        setLoading(true)
        setMessage(null)

        // 1. Exchange code for reset token
        const { data: exchangeData, error: exchangeError } = await insforge.auth.exchangeResetPasswordToken({
            email: userEmail,
            code: verificationCode
        })

        if (exchangeError || !exchangeData?.token) {
            setMessage({ type: 'error', text: 'Invalid verification code' })
            setLoading(false)
            return
        }

        // 2. Reset password
        const { error: updateError } = await insforge.auth.resetPassword({
            newPassword: newPassword,
            otp: exchangeData.token
        })

        if (updateError) {
            setMessage({ type: 'error', text: 'Failed to update password' })
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully' })
            // Reset form
            setCurrentPassword('')
            setNewPassword('')
            setRetypePassword('')
            setVerificationCode('')
            setStep(1)
        }
        setLoading(false)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Security</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your password and security settings</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                        <ShieldCheck size={20} />
                    </div>
                    <h2 className="font-bold text-gray-700">Change Password</h2>
                </div>

                <div className="p-6">
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg text-sm font-medium flex gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'
                            }`}>
                            {message.type === 'error' ? (
                                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                            ) : (
                                <Check size={18} className="flex-shrink-0 mt-0.5" />
                            )}
                            <p>{message.text}</p>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendCode} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Current Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none transition-all text-sm"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none transition-all text-sm"
                                        placeholder="Enter new password"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Retype New Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        value={retypePassword}
                                        onChange={(e) => setRetypePassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none transition-all text-sm"
                                        placeholder="Retype new password"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-4 flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition font-medium text-sm shadow-sm hover:shadow disabled:opacity-50"
                            >
                                {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>}
                                {!loading && <Mail size={16} />}
                                Send Verification Code
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Verification Code</label>
                                <p className="text-xs text-gray-500 mb-2">Please enter the 6-digit code sent to your email.</p>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    maxLength={6}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none transition-all text-sm text-center tracking-[0.5em] font-mono text-lg"
                                    placeholder="••••••"
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition font-medium text-sm shadow-sm hover:shadow disabled:opacity-50"
                                >
                                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>}
                                    Update Password
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
