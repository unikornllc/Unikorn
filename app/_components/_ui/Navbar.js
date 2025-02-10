"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { Menu, X } from "lucide-react";

const navItems = [
	{ name: "Features", href: "#features" },
	{ name: "About", href: "#about" },
	{ name: "Contact", href: "#contact" },
];

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`w-full py-4 px-6 fixed top-0 z-10 transition-all duration-300 ${
				isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-transparent"
			}`}
		>
			<nav className="max-w-7xl mx-auto flex items-center justify-between">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-2xl font-bold text-indigo-700">Unikorn</span>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden md:flex items-center space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-indigo-600 hover:text-indigo-800 transition-colors"
						>
							{item.name}
						</Link>
					))}
					<Link href="/signin">
						<Button
							variant="outline"
							className="text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
						>
							Log In
						</Button>
					</Link>
					<Link href="/signup/user">
						<Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
							Sign Up
						</Button>
					</Link>
				</div>

				{/* Mobile Menu Button */}
				<div className="md:hidden">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle Menu"
					>
						{isMenuOpen ? <X /> : <Menu />}
					</Button>
				</div>
			</nav>

			{/* Mobile Menu */}
			{isMenuOpen && (
				<div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="block py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
							onClick={() => setIsMenuOpen(false)}
						>
							{item.name}
						</Link>
					))}
					<div className="mt-4 space-y-2">
						<Link href="/signin" className="block">
							<Button
								variant="outline"
								className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
							>
								Log In
							</Button>
						</Link>
						<Link href="/signup/user" className="block">
							<Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
								Sign Up
							</Button>
						</Link>
					</div>
				</div>
			)}
		</header>
	);
}
