"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../_components/_ui/Button";
import { Badge } from "../_components/_ui/Badge";
import {
	ChevronRight,
	ShieldCheck,
	Users,
	Search,
	MessageCircle,
	TrendingUp,
	BarChart3,
	Rocket,
	Star,
	ArrowRight,
	Target,
	Zap,
	Building2,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
	const [isVisible, setIsVisible] = useState(false);
	const [activeFeature, setActiveFeature] = useState(0);

	useEffect(() => {
		setIsVisible(true);
		const interval = setInterval(() => {
			setActiveFeature((prev) => (prev + 1) % 3);
		}, 3000);
		return () => clearInterval(interval);
	}, []);

	const communityHighlights = [
		{
			label: "Global Community",
			icon: Users,
			description: "Connect worldwide",
		},
		{
			label: "Social Networking",
			icon: MessageCircle,
			description: "Build relationships",
		},
		{
			label: "Knowledge Sharing",
			icon: Star,
			description: "Learn & grow together",
		},
		{ label: "Direct Access", icon: Zap, description: "No gatekeepers" },
	];

	const testimonials = [
		{
			name: "Sarah Chen",
			role: "Angel Investor",
			image: "/placeholder.svg?height=60&width=60",
			quote:
				"Unikorn helped me discover 3 promising startups that perfectly matched my investment thesis.",
		},
		{
			name: "Marcus Rodriguez",
			role: "Founder, TechFlow",
			image: "/placeholder.svg?height=60&width=60",
			quote:
				"We raised our seed round in just 6 weeks through connections made on Unikorn.",
		},
		{
			name: "Emily Watson",
			role: "VC Partner",
			image: "/placeholder.svg?height=60&width=60",
			quote:
				"The AI-powered matching system saves us hours of deal sourcing every week.",
		},
	];

	return (
		<div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
			{/* Header/Navigation */}
			{/* <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg">
                <Image src="/unikorn_logo2.png" alt="Unikorn Logo" width={40} height={40} />
              </div>
              <span className="text-2xl font-bold text-indigo-900">Unikorn</span>
            </div>
          </div>
        </div>
      </header> */}
			<main className="flex-grow mt-20">
				{/* Hero Section */}
				<section className="max-w-7xl mx-auto px-6 py-20">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div
							className={`space-y-8 ${isVisible ? "animate-in slide-in-from-left duration-1000" : "opacity-0"}`}
						>
							<div className="space-y-4">
								<Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium">
									🌟 Become part of the early investors club and Join Now for
									free.
								</Badge>
								<h1 className="text-5xl lg:text-6xl font-bold text-indigo-900 leading-tight">
									The Social Platform Where
									<span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent block">
										Startups Get Funded
									</span>
								</h1>
								<p className="text-xl text-indigo-700 leading-relaxed">
									Join the most vibrant startup community where founders connect
									with investors, share insights, and build the future together
									through meaningful relationships.
								</p>
							</div>

							<div className="flex flex-col gap-8">
								<div className="flex flex-col sm:flex-row gap-8">
									<Link href="/signup/user">
										<Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
											Join as an Investor
											<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
										</Button>
									</Link>
									<Link href="/signup/user?type=Founder">
										<Button
											variant="outline"
											className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 group bg-transparent"
										>
											Join as a Founder
											<Rocket className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
										</Button>
									</Link>
								</div>
								<div className="flex justify-start">
									<Link href="/signup/company">
										<Button
											variant="outline"
											className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 group bg-transparent"
										>
											Join as a Business
											<Building2 className="ml-2 w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
										</Button>
									</Link>
								</div>
							</div>

							{/* Community Highlights */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
								{communityHighlights.map((highlight, index) => {
									const IconComponent = highlight.icon;
									return (
										<div key={index} className="text-center group">
											<div className="flex justify-center mb-2">
												<IconComponent className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />
											</div>
											<div className="text-lg font-bold text-indigo-900">
												{highlight.label}
											</div>
											<div className="text-sm text-indigo-600">
												{highlight.description}
											</div>
										</div>
									);
								})}
							</div>
						</div>

						<div
							className={`relative ${isVisible ? "animate-in slide-in-from-right duration-1000 delay-300" : "opacity-0"}`}
						>
							<div className="relative">
								{/* Main Hero Image */}
								<div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
									<Image
										src="/Unikorn_celebrate.png?height=400&width=500"
										alt="Unikorn Platform Dashboard"
										width={500}
										height={400}
										className="rounded-2xl shadow-lg"
									/>
								</div>

								{/* Floating Elements */}
								<div className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg animate-bounce">
									<Users className="w-8 h-8 text-purple-500" />
								</div>
								<div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full p-4 shadow-lg animate-pulse">
									<MessageCircle className="w-8 h-8" />
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works Section */}
				<section className="bg-white py-20">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-indigo-900 mb-4">
								How Our Community Works
							</h2>
							<p className="text-xl text-indigo-700 max-w-3xl mx-auto">
								Three simple steps to join, connect, and thrive in the most
								supportive startup community
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									step: "01",
									title: "Discover & Connect",
									description:
										"Browse curated startups or get AI-powered matches based on your investment preferences",
									image: "/discover.png?height=200&width=300",
									icon: Search,
								},
								{
									step: "02",
									title: "Evaluate & Chat",
									description:
										"Review pitch decks, analyze market data, and chat securely with founders",
									image: "/chat.png?height=200&width=300",
									icon: MessageCircle,
								},
								{
									step: "03",
									title: "Invest & Grow",
									description:
										"Make informed investments and track your portfolio's growth over time",
									image: "/grow.png?height=200&width=300",
									icon: TrendingUp,
								},
							].map((item, index) => {
								const IconComponent = item.icon;
								return (
									<div key={index} className="relative group">
										<div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
											<div className="flex items-center justify-center mb-6">
												<div className="relative">
													<Image
														src={item.image || "/placeholder.svg"}
														alt={item.title}
														width={300}
														height={200}
														className="rounded-xl"
													/>
													<div className="absolute -top-4 -left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
														{item.step}
													</div>
												</div>
											</div>
											<div className="text-center">
												<IconComponent className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
												<h3 className="text-xl font-bold text-indigo-900 mb-3">
													{item.title}
												</h3>
												<p className="text-indigo-700">{item.description}</p>
											</div>
										</div>
										{index < 2 && (
											<div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
												<ArrowRight className="w-8 h-8 text-indigo-300" />
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Community Features */}
				<section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
					<div className="max-w-7xl mx-auto px-6">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold text-indigo-900 mb-4">
								More Than Just Funding
							</h2>
							<p className="text-xl text-indigo-700 max-w-3xl mx-auto">
								Unikorn is a thriving social platform where the startup
								community comes together to share, learn, and grow
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
							{[
								{
									icon: MessageCircle,
									title: "Community Discussions",
									description:
										"Join conversations about trends, challenges, and opportunities in the startup world",
									color: "blue",
								},
								{
									icon: Users,
									title: "Networking Events",
									description:
										"Connect with like-minded entrepreneurs and investors through virtual and in-person events",
									color: "purple",
								},
								{
									icon: Star,
									title: "Knowledge Sharing",
									description:
										"Learn from experienced founders and investors through shared insights and resources",
									color: "indigo",
								},
								{
									icon: TrendingUp,
									title: "Success Stories",
									description:
										"Celebrate wins together and learn from the journeys of successful community members",
									color: "green",
								},
							].map((feature, index) => {
								const IconComponent = feature.icon;
								return (
									<div
										key={index}
										className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
									>
										<div
											className={`bg-${feature.color}-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4`}
										>
											<IconComponent
												className={`w-8 h-8 text-${feature.color}-600`}
											/>
										</div>
										<h3 className="text-xl font-bold text-indigo-900 mb-3">
											{feature.title}
										</h3>
										<p className="text-indigo-700">{feature.description}</p>
									</div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Features for Investors */}
				<section
					id="investor-features"
					className="bg-gradient-to-br from-indigo-50 to-purple-50 py-20"
				>
					<div className="max-w-7xl mx-auto px-6">
						<div className="grid lg:grid-cols-2 gap-16 items-center">
							<div>
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full p-3">
										<Users className="text-white w-6 h-6" />
									</div>
									<h2 className="text-4xl font-bold text-indigo-900">
										For Investors
									</h2>
								</div>
								<p className="text-xl text-indigo-700 mb-8">
									Access exclusive deal flow, connect with vetted startups, and
									make data-driven investment decisions.
								</p>

								<div className="space-y-6">
									{[
										{
											icon: Search,
											title: "Deal Discovery",
											description:
												"Find startups that align with your investment thesis and portfolio strategy.",
											color: "green",
										},
										{
											icon: MessageCircle,
											title: "Direct Communication",
											description:
												"Skip the gatekeepers and communicate directly with decision-makers through secure messaging.",
											color: "blue",
										},
										{
											icon: BarChart3,
											title: "Market Intelligence (SOON)",
											description:
												"Access real-time market data, trends, insights and AI tools to make informed investment decisions.",
											color: "purple",
										},
									].map((feature, index) => {
										const IconComponent = feature.icon;
										return (
											<div
												key={index}
												className="flex gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
											>
												<div
													className={`bg-${feature.color}-100 rounded-lg p-3 flex-shrink-0`}
												>
													<IconComponent
														className={`w-6 h-6 text-${feature.color}-600`}
													/>
												</div>
												<div>
													<h3 className="font-semibold text-indigo-900 mb-2">
														{feature.title}
													</h3>
													<p className="text-indigo-700 text-sm">
														{feature.description}
													</p>
												</div>
											</div>
										);
									})}
								</div>

								<div className="mt-8">
									<Link href="/signup/user">
										<Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
											Start Investing Today
											<ChevronRight className="ml-2 w-5 h-5" />
										</Button>
									</Link>
								</div>
							</div>

							<div className="relative">
								<div className="bg-white rounded-3xl p-8 shadow-2xl">
									<Image
										src="/investor.png?height=400&width=500"
										alt="Investor Dashboard"
										width={500}
										height={400}
										className="rounded-2xl"
									/>
								</div>
								{/* Community indicators */}
								<div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4 shadow-lg animate-pulse">
									<MessageCircle className="w-8 h-8 mx-auto mb-2" />
									<div className="text-sm text-center">Active Community</div>
								</div>
								<div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-4 shadow-lg animate-bounce">
									<Users className="w-8 h-8 mx-auto mb-2" />
									<div className="text-sm text-center">Global Network</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features for Founders */}
				<section id="founder-features" className="bg-white py-20">
					<div className="max-w-7xl mx-auto px-6">
						<div className="grid lg:grid-cols-2 gap-16 items-center">
							<div className="order-2 lg:order-1 relative">
								<div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
									<Image
										src="/founder.png?height=400&width=500"
										alt="Founder Dashboard"
										width={500}
										height={400}
										className="rounded-2xl"
									/>
								</div>
								{/* Community indicators */}
								<div className="absolute -top-6 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 shadow-lg animate-pulse">
									<Star className="w-8 h-8 mx-auto mb-2" />
									<div className="text-sm text-center">Community Support</div>
								</div>
								<div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-4 shadow-lg animate-bounce">
									<Rocket className="w-8 h-8 mx-auto mb-2" />
									<div className="text-sm text-center">Launch Together</div>
								</div>
							</div>

							<div className="order-1 lg:order-2">
								<div className="flex items-center gap-3 mb-6">
									<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3">
										<Rocket className="text-white w-6 h-6" />
									</div>
									<h2 className="text-4xl font-bold text-indigo-900">
										For Founders
									</h2>
								</div>
								<p className="text-xl text-indigo-700 mb-8">
									Showcase your startup, connect with the right investors, and
									accelerate your fundraising journey.
								</p>

								<div className="space-y-6">
									{[
										{
											icon: Rocket,
											title: "Launch Your Campaign",
											description:
												"Create compelling pitch presentations and showcase your startup to active investors.",
											color: "purple",
										},
										{
											icon: Target,
											title: "Targeted Matching",
											description:
												"Get matched with investors who have a proven track record in your industry and stage.",
											color: "indigo",
										},
										{
											icon: MessageCircle,
											title: "Direct Communication",
											description:
												"Skip the gatekeepers and communicate directly with decision-makers through secure messaging.",
											color: "blue",
										},
									].map((feature, index) => {
										const IconComponent = feature.icon;
										return (
											<div
												key={index}
												className="flex gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
											>
												<div
													className={`bg-${feature.color}-100 rounded-lg p-3 flex-shrink-0`}
												>
													<IconComponent
														className={`w-6 h-6 text-${feature.color}-600`}
													/>
												</div>
												<div>
													<h3 className="font-semibold text-indigo-900 mb-2">
														{feature.title}
													</h3>
													<p className="text-indigo-700 text-sm">
														{feature.description}
													</p>
												</div>
											</div>
										);
									})}
								</div>

								<div className="mt-8">
									<Link href="/signup/user?type=Founder">
										<Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
											Start Fundraising
											<ChevronRight className="ml-2 w-5 h-5" />
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Testimonials
        <section className="bg-gradient-to-br from-indigo-900 to-purple-900 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Loved by Our Community</h2>
              <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
                See what our community members are saying about their experience on Unikorn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-indigo-200 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/90 italic">"{testimonial.quote}"</p>
                  <div className="flex text-yellow-400 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

				{/* CTA Section */}
				<section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20">
					<div className="max-w-4xl mx-auto px-6 text-center">
						<h2 className="text-4xl font-bold text-white mb-6">
							Ready to Transform Your Investment Journey?
						</h2>
						<p className="text-xl text-purple-100 mb-8">
							Join thousands of investors and founders who are already building
							the future together
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link href="/signup/user">
								<Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
									Join as Investor
								</Button>
							</Link>
							<Link href="/signup/user?type=Founder">
								<Button
									variant="outline"
									className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent"
								>
									Join as Founder
								</Button>
							</Link>
							<Link href="/signup/company">
								<Button
									variant="outline"
									className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent"
								>
									Join as Business
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>

			<footer className="bg-indigo-900 text-white py-12">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid md:grid-cols-4 gap-8 mb-8">
						<div>
							<div className="flex items-center space-x-2 mb-4">
								<div className="rounded-lg">
									<Image
										src="/unikorn_logo2.png"
										alt="Unikorn Logo"
										width={40}
										height={40}
									/>
								</div>
								<span className="text-2xl font-bold">Unikorn</span>
							</div>
							<p className="text-indigo-200">
								Connecting innovation with investment opportunities worldwide.
							</p>
						</div>
						<div>
							<h3 className="font-semibold mb-4">For Investors</h3>
							<ul className="space-y-2 text-indigo-200">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Browse Startups
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Investment Tools
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Portfolio Tracking
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">For Founders</h3>
							<ul className="space-y-2 text-indigo-200">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Create Campaign
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Find Investors
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Resources
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Company</h3>
							<ul className="space-y-2 text-indigo-200">
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										About Us
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Contact
									</Link>
								</li>
								<li>
									<Link href="#" className="hover:text-white transition-colors">
										Careers
									</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-indigo-800 pt-8 flex flex-col md:flex-row justify-between items-center">
						<p className="text-indigo-200 mb-4 md:mb-0">
							© 2025 Unikorn. All rights reserved.
						</p>
						<div className="flex space-x-6">
							{/* <Link href="#" className="text-indigo-200 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-indigo-200 hover:text-white transition-colors">
                Terms of Service
              </Link> */}
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
