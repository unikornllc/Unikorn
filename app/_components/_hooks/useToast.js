"use client"

import { useState } from "react"

export const useToast = () => {
    const [toasts, setToasts] = useState([])

    const addToast = (message, type = "default", duration = 3000) => {
        const id = Date.now()
        setToasts((prevToasts) => [...prevToasts, { id, message, type }])

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration)
        }
    }

    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }

    return {
        toasts,
        toast: addToast,
        removeToast,
    }
}

