'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
}

let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function showToast(type: ToastType, title: string, message?: string) {
    if (addToastFn) {
        addToastFn({ type, title, message })
    }
}

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

const styles = {
    success: {
        bg: 'bg-emerald-50 border-emerald-200',
        icon: 'text-emerald-500',
        title: 'text-emerald-800',
        message: 'text-emerald-600',
        progress: 'bg-emerald-400',
    },
    error: {
        bg: 'bg-red-50 border-red-200',
        icon: 'text-red-500',
        title: 'text-red-800',
        message: 'text-red-600',
        progress: 'bg-red-400',
    },
    warning: {
        bg: 'bg-amber-50 border-amber-200',
        icon: 'text-amber-500',
        title: 'text-amber-800',
        message: 'text-amber-600',
        progress: 'bg-amber-400',
    },
    info: {
        bg: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-500',
        title: 'text-blue-800',
        message: 'text-blue-600',
        progress: 'bg-blue-400',
    },
}

export default function ToastProvider() {
    const [toasts, setToasts] = useState<Toast[]>([])

    useEffect(() => {
        addToastFn = (toast) => {
            const id = Math.random().toString(36).substr(2, 9)
            setToasts((prev) => [...prev, { ...toast, id }])

            // Auto-remove after 4s
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id))
            }, 4000)
        }

        return () => {
            addToastFn = null
        }
    }, [])

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => {
                const Icon = icons[toast.type]
                const style = styles[toast.type]

                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm max-w-sm w-full animate-in slide-in-from-right-5 duration-300 ${style.bg}`}
                    >
                        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.icon}`} />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${style.title}`}>{toast.title}</p>
                            {toast.message && (
                                <p className={`text-xs mt-0.5 ${style.message}`}>{toast.message}</p>
                            )}
                        </div>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
