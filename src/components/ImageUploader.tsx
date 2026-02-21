'use client'

import { useState } from 'react'
import { insforge } from '@/lib/insforge'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function ImageUploader({
    value,
    onChange,
    variant = 'default'
}: {
    value: string
    onChange: (url: string) => void
    variant?: 'default' | 'avatar'
}) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const MAX_SIZE_MB = 5

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0) {
                return
            }

            const file = e.target.files[0]

            // Validate file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
            }

            // Validate file size
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                throw new Error(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`)
            }

            setUploading(true)
            setError(null)

            // Ensure we have a valid session before uploading
            const { data: { session }, error: sessionError } = await insforge.auth.getCurrentSession()

            if (sessionError || !session) {
                console.error('Session error:', sessionError)
                throw new Error('Authentication required. Please sign in again.')
            }

            // Explicitly set the token to ensure it's used for the storage request
            if (session.accessToken) {
                insforge.getHttpClient().setAuthToken(session.accessToken)
            }

            console.log('User authenticated, uploading...')

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await insforge.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) {
                if (uploadError.message.includes('Invalid token')) {
                    console.error('Initial upload failed with Invalid token. Please try signing out and signing in again.')
                }
                throw uploadError
            }

            const publicUrl = insforge.storage
                .from('images')
                .getPublicUrl(filePath)

            if (publicUrl) {
                onChange(publicUrl)
            }
        } catch (err: any) {
            setError(err.message || 'Error uploading image')
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        onChange('')
    }

    if (variant === 'avatar') {
        return (
            <div className="flex flex-col items-center gap-2">
                <div className="relative group cursor-pointer w-32 h-32">
                    <input
                        id="avatar-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />

                    {value ? (
                        <div className="w-full h-full relative">
                            <img
                                src={value}
                                alt="Avatar"
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <label htmlFor="avatar-upload" className="cursor-pointer p-2">
                                    <ImageIcon size={24} />
                                </label>
                            </div>
                            <button
                                onClick={handleRemove}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors z-10"
                                title="Remove photo"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="avatar-upload"
                            className="w-full h-full rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            {uploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <Upload size={24} className="mb-1" />
                                    <span className="text-xs">Upload</span>
                                </div>
                            )}
                        </label>
                    )}
                </div>
                {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {value ? (
                <div className="relative w-full max-w-md h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                    <img
                        src={value}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={handleRemove}
                        type="button"
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer relative">
                    <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer w-full flex flex-col items-center">
                        <div className="space-y-1 text-center">
                            {uploading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            ) : (
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600">
                                <span className="relative rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                    {uploading ? 'Uploading...' : 'Upload a file'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </label>
                </div>
            )}
            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    )
}
