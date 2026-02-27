'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { insforge } from '@/lib/insforge'
import ImageUploader from './ImageUploader'
import RichTextEditor from './RichTextEditor'
import { Save, ChevronDown, X } from 'lucide-react'

// Simple slugify function
const slugify = (text: string) => {
    return text.toString().toLowerCase()
        .substring(0, 200)              // Enforce length limit
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export default function PostForm({ post }: { post?: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

    const [formData, setFormData] = useState({
        title_en: '',
        title_ne: '',
        slug_en: '',
        slug_ne: '',
        content_en: '',
        content_ne: '',
        excerpt_en: '',
        excerpt_ne: '',
        status: 'draft',
        featured_image: ''
    })

    // Load initial data if editing
    useEffect(() => {
        if (post) {
            setFormData({
                title_en: post.title_en || '',
                title_ne: post.title_ne || '',
                slug_en: post.slug_en || '',
                slug_ne: post.slug_ne || '',
                content_en: post.content_en || '',
                content_ne: post.content_ne || '',
                excerpt_en: post.excerpt_en || '',
                excerpt_ne: post.excerpt_ne || '',
                status: post.status || 'draft',
                featured_image: post.featured_image || ''
            })
        }
    }, [post])

    // Fetch categories and post's selected categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await insforge.database
                .from('categories')
                .select('*')
                .order('name_en', { ascending: true })
            if (data) setCategories(data)
        }
        const fetchPostCategories = async () => {
            if (post?.id) {
                const { data } = await insforge.database
                    .from('post_categories')
                    .select('category_id')
                    .eq('post_id', post.id)
                if (data) {
                    setSelectedCategories(data.map((d: any) => d.category_id))
                }
            }
        }
        fetchCategories()
        fetchPostCategories()
    }, [post])

    const toggleCategory = (catId: string) => {
        setSelectedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => {
            const newData = { ...prev, [name]: value }

            // Auto-generate slug from title if slug is empty
            if (name === 'title_en' && !post && !prev.slug_en) {
                newData.slug_en = slugify(value)
            }
            return newData
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate inputs before submission
        if (!formData.title_en.trim()) {
            alert('English title is required')
            return
        }
        if (!formData.slug_en.trim()) {
            alert('English slug is required')
            return
        }
        if (formData.title_en.length > 300) {
            alert('Title is too long (max 300 characters)')
            return
        }
        if (formData.slug_en.length > 200) {
            alert('Slug is too long (max 200 characters)')
            return
        }

        setLoading(true)

        try {
            // Get current user for author_id
            const { data: { user } } = await insforge.auth.getCurrentUser()

            if (!user) {
                alert('You must be logged in')
                return
            }

            // Ensure profile exists
            const { data: profileCheck } = await insforge.database
                .from('profiles')
                .select('id')
                .eq('id', user.id)
                .single()

            if (!profileCheck) {
                // Create a basic profile if it's missing
                await insforge.database
                    .from('profiles')
                    .insert([{
                        id: user.id,
                        full_name: user.email?.split('@')[0] || 'User',
                        role: 'user'
                    }])
            }

            // Exclude selectedCategories from payload — handled via junction table
            // But we need to set the primary category_id for the posts table logic
            const primaryCategoryId = selectedCategories.length > 0 ? selectedCategories[0] : null

            const payload: any = {
                ...formData,
                author_id: user.id,
                category_id: primaryCategoryId,
                // Convert empty strings to null for nullable fields to avoid unique constraint violations
                slug_ne: formData.slug_ne.trim() || null,
                title_ne: formData.title_ne.trim() || null,
                excerpt_ne: formData.excerpt_ne.trim() || undefined,
                content_ne: formData.content_ne.trim() || undefined,
            }

            let error
            let postId = post?.id
            if (post) {
                // Update
                const res = await insforge.database
                    .from('posts')
                    .update(payload)
                    .eq('id', post.id)
                error = res.error
            } else {
                // Create
                const res = await insforge.database
                    .from('posts')
                    .insert([payload])
                    .select('id')
                    .single()
                error = res.error
                if (res.data) postId = res.data.id
            }

            // Save categories to junction table
            if (!error && postId) {
                // Delete existing associations
                await insforge.database
                    .from('post_categories')
                    .delete()
                    .eq('post_id', postId)

                // Insert new associations
                if (selectedCategories.length > 0) {
                    const categoryRows = selectedCategories.map(catId => ({
                        post_id: postId,
                        category_id: catId
                    }))
                    const { error: catError } = await insforge.database
                        .from('post_categories')
                        .insert(categoryRows)
                    if (catError) {
                        console.error('Error saving categories:', catError)
                    }
                }
            }

            if (error) {
                console.error('Post save error:', error)
                alert('Failed to save post. Please try again or contact support.')
            } else {
                router.push('/admin/posts')
                router.refresh()
            }
        } catch (err) {
            console.error('Unexpected error saving post:', err)
            alert('An unexpected error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow border border-gray-200">

            {/* English Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">English Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title (EN)</label>
                        <input
                            type="text"
                            name="title_en"
                            value={formData.title_en}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug (EN)</label>
                        <input
                            type="text"
                            name="slug_en"
                            value={formData.slug_en}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Excerpt (EN)</label>
                    <textarea
                        name="excerpt_en"
                        value={formData.excerpt_en}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (EN)</label>
                    <RichTextEditor
                        content={formData.content_en}
                        onChange={(content) => setFormData(prev => ({ ...prev, content_en: content }))}
                    />
                </div>
            </div>

            {/* Nepali Section */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Nepali Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title (NE)</label>
                        <input
                            type="text"
                            name="title_ne"
                            value={formData.title_ne}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug (NE) - Optional</label>
                        <input
                            type="text"
                            name="slug_ne"
                            value={formData.slug_ne}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Excerpt (NE)</label>
                    <textarea
                        name="excerpt_ne"
                        value={formData.excerpt_ne}
                        onChange={handleChange}
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (NE)</label>
                    <RichTextEditor
                        content={formData.content_ne}
                        onChange={(content) => setFormData(prev => ({ ...prev, content_ne: content }))}
                    />
                </div>
            </div>

            {/* Metadata Section */}
            <div className="space-y-4 pt-4 border-t bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Categories</label>
                        <button
                            type="button"
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2 bg-white text-left flex items-center justify-between"
                        >
                            <span className="text-gray-600 truncate">
                                {selectedCategories.length === 0
                                    ? 'Select Categories'
                                    : `${selectedCategories.length} selected`}
                            </span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Selected tags */}
                        {selectedCategories.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {selectedCategories.map(catId => {
                                    const cat = categories.find(c => c.id === catId)
                                    return cat ? (
                                        <span key={catId} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                            {cat.name_en}
                                            <button type="button" onClick={() => toggleCategory(catId)} className="hover:text-gray-600">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ) : null
                                })}
                            </div>
                        )}

                        {/* Dropdown */}
                        {showCategoryDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {categories.map(cat => (
                                    <label
                                        key={cat.id}
                                        className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.id)}
                                            onChange={() => toggleCategory(cat.id)}
                                            className="h-4 w-4 text-gray-800 border-gray-300 rounded mr-3"
                                        />
                                        <span className="text-gray-800">{cat.name_en}</span>
                                        <span className="text-gray-400 ml-1">({cat.name_ne})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm border p-2 bg-white"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Featured Image</label>
                    <ImageUploader
                        value={formData.featured_image}
                        onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
                    />
                </div>
            </div>

            <div className="flex flex-wrap justify-end pt-5 gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <Save size={18} className="mr-2" />
                    {loading ? 'Publishing...' : 'Publish Article'}
                </button>
            </div>        </form>
    )
}
