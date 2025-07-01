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
import { ChevronRight, LineChart, ShieldCheck, Users, Search, MessageCircle, TrendingUp, Eye, Handshake, BarChart3, UserCheck, Rocket, Star, Sparkles, FileText, UserPlus, StickyNote, AlertCircle } from "lucide-react";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
			<main className="flex-grow mt-20">
				{/* Hero Section */}
				<section className="max-w-7xl mx-auto px-6 py-20 text-center">
					<h1 className="text-5xl font-bold text-indigo-900 mb-6">
						Empowering Investors & Founders to <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Connect, Invest, and Grow</span>
					</h1>
					<p className="text-xl text-indigo-700 mb-10 max-w-4xl mx-auto">
						Unikorn is the social platform where innovative startups meet forward-thinking investors. Whether you're looking to invest in the next big thing or raise capital for your company, Unikorn is your gateway to opportunity.
					</p>
					<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
						<Link href="/signup/user">
							<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg">
								Join as an Investor
							</Button>
						</Link>
						<Link href="/signup/user?type=Founder">
							<Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg">
								Join as a Founder
							</Button>
						</Link>
						<Link href="/signup/company">
							<Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg">
								Join as a Business
							</Button>
						</Link>
					</div>
				</section>

				{/* Features for Investors */}
				<section id="investor-features" className="bg-white py-20">
					<div className="max-w-7xl mx-auto px-6">
						<h2 className="text-3xl font-bold text-center text-indigo-900 mb-12 flex items-center justify-center gap-2">
							<Users className="text-indigo-600" /> For Investors
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><Search className="text-blue-600 w-5 h-5" />Discover Opportunities</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Access great ideas and startups looking for investment.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><Rocket className="text-purple-600 w-5 h-5" />Invest Early</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Connect directly with entrepreneurs, with no boundaries and full transparency.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><MessageCircle className="text-indigo-600 w-5 h-5" />Secure Chatting</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Contact startups through a secure, private chat system.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="text-orange-600 w-5 h-5" />Stay Ahead</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Stay informed on trends, insights, and discussions through the startup community newsfeed.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><UserCheck className="text-indigo-600 w-5 h-5" />Smart Matching</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Get matched with startups that fit your investment thesis.
									</CardDescription>
								</CardContent>
							</Card>
							<div className="relative">
								<div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold rounded-full px-3 py-1 shadow z-10">
									SOON
								</div>
								<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<FileText className="text-green-700 w-5 h-5" />AI Pitch Analysis
										</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className="text-base">
											Evaluate pitch decks, research the market, and score opportunity quality using AI.
										</CardDescription>
									</CardContent>
								</Card>
							</div>
						</div>
						<div className="flex justify-center mt-10">
							<Link href="/signup/user">
								<Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2">
									Join as an Investor <ChevronRight className="ml-2" />
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Features for Founders */}
				<section id="founder-features" className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20">
					<div className="max-w-7xl mx-auto px-6">
						<h2 className="text-3xl font-bold text-center text-purple-900 mb-12 flex items-center justify-center gap-2">
							<Rocket className="text-purple-600" /> For Founders
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><LineChart className="text-indigo-600 w-5 h-5" />Launch Fundraising</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Launch your fundraising campaign and connect with potential investors to fuel your company's growth.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><Star className="text-yellow-500 w-5 h-5" />Share & Get Feedback</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Share updates and get feedback from the right audience.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><MessageCircle className="text-indigo-600 w-5 h-5" />Secure Chatting</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Get in touch with investors through a secure chat system.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="text-purple-500 w-5 h-5" />Pitch to Investors</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Pitch your idea to a bank of investors and get noticed by the right backers.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><Handshake className="text-pink-600 w-5 h-5" />Find Partners & Team Up</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Find partners, cofounders, or people interested in your idea and team up.
									</CardDescription>
								</CardContent>
							</Card>
							<Card className="p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-shadow duration-300">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg"><Users className="text-indigo-600 w-5 h-5" />Network in Community</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base">
										Network through the startup community with investors and other founders.
									</CardDescription>
								</CardContent>
							</Card>
						</div>
						<div className="flex justify-center mt-10">
							<Link href="/signup/user?type=Founder">
								<Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full text-lg flex items-center gap-2">
									Join as Founder <ChevronRight className="ml-2" />
								</Button>
							</Link>
						</div>
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
