'use client'

import { use, useEffect, useState } from 'react'
import { insforge } from '@/lib/insforge'
import PostForm from '@/components/PostForm'

type Props = {
    params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: Props) {
    const { id } = use(params)
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await insforge.database
                .from('posts')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                console.error(error)
            } else {
                setPost(data)
            }
            setLoading(false)
        }
        fetchPost()
    }, [id])

    if (loading) return <div>Loading...</div>
    if (!post) return <div>Post not found</div>

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Article</h1>
            <PostForm post={post} />
        </div>
    )
}
