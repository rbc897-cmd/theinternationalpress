'use client'

import { useEffect, useState } from 'react'
import { insforge } from '@/lib/insforge'
import { Save, User, Mail, ShieldCheck } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { showToast } from '@/components/Toast'

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<{ id: string, full_name: string, avatar_url: string } | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)

    const fetchProfile = async () => {
        setProfileLoading(true)
        const { data: { session } } = await insforge.auth.getCurrentSession()

        if (session?.user) {
            setUserEmail(session.user.email || null)
            const { data } = await insforge.database
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (data) {
                setProfile(data)
            } else {
                // Since the backfill script was run, this shouldn't happen for old users,
                // but if a user signs up after backfill without the trigger, create it on-demand for safety.
                const newProfile = { id: session.user.id, full_name: session.user.profile?.name || '', avatar_url: '' }
                await insforge.database.from('profiles').insert([newProfile])
                setProfile(newProfile)
            }
        }
        setProfileLoading(false)
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleProfileUpdate = async () => {
        if (!profile) return

        // Update the profiles table
        const { error: dbError } = await insforge.database
            .from('profiles')
            .update({
                full_name: profile.full_name,
                avatar_url: profile.avatar_url
            })
            .eq('id', profile.id)

        // Also update auth user profile (used by auth session)
        const { error: authError } = await insforge.auth.setProfile({
            name: profile.full_name,
            avatar_url: profile.avatar_url
        })

        if (dbError || authError) {
            console.error('Profile update error:', dbError || authError)
            showToast('error', 'Update Failed', 'Could not update profile. Please try again.')
        } else {
            showToast('success', 'Profile Updated', 'Your changes have been saved successfully.')
            // Reload to refresh the sidebar with new profile data
            setTimeout(() => window.location.reload(), 1500)
        }
    }

    if (profileLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
    )

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your public profile information</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden max-w-2xl">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                    <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                        <User size={20} />
                    </div>
                    <h2 className="font-bold text-gray-700">Profile Details</h2>
                </div>

                {profile && (
                    <div className="p-6 space-y-6">
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <ImageUploader
                                    value={profile.avatar_url || ''}
                                    onChange={(url) => setProfile({ ...profile, avatar_url: url })}
                                    variant="avatar"
                                />
                            </div>
                            <p className="text-xs text-center text-gray-400">Click avatar to upload new photo</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={userEmail || ''}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none text-sm"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Your email address cannot be changed right now.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={16} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={profile.full_name || ''}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-200 outline-none transition-all text-sm"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleProfileUpdate}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition font-medium text-sm shadow-sm hover:shadow"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
