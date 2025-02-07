"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Navbar = () => {
	const router = useRouter();
	const [isClick, setIsClick] = useState(false);

	const toggleNavBar = () => {
		setIsClick(!isClick);
	};

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
		<>
			<nav className="bg-[#7e57c2] sticky top-0 z-10">
				<div className="max-w-full mx-96 px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center">
							<div className="flex-shrink-0">
								<Link href="/" className="text-white">
									Logo
								</Link>
							</div>
						</div>
						<div className="hidden md:block">
							<div className="ml-4 flex items-center space-x-4">
								<Link
									href="/"
									className="text-white hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
								>
									Home
								</Link>
								<Link
									href="/"
									className="text-white hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
								>
									About
								</Link>
								<Link
									href="/"
									className="text-white hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
								>
									Contact
								</Link>
								<a
									onClick={handleLogout}
									className="cursor-pointer text-white hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
								>
									Logout
								</a>
							</div>
						</div>
						<div className="md:hidden flex items-center">
							<button
								className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
								onClick={toggleNavBar}
							>
								{isClick ? (
									<svg
										className="h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								) : (
									<svg
										className="h-6 w-6"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16m-7 6h7"
										/>
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
				{isClick && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-t-1 sm:px-3">
							<Link
								href="/"
								className="text-white block hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
							>
								Home
							</Link>
							<Link
								href="/"
								className="text-white block hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
							>
								About
							</Link>
							<Link
								href="/"
								className="text-white block hover:bg-[#fff0db] hover:text-black rounded-lg p-2"
							>
								Contact
							</Link>
						</div>
					</div>
				)}
			</nav>
		</>
	);
};

export default Navbar;
