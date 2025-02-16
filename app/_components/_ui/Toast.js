"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

export const Toast = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300) // Wait for fade out animation
        }, 3000)

        return () => clearTimeout(timer)
    }, [onClose])

    const baseClasses = "fixed bottom-4 right-4 p-4 rounded-md shadow-md transition-opacity duration-300"
    const typeClasses = {
        default: "bg-gray-800 text-white",
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
        warning: "bg-yellow-500 text-white",
    }

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="flex items-center justify-between">
                <span>{message}</span>
                <button onClick={() => setIsVisible(false)} className="ml-4 text-white hover:text-gray-200">
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed bottom-4 right-4 space-y-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

