"use client"

import { useToast } from '@/app/_components/_hooks/useToast';
import { ToastContainer } from '@/app/_components/_ui/Toast';

export default function Layout({ children }) {
    const { toasts, removeToast } = useToast();

    return (
        <>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </>
    );
}