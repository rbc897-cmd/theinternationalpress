'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { insforge } from '@/lib/insforge'
import { LogOut, FileText, User, Settings, LayoutDashboard, Menu, X } from 'lucide-react'

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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    }

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Posts', href: '/admin/posts', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-[#F7F9FC]">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl md:shadow-none md:static transform transition-transform duration-300 ease-in-out border-r border-gray-100
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-bold text-xl text-blue-900 tracking-tight">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm">T</div>
                        The International Press
                    </div>
                    <button
                        className="ml-auto md:hidden text-gray-500"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 space-y-1">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Menu</p>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        )
                    })}
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Avatar"
                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                            </div>
                        )}
                        <div className="overflow-hidden">
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
                        <Link href="/" target="_blank" className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 px-3 py-1.5 rounded-full transition-colors">
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
