'use client'

import { useEffect, useState } from 'react'
import { insforge } from '@/lib/insforge'
import { Plus, Trash2, Pencil, X, Check, User, Lock, List, Save, ShieldCheck, Mail } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import { showToast } from '@/components/Toast'

interface Category {
    id: string
    name_en: string
    name_ne: string
    slug: string
}

export default function AdminSettingsPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showAdd, setShowAdd] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name_en: '', name_ne: '', slug: '' })

    const [profile, setProfile] = useState<{ id: string, full_name: string, avatar_url: string } | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
    const [sendingReset, setSendingReset] = useState(false)

    const fetchCategories = async () => {
        setLoading(true)
        const { data, error } = await insforge.database
            .from('categories')
            .select('*')
            .order('name_en', { ascending: true })

        if (!error && data) {
            setCategories(data)
        }
        setLoading(false)
    }

    const fetchProfile = async () => {
        setProfileLoading(true)
        const { data: { session } } = await insforge.auth.getCurrentSession()

        if (session?.user) {
            const { data } = await insforge.database
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (data) {
                setProfile(data)
            }
        }
        setProfileLoading(false)
    }

    useEffect(() => {
        fetchCategories()
        fetchProfile()
    }, [])

    const handleProfileUpdate = async () => {
        if (!profile) return

        // Update the profiles table (used by blog pages & sidebar)
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

    const handleSendResetEmail = async () => {
        const { data: { session } } = await insforge.auth.getCurrentSession()
        const email = session?.user?.email
        if (!email) {
            setPasswordMessage({ type: 'error', text: 'Could not determine your email address.' })
            return
        }

        setSendingReset(true)
        setPasswordMessage({ type: '', text: '' })

        const { error } = await insforge.auth.sendResetPasswordEmail({ email })

        if (error) {
            console.error('Password reset email error:', error)
            setPasswordMessage({ type: 'error', text: 'Failed to send reset email. Please try again.' })
        } else {
            setPasswordMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' })
        }
        setSendingReset(false)
    }

    const slugify = (text: string) =>
        text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-')

    const handleAdd = async () => {
        if (!formData.name_en) return
        const slug = formData.slug || slugify(formData.name_en)

        const { error } = await insforge.database
            .from('categories')
            .insert([{ name_en: formData.name_en, name_ne: formData.name_ne, slug }])

        if (error) {
            console.error('Category add error:', error)
            showToast('error', 'Failed to Add', 'Could not add category. Please try again.')
        } else {
            setFormData({ name_en: '', name_ne: '', slug: '' })
            setShowAdd(false)
            fetchCategories()
        }
    }

    const handleUpdate = async (id: string) => {
        if (!formData.name_en) return

        const { error } = await insforge.database
            .from('categories')
            .update({ name_en: formData.name_en, name_ne: formData.name_ne, slug: formData.slug })
            .eq('id', id)

        if (error) {
            console.error('Category update error:', error)
            showToast('error', 'Update Failed', 'Could not update category. Please try again.')
        } else {
            setEditingId(null)
            setFormData({ name_en: '', name_ne: '', slug: '' })
            fetchCategories()
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? Posts in this category will lose their category.')) return

        const { error } = await insforge.database
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Category delete error:', error)
            showToast('error', 'Delete Failed', 'Could not delete category. Please try again.')
        } else {
            fetchCategories()
        }
    }

    const startEdit = (cat: Category) => {
        setEditingId(cat.id)
        setFormData({ name_en: cat.name_en, name_ne: cat.name_ne, slug: cat.slug })
        setShowAdd(false)
    }

    if (loading || profileLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        </div>
    )

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account preferences and site configuration</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Profile & Security */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                            <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                                <User size={20} />
                            </div>
                            <h2 className="font-bold text-gray-700">Profile</h2>
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
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name || ''}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleProfileUpdate}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-900 transition font-medium text-sm shadow-sm hover:shadow active:scale-[0.98]"
                                >
                                    <Save size={18} />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>


                </div>

                {/* Right Column: Categories */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <List size={20} />
                                </div>
                                <h2 className="font-bold text-gray-700">Categories</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAdd(!showAdd)
                                    setEditingId(null)
                                    setFormData({ name_en: '', name_ne: '', slug: '' })
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${showAdd
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-gray-800 text-white hover:bg-gray-900 shadow-sm shadow-gray-300 hover:shadow-md'
                                    }`}
                            >
                                {showAdd ? <X size={16} /> : <Plus size={16} />}
                                {showAdd ? 'Cancel' : 'Add Category'}
                            </button>
                        </div>

                        {/* Add Form */}
                        {showAdd && (
                            <div className="p-6 bg-gray-50/50 border-b border-gray-200 animate-in slide-in-from-top-2 duration-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-4 bg-gray-800 rounded-full"></div>
                                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">New Category</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-4 space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Name (EN)</label>
                                        <input
                                            type="text"
                                            value={formData.name_en}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                                            placeholder="e.g. Politics"
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 outline-none text-sm shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-4 space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Name (NE)</label>
                                        <input
                                            type="text"
                                            value={formData.name_ne}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name_ne: e.target.value }))}
                                            placeholder="e.g. राजनीति"
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 outline-none text-sm shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-3 space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Slug</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            placeholder="politics"
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 outline-none text-sm shadow-sm"
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <button
                                            onClick={handleAdd}
                                            className="w-full flex items-center justify-center bg-gray-800 text-white h-[38px] rounded-md hover:bg-gray-900 transition-colors shadow-sm"
                                            title="Save Category"
                                        >
                                            <Check size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name (EN)</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name (NE)</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                                            {editingId === cat.id ? (
                                                <>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={formData.name_en}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                                                            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 outline-none text-sm shadow-sm"
                                                            autoFocus
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={formData.name_ne}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, name_ne: e.target.value }))}
                                                            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 outline-none text-sm shadow-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={formData.slug}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                                            className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-gray-200 outline-none text-sm shadow-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleUpdate(cat.id)} className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors shadow-sm">
                                                                <Check size={16} />
                                                            </button>
                                                            <button onClick={() => { setEditingId(null); setFormData({ name_en: '', name_ne: '', slug: '' }) }} className="p-1.5 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded transition-colors shadow-sm">
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{cat.name_en}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 font-hindi">{cat.name_ne}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 uppercase tracking-wide border border-gray-200">
                                                            {cat.slug}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                                            <button
                                                                onClick={() => startEdit(cat)}
                                                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cat.id)}
                                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {categories.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-12 text-center h-64 bg-gray-50/20">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <List className="text-gray-300" size={32} />
                                    </div>
                                    <h3 className="text-gray-900 font-medium mb-1">No categories found</h3>
                                    <p className="text-gray-500 text-sm">Create your first category to get started.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
