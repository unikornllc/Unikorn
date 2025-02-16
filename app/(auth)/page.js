"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../_components/_ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../_components/_ui/Card";
import { ChevronRight, LineChart, ShieldCheck, Users } from "lucide-react";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
			<main className="flex-grow mt-20">
				<section className="max-w-7xl mx-auto px-6 py-20 text-center">
					<h1 className="text-5xl font-bold text-indigo-900 mb-6">
						Revolutionize Your Investment Journey
					</h1>
					<p className="text-xl text-indigo-700 mb-10 max-w-2xl mx-auto">
						Connect with innovative companies, invest in the future, and grow
						your portfolio with Unikorn's secure and intuitive platform.
					</p>
					<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
						<Link href="/signup/company">
							<Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg">
								Register as Company
							</Button>
						</Link>
						<Link href="/signup/user">
							<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg">
								Register as Investor
							</Button>
						</Link>
					</div>
				</section>

				<section id="features" className="bg-white py-20">
					<div className="max-w-7xl mx-auto px-6">
						<h2 className="text-3xl font-bold text-center text-indigo-900 mb-12">
							Key Features
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-lg">
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<LineChart className="text-indigo-600" />
										<span>Equity Fundraising</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Launch your fundraising campaign and connect with
										potential investors to fuel your company's growth.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-none shadow-lg">
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<Users className="text-purple-600" />
										<span>Investor Opportunities</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Discover and invest in promising companies with flexible
										investment options and real-time tracking.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="bg-gradient-to-br from-pink-50 to-indigo-50 border-none shadow-lg">
								<CardHeader>
									<CardTitle className="flex items-center space-x-2">
										<ShieldCheck className="text-pink-600" />
										<span>Secure Transactions</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Enjoy peace of mind with our secure transaction management
										and integrated contract system.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				<section className="py-20 bg-gradient-to-br from-indigo-100 to-purple-100">
					<div className="max-w-7xl mx-auto px-6 text-center">
						<h2 className="text-3xl font-bold text-indigo-900 mb-6">
							Ready to Transform Your Investment Strategy?
						</h2>
						<p className="text-xl text-indigo-700 mb-10 max-w-2xl mx-auto">
							Join Unikorn today and be part of the future of equity
							fundraising and investment.
						</p>
						<Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg">
							Get Started <ChevronRight className="ml-2" />
						</Button>
					</div>
				</section>
			</main>

			<footer className="bg-indigo-900 text-white py-10">
				<div className="max-w-7xl  mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
					<div className="flex items-center space-x-2 mb-4 md:mb-0">
						<span className="text-xl font-bold">Unikorn</span>
					</div>
					<div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
						<Link
							href="#"
							className="hover:text-indigo-300 transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="#"
							className="hover:text-indigo-300 transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							href="#"
							className="hover:text-indigo-300 transition-colors"
						>
							Contact Us
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
