"use client";

import { motion } from "framer-motion";
import { Button } from "../../_components/_ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../_components/_ui/Card";
import { Clock, Rocket, Users, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";
import Navbar from "../../_components/_ui/Navbar";

export default function StayTuned() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
			<Navbar />
			<div className="container mx-auto px-4 py-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="flex flex-col items-center justify-center min-h-[70vh]"
				>
					<Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl text-center">
						<CardHeader className="space-y-4">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
								className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center"
							>
								<Rocket className="w-10 h-10 text-white" />
							</motion.div>
							<CardTitle className="text-4xl font-bold text-indigo-900">
								Stay Tuned!
							</CardTitle>
							<CardDescription className="text-xl text-indigo-700">
								Thank you for joining Unikorn! We're working hard to bring you the future of equity fundraising.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-8">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200"
							>
								<div className="flex items-center justify-center space-x-2 mb-4">
									<Clock className="w-6 h-6 text-indigo-600" />
									<h3 className="text-lg font-semibold text-indigo-900">Coming Soon</h3>
								</div>
								<p className="text-indigo-700">
									We're in the final stages of development. Get ready to revolutionize your investment journey with our secure and intuitive platform.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.7 }}
								className="grid grid-cols-1 md:grid-cols-2 gap-4"
							>
								<div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
									<Users className="w-6 h-6 text-indigo-600" />
									<div>
										<h4 className="font-semibold text-indigo-900">For Investors</h4>
										<p className="text-sm text-indigo-700">Discover and invest in promising companies</p>
									</div>
								</div>
								<div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
									<Building2 className="w-6 h-6 text-purple-600" />
									<div>
										<h4 className="font-semibold text-purple-900">For Founders</h4>
										<p className="text-sm text-purple-700">Connect with potential investors worldwide</p>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.8 }}
								className="grid grid-cols-1 md:grid-cols-2 gap-4"
							>
								<div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
									<Building2 className="w-6 h-6 text-indigo-600" />
									<div>
										<h4 className="font-semibold text-indigo-900">For Startups</h4>
										<p className="text-sm text-indigo-700">Launch fundraising campaigns and connect with investors</p>
									</div>
								</div>
								<div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
									<TrendingUp className="w-6 h-6 text-purple-600" />
									<div>
										<h4 className="font-semibold text-purple-900">For VCs</h4>
										<p className="text-sm text-purple-700">Discover and invest in promising companies</p>
									</div>
								</div>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.9 }}
								className="space-y-4"
							>
								<p className="text-indigo-600 font-medium">
									We'll notify you as soon as we launch!
								</p>
								<div className="flex flex-col sm:flex-row gap-3 justify-center">
									<Link href="/">
										<Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2">
											Back to Home
										</Button>
									</Link>
									<Link href="/signin">
										<Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 px-6 py-2">
											Sign In
										</Button>
									</Link>
								</div>
							</motion.div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
} 