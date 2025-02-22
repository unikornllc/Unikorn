"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/app/_utils/utils"
import { useToast } from "@/app/_components/_hooks/useToast"
import { ToastContainer } from "@/app/_components/_ui/Toast"

const navItems = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/transactions", label: "Transactions" },
    { href: "/admin/ledger-accounts", label: "Ledger Accounts" },
    { href: "/admin/journals", label: "Journals" },
    { href: "/admin/fundraising", label: "Fundraising" },
]

export default function AdminLayout({ children }) {
    const pathname = usePathname()
    const { toasts, removeToast } = useToast()

    return (
        <div className="flex h-screen bg-gray-100">
            <nav className="w-64 bg-white shadow-md">
                <div className="p-4">
                    <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                </div>
                <ul className="space-y-2 p-4">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "block p-2 rounded transition-colors",
                                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                )}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    )
}

