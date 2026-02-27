'use client'

import { useEffect, useState } from 'react'
import { insforge } from '@/lib/insforge'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()
    const statusFilter = searchParams.get('status')

    const fetchPosts = async () => {
        setLoading(true)
        try {
            let query = insforge.database
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (statusFilter) {
                query = query.eq('status', statusFilter)
            }

            const { data, error } = await query

            if (error) {
                console.error('Error fetching posts:', error)
            }
            if (data) {
                setPosts(data)
            }
        } catch (err) {
            console.error('Unexpected error fetching posts:', err)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [statusFilter])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return

        const { error } = await insforge.database
            .from('posts')
            .delete()
            .eq('id', id)

        if (!error) {
            setPosts(posts.filter(p => p.id !== id))
        } else {
            alert('Error deleting post')
            console.error(error)
        }
    }

    if (loading) return <div className="text-center p-8">Loading posts...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Articles</h1>
                <Link
                    href="/admin/posts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 font-medium transition-colors"
                >
                    <Plus size={18} />
                    Create New
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {post.title_en || '(No Title)'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {post.category_id ? 'Categorized' : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/posts/${post.id}`} className="text-gray-600 hover:text-gray-900 mr-4">
                                            <Pencil size={18} className="inline" />
                                        </Link>
                                        <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 size={18} className="inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {posts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No articles found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
