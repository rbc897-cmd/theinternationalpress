'use client'

import { useEffect, useState } from 'react'
import { insforge } from '@/lib/insforge'
import Link from 'next/link'
import DashboardStats from '@/components/DashboardStats'
import { FileText, CheckCircle, Clock, Eye, TrendingUp, Plus } from 'lucide-react'
import { Post } from '@/utils/types'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalPosts: 0,
        publishedPosts: 0,
        draftPosts: 0
    })
    const [recentPosts, setRecentPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            // Get stats
            const { count: total } = await insforge.database
                .from('posts')
                .select('*', { count: 'exact', head: true })

            const { count: published } = await insforge.database
                .from('posts')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'published')

            setStats({
                totalPosts: total || 0,
                publishedPosts: published || 0,
                draftPosts: (total || 0) - (published || 0)
            })

            // Get recent posts
            const { data: recent } = await insforge.database
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5)

            if (recent) setRecentPosts(recent)
            setLoading(false)
        }

        fetchDashboardData()
    }, [])

    if (loading) return <div className="text-center p-8 text-gray-500">Loading dashboard...</div>

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Overview</h2>
                <Link href="/admin/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus size={18} />
                    New Article
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/admin/posts">
                    <DashboardStats
                        title="Total Articles"
                        value={stats.totalPosts}
                        icon={FileText}
                        color="blue"
                        trend="+12%"
                        trendUp={true}
                    />
                </Link>
                <Link href="/admin/posts?status=published">
                    <DashboardStats
                        title="Published"
                        value={stats.publishedPosts}
                        icon={CheckCircle}
                        color="green"
                        trend="+5%"
                        trendUp={true}
                    />
                </Link>
                <Link href="/admin/posts?status=draft">
                    <DashboardStats
                        title="Drafts"
                        value={stats.draftPosts}
                        icon={Clock}
                        color="yellow"
                        trend="-2%"
                        trendUp={false}
                    />
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Posts Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Recent Articles</h3>
                        <Link href="/admin/posts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 font-semibold tracking-wider">Title</th>
                                    <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
                                    <th className="px-6 py-3 font-semibold tracking-wider text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPosts.map(post => (
                                    <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/posts/${post.id}`} className="block">
                                                <p className="font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{post.title_en || 'Untitled'}</p>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{post.excerpt_en || 'No excerpt'}</p>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {post.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {recentPosts.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                            No recent posts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popularity / Quick Stats (Placeholder) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800">Quick Actions</h3>
                    </div>
                    <div className="p-6 flex-1 space-y-4">
                        <Link href="/admin/posts/new" className="block p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-all group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="font-semibold text-gray-700">Write New Article</span>
                            </div>
                            <p className="text-sm text-gray-500">Draft a new post for your blog.</p>
                        </Link>

                        <Link href="/admin/settings" className="block p-4 border border-gray-100 rounded-lg hover:border-purple-200 hover:bg-purple-50 transition-all group">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-200 transition-colors">
                                    <Eye size={20} />
                                </div>
                                <span className="font-semibold text-gray-700">Manage Settings</span>
                            </div>
                            <p className="text-sm text-gray-500">Update site config and categories.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
