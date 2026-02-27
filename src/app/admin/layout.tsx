'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { insforge } from '@/lib/insforge'
import Image from 'next/image'
import { LogOut, FileText, User, Settings, LayoutDashboard, Menu, X } from 'lucide-react'
import ToastProvider from '@/components/Toast'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await insforge.auth.getCurrentUser()
            if (!user) {
                router.push('/login')
            } else {
                setUser(user)
                const { data: profileData } = await insforge.database
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                if (profileData) {
                    setProfile(profileData)
                }
                setLoading(false)
            }
        }
        checkAuth()
    }, [router])

    const handleSignOut = async () => {
        await insforge.auth.signOut()
        router.push('/login')
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Posts', href: '/admin/posts', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-[#F7F9FC]">
            <ToastProvider />
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl md:shadow-none md:static transform transition-transform duration-300 ease-in-out border-r border-gray-100 flex flex-col
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-24 flex-shrink-0 flex items-center justify-center border-b border-gray-100 bg-white">
                    <div className="flex items-center justify-center w-full h-full p-4">
                        <Link href="/admin" className="block focus:outline-none">
                            <svg viewBox="0 0 190 55" className="h-10 w-auto hover:opacity-90 transition-opacity" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="0" width="40" height="40" rx="3" fill="#171717" />
                                <rect x="50" y="0" width="40" height="40" rx="3" fill="#171717" />
                                <rect x="95" y="0" width="40" height="40" rx="3" fill="#171717" />
                                <text x="25" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">T</text>
                                <text x="70" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">I</text>
                                <text x="115" y="28" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight="900" fontSize="24" fill="white">P</text>
                                <text x="5" y="53" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1" fill="#171717">THE INTERNATIONAL PRESS</text>
                            </svg>
                        </Link>
                    </div>
                    <button
                        className="ml-auto md:hidden text-gray-500 absolute pr-4 right-0"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gray-800 text-white shadow-md shadow-gray-300'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-800'} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>

                <div className="flex-shrink-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold flex-shrink-0">
                                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div className="overflow-hidden min-w-0">
                            <p className="text-sm font-semibold text-gray-700 truncate">{profile?.full_name || 'Admin'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium border border-transparent hover:border-red-100"
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-gray-500 hover:text-gray-700"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" target="_blank" className="text-sm text-gray-700 hover:text-gray-900 font-medium bg-gray-100 px-3 py-1.5 rounded-full transition-colors">
                            View Site
                        </Link>
                    </div>
                </header>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto p-6 md:p-8 bg-[#F7F9FC]">
                    {children}
                </div>
            </main>
        </div>
    )
}
