'use client'

import PostForm from '@/components/PostForm'

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Create New Article</h1>
            <PostForm />
        </div>
    )
}
