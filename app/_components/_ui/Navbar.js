"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import { Menu, X, User, Building2, ArrowRight } from "lucide-react";

const navItems = [
	{ name: "Features", href: "#features" },
	{ name: "About", href: "#about" },
	{ name: "Contact", href: "#contact" },
];

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setIsSignUpModalOpen(false);
			}
		};

		if (isSignUpModalOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isSignUpModalOpen]);

	const handleSignUpClick = () => {
		setIsSignUpModalOpen(true);
		setIsMenuOpen(false);
	};

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
					<Button
						onClick={handleSignUpClick}
						className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
					>
						Sign Up
					</Button>
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
						<Button
							onClick={handleSignUpClick}
							className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
						>
							Sign Up
						</Button>
					</div>
				</div>
			)}
			{isSignUpModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsSignUpModalOpen(false)}
					/>

					{/* Modal Content */}
					<div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transform transition-all">
						{/* Close Button */}
						<button
							onClick={() => setIsSignUpModalOpen(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Close modal"
						>
							<X size={24} />
						</button>

						{/* Modal Header */}
						<div className="text-center mb-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Choose Your Account Type
							</h2>
							<p className="text-gray-600">
								Select the option that best describes you
							</p>
						</div>

						{/* Account Type Options */}
						<div className="space-y-4">
							{/* Individual Account */}
							<Link href="/signup/user" className="flex-1">
								<button
									onClick={() => setIsSignUpModalOpen(false)}
									className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-left"
								>
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
												<User className="w-6 h-6 text-indigo-600" />
											</div>
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1">
												Individual Account
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Perfect for personal use, founders, and angel
												investors.
											</p>
											<div className="flex items-center text-indigo-600 text-sm font-medium">
												Sign up as Individual
												<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
											</div>
										</div>
									</div>
								</button>
							</Link>

							{/* Company Account */}
							<Link href="/signup/company" className="flex-1">
								<button
									onClick={() => setIsSignUpModalOpen(false)}
									className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-left"
								>
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
												<Building2 className="w-6 h-6 text-indigo-600" />
											</div>
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1">
												Company Account
											</h3>
											<p className="text-sm text-gray-600 mb-3">
												Ideal for businesses, startups, and organizations
												seeking funding or looking to invest.
											</p>
											<div className="flex items-center text-indigo-600 text-sm font-medium">
												Sign up as Business
												<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
											</div>
										</div>
									</div>
								</button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
