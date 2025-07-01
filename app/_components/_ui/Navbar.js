"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./Button";
import {
	Menu,
	X,
	User,
	Building2,
	ArrowRight,
	Mail,
	Phone,
	Copy,
	CheckCircle2,
} from "lucide-react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
const navItems = [
	// { name: "Features", href: "#features" },
	{ name: "About", href: "/" },
	{ name: "Contact", href: "#contact" },
];

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
	const [isContactModalOpen, setIsContactModalOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const pathname = usePathname();
	// const searchParams = useSearchParams();
	const menuRef = useRef(null);
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

		if (isSignUpModalOpen || isContactModalOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isSignUpModalOpen, isContactModalOpen]);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsMenuOpen(false);
			}
		}

		if (isMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMenuOpen]);

	const handleSignUpClick = () => {
		setIsSignUpModalOpen(true);
		setIsMenuOpen(false);
	};
	const handleContactClick = (e) => {
		e.preventDefault();
		setIsContactModalOpen(true);
		setIsMenuOpen(false);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	return (
		<header
			className={`w-full py-4 px-6 fixed top-0 z-10 transition-all duration-300 ${
				isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-transparent"
			}`}
		>
			<nav className="max-w-7xl mx-auto flex items-center justify-between">
				<Link
					href="/"
					className="flex items-center space-x-2"
					onClick={() => setIsMenuOpen(false)}
				>
					<span className="text-2xl font-bold text-indigo-700">Unikorn</span>
				</Link>

				{/* Desktop Menu */}
				<div className="hidden md:flex items-center space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-indigo-600 hover:text-indigo-800 transition-colors"
							onClick={item.name === "Contact" ? handleContactClick : undefined}
						>
							{item.name}
						</Link>
					))}
					<Link
						href="/signin"
						className="block"
						onClick={() => setIsMenuOpen(false)}
					>
						<Button
							variant="outline"
							className="w-full text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
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
				<div
					ref={menuRef}
					className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6"
				>
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="block py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
							onClick={
								item.name === "Contact"
									? handleContactClick
									: () => setIsMenuOpen(false)
							}
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

			{/* Modal rendered via Portal */}
			{isSignUpModalOpen &&
				typeof window !== "undefined" &&
				createPortal(
					<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
						{/* Backdrop */}
						<div
							className="absolute inset-0 bg-black/50 backdrop-blur-sm"
							onClick={() => setIsSignUpModalOpen(false)}
						/>

						{/* Modal Content */}
						<div className="relative z-10 w-full max-w-md mx-auto my-8 bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
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
					</div>,
					document.body,
				)}
			{isContactModalOpen &&
				typeof window !== "undefined" &&
				createPortal(
					<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
						<div
							className="absolute inset-0 bg-black/50 backdrop-blur-sm"
							onClick={() => setIsContactModalOpen(false)}
						/>

						<div className="relative z-10 w-full max-w-md mx-auto my-8 bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
							<button
								onClick={() => setIsContactModalOpen(false)}
								className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
								aria-label="Close modal"
							>
								<X size={24} />
							</button>

							<div className="text-center mb-8">
								<div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<Mail className="w-8 h-8 text-indigo-600" />
								</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									Contact Us
								</h2>
								<p className="text-gray-600">
									We'd love to hear from you! Here's how to reach us.
								</p>
							</div>

							<div className="space-y-6">
								<div
									className={`bg-indigo-50 rounded-xl p-6 transition-all cursor-pointer 
              ${copied ? "bg-green-50 border-2 border-green-200" : "hover:bg-indigo-100"}`}
									onClick={() => copyToClipboard("unikorn@gmail.com")}
									role="button"
									tabIndex={0}
									aria-label="Copy email address"
								>
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<div
												className={`w-10 h-10 rounded-lg flex items-center justify-center ${
													copied ? "bg-green-200" : "bg-indigo-200"
												}`}
											>
												{copied ? (
													<CheckCircle2 className="w-5 h-5 text-green-700" />
												) : (
													<Mail className="w-5 h-5 text-indigo-700" />
												)}
											</div>
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1">
												Email Us
											</h3>
											<div className="flex items-center justify-between">
												<p
													className={`font-medium ${copied ? "text-green-700" : "text-indigo-700"}`}
												>
													unikorn@gmail.com
												</p>
												<div
													className={`text-gray-500 ${copied ? "text-green-500" : "text-gray-500 hover:text-indigo-600"} transition-colors`}
												>
													{copied ? (
														<span className="text-sm font-medium text-green-600">
															Copied!
														</span>
													) : (
														<Copy className="w-5 h-5" />
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* <div className="bg-gray-50 rounded-xl p-6">
									<div className="flex items-start space-x-4">
										<div className="flex-shrink-0">
											<div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
												<Phone className="w-5 h-5 text-gray-700" />
											</div>
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-gray-900 mb-1">
												Hours of Operation
											</h3>
											<p className="text-gray-600 text-sm">
												Our support team is available Monday through Friday, 9AM
												to 5PM EST.
											</p>
										</div>
									</div>
								</div> */}

								<Button
									onClick={() => {
										window.location.href = "mailto:unikorn@gmail.com";
									}}
									className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
								>
									Send Email Now
								</Button>

								{/* <div className="text-center pt-4 border-t border-gray-200">
									<p className="text-sm text-gray-600 mb-3">
										Follow us on social media for updates
									</p>
									<div className="flex justify-center space-x-4">
										<a
											href="#"
											className="text-gray-400 hover:text-indigo-600 transition-colors"
										>
											<svg
												className="w-6 h-6"
												fill="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
											</svg>
										</a>
										<a
											href="#"
											className="text-gray-400 hover:text-indigo-600 transition-colors"
										>
											<svg
												className="w-6 h-6"
												fill="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													fillRule="evenodd"
													d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
													clipRule="evenodd"
												/>
											</svg>
										</a>
									</div>
								</div> */}
							</div>
						</div>
					</div>,
					document.body,
				)}
		</header>
	);
}
