"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/app/_components/_ui/DropdownMenu";

import { Bell, MessageSquare, Search, Menu, X } from "lucide-react";

export default function Navbar({ userRole }) {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const pathname = usePathname();
	const navItems =
		userRole === "User"
			? [
					{ href: "/user/home", label: "Home" },
					{ href: "/investments", label: "Investments" },
					{ href: "/companies", label: "Companies" },
					{ href: "/user/portfolio", label: "Portfolio" },
				]
			: [
					{ href: "/company/home", label: "Home" },
					{ href: "/investments", label: "Investments" },
					{ href: "/company/fundraising", label: "Fundraising" },
					{ href: "/companies", label: "Companies" },
					{ href: "/company/investors", label: "Investors" },
				];

	const handleLogout = async () => {
		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/logout`,
				{},
				{ withCredentials: true },
			);
			router.push("/signin");
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};
	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center">
							<Link
								href={userRole == "User" ? "/user/home" : "/company/home"}
								className="text-2xl font-bold text-indigo-600"
							>
								Unikorn
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
										pathname === item.href
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>

					<div className="hidden sm:ml-6 sm:flex sm:items-center">
						<div className="relative">
							<Input
								type="text"
								placeholder="Search..."
								className="w-64 pl-10"
							/>
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
						</div>
						<Button variant="ghost" size="icon" className="ml-3">
							<Bell className="h-5 w-5" />
						</Button>
						<Button variant="ghost" size="icon" className="ml-3">
							<MessageSquare className="h-5 w-5" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="ml-3">
									<Avatar>
										<AvatarImage alt="User" />
										<AvatarFallback>U</AvatarFallback>
									</Avatar>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onSelect={() => {
										window.location.href =
											userRole === "Company"
												? "/company/profile"
												: "/user/profile";
									}}
								>
									Profile
								</DropdownMenuItem>
								<DropdownMenuItem onSelect={() => {
										window.location.href =
											"/settings"
									}}
								>Settings</DropdownMenuItem>
								<DropdownMenuItem>Wallet</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onSelect={handleLogout}>
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center sm:hidden">
						<Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
							{isMenuOpen ? (
								<X className="h-6 w-6" />
							) : (
								<Menu className="h-6 w-6" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{isMenuOpen && (
				<div className="sm:hidden">
					<div className="pt-2 pb-3 space-y-1">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
									pathname === item.href
										? "bg-indigo-50 border-indigo-500 text-indigo-700"
										: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
								}`}
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}
