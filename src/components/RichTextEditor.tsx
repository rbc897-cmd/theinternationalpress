'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Heading1, Heading2, Link as LinkIcon, Image as ImageIcon,
    Code, Quote
} from 'lucide-react'
import { useEffect } from 'react'
import { insforge } from '@/lib/insforge'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    editable?: boolean
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `post-images/${fileName}`

            const { error: uploadError } = await insforge.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const result = insforge.storage
                .from('images')
                .getPublicUrl(filePath) as any

            // Handle both string return (older SDKs/mocks) and object return (Supabase v2)
            const publicUrl = result.data?.publicUrl || result

            editor.chain().focus().setImage({ src: publicUrl }).run()
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        if (url === null) return

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-lg items-center">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Strikethrough"
            >
                <Strikethrough size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Heading 3"
            >
                <div className="font-bold text-xs">H3</div>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={setLink}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Link"
            >
                <LinkIcon size={18} />
            </button>

            <label className="p-1.5 rounded hover:bg-gray-200 text-gray-600 cursor-pointer" title="Image">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
                <ImageIcon size={18} />
            </label>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                title="Quote"
            >
                <Quote size={18} />
            </button>
        </div>
    )
}

export default function RichTextEditor({ content, onChange, editable = true }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-gray-800 underline',
                },
            }),
        ],
        content: content,
        editable: editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Update content if changed externally (e.g. initial load)
    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            // Prevent cursor jumping by only updating when not focused or if empty
            if (!editor.isFocused || editor.isEmpty) {
                editor.commands.setContent(content)
            }
        }
    }, [content, editor])

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-gray-400 focus-within:border-transparent">
            {editable && <MenuBar editor={editor} />}
            <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[200px] outline-none" />
        </div>
    )
}
