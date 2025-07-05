"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/app/_components/_ui/Button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import { Progress } from "@/app/_components/_ui/Progress";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";

import { FundingCardForm } from "@/app/_components/_company/_funding/FundingCardForm";

import {
	Loader2,
	ArrowLeft,
	Building,
	Users,
	DollarSign,
	Calendar,
	Globe,
	MapPin,
	TrendingUp,
	Target,
	Clock,
	Shield,
	Award,
	Briefcase,
	ExternalLink,
	Share2,
	Heart,
	AlertCircle,
	CheckCircle2,
	Info,
	Sparkles,
} from "lucide-react";
import { useToast } from "@/app/_components/_hooks/useToast";
import { formatCurrency } from "@/app/_utils/utils";

export default function FundraisingDetailsPage() {
	const [fundraising, setFundraising] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isBookmarked, setIsBookmarked] = useState(false);
	const router = useRouter();
	const params = useParams();
	const { toast } = useToast();

	useEffect(() => {
		const fetchFundraising = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/id`,
					{
						params: { id: params.id },
						withCredentials: true,
					},
				);

				if (response.data) {
					setFundraising(response.data);
				} else {
					setError("Fundraising opportunity not found");
				}
			} catch (error) {
				console.error("Error fetching fundraising details:", error);
				setError(
					error.response?.data?.message || "Failed to load fundraising details",
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (params.id) {
			fetchFundraising();
		}
	}, [params.id]);

	// const handleBookmark = () => {
	// 	setIsBookmarked(!isBookmarked);
	// 	toast({
	// 		title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
	// 		description: isBookmarked
	// 			? "This opportunity has been removed from your bookmarks"
	// 			: "This opportunity has been saved to your bookmarks",
	// 	});
	// };

	const handleShare = async () => {
		const url = `${process.env.NEXT_PUBLIC_FRONTEND || window.location.origin}/companies/${params.id}`;

		if (navigator.share) {
			try {
				await navigator.share({
					title: `Investment Opportunity - ${fundraising?.company?.name}`,
					text: `Check out this investment opportunity from ${fundraising?.company?.name}`,
					url: url,
				});
			} catch (error) {
				console.error("Error sharing:", error);
			}
		} else {
			try {
				await navigator.clipboard.writeText(url);
				toast({
					title: "Link copied!",
					description:
						"The investment opportunity link has been copied to your clipboard",
				});
			} catch (error) {
				toast({
					title: "Share",
					description: `Share this link: ${url}`,
				});
			}
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg">
						Loading fundraising details...
					</p>
					<p className="text-gray-500 text-sm mt-2">
						This may take a few moments
					</p>
				</div>
			</div>
		);
	}

	if (error || !fundraising) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
				<Card className="max-w-md mx-auto border-destructive/20 bg-destructive/5">
					<CardContent className="p-8 text-center">
						<AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
						<h2 className="text-2xl font-semibold mb-2">
							Opportunity Not Found
						</h2>
						<p className="text-muted-foreground mb-6">
							{error ||
								"This investment opportunity is no longer available or doesn't exist."}
						</p>
						<div className="flex flex-col sm:flex-row gap-3">
							<Button
								variant="outline"
								onClick={() => router.push("/companies")}
							>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Opportunities
							</Button>
							<Button onClick={() => window.location.reload()}>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const progress = fundraising
		? ((fundraising.totalPortions - fundraising.remainingPortions) /
				fundraising.totalPortions) *
			100
		: 0;

	const portionEquity = fundraising
		? fundraising.equityPercentage / fundraising.totalPortions
		: 0;

	const remainingEquity = fundraising
		? portionEquity * fundraising.remainingPortions
		: 0;

	const raisedAmount = fundraising
		? fundraising.pricePerPortion *
			(fundraising.totalPortions - fundraising.remainingPortions)
		: 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
			{/* Enhanced Header */}
			<div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							onClick={() => router.push("/companies")}
							className="hover:bg-primary/10"
						>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Opportunities
						</Button>

						<div className="flex items-center gap-2">
							{/* <Button
								variant="outline"
								size="sm"
								onClick={handleBookmark}
								className={
									isBookmarked ? "bg-primary/10 border-primary/20" : ""
								}
							>
								<Heart
									className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current text-primary" : ""}`}
								/>
								{isBookmarked ? "Bookmarked" : "Bookmark"}
							</Button> */}
							<Button variant="outline" size="sm" onClick={handleShare}>
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
					{/* Left Column - Company Info */}
					<div className="xl:col-span-1 space-y-6">
						{/* Company Header Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
								<CardHeader className="pb-4">
									<div className="flex items-start justify-between">
										<div className="flex items-center space-x-4">
											<Avatar className="h-16 w-16 border-2 border-primary/20">
												<AvatarImage
													src={fundraising.company?.logo || "/placeholder.svg"}
												/>
												<AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
													{fundraising.company?.name?.charAt(0) || "C"}
												</AvatarFallback>
											</Avatar>
											<div>
												<CardTitle className="text-2xl mb-2">
													{fundraising.company?.name || "Company Name"}
												</CardTitle>
												<Badge variant="secondary" className="mb-2">
													<Building className="h-3 w-3 mr-1" />
													{fundraising.company?.industry || "Industry"}
												</Badge>
											</div>
										</div>
										<div className="text-right">
											<div className="flex items-center text-sm text-muted-foreground mb-1">
												<CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />
												Verified
											</div>
											<Badge
												variant={
													progress >= 75
														? "default"
														: progress >= 50
															? "secondary"
															: "outline"
												}
												className="text-xs"
											>
												{progress >= 75
													? "🔥 Hot Deal"
													: progress >= 50
														? "📈 Trending"
														: "🆕 New"}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground mb-6 leading-relaxed">
										{fundraising.company?.description ||
											"Company description not available"}
									</p>

									<div className="space-y-4">
										{[
											{
												icon: MapPin,
												label: "Headquarters",
												value:
													fundraising.company?.hqLocation ||
													"Location not specified",
											},
											{
												icon: Calendar,
												label: "Founded",
												value: fundraising.company?.founded
													? new Date(fundraising.company.founded).getFullYear()
													: "Not specified",
											},
											{
												icon: Users,
												label: "Company Type",
												value: fundraising.company?.type || "Not specified",
											},
										].map((item, index) => (
											<div key={index} className="flex items-center space-x-3">
												<div className="p-2 rounded-lg bg-primary/10">
													<item.icon className="h-4 w-4 text-primary" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{item.label}
													</p>
													<p className="font-medium">{item.value}</p>
												</div>
											</div>
										))}
									</div>

									{fundraising.company?.account?.username && (
										<div className="mt-6">
											<Button
												variant="outline"
												className="w-full bg-transparent"
												asChild
											>
												<a
													href={`/company/profile/${fundraising.company?.account?.username}`}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center justify-center"
												>
													<Globe className="h-4 w-4 mr-2" />
													Visit Profile
													<ExternalLink className="h-3 w-3 ml-2" />
												</a>
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>

						{/* Funding Progress Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
						>
							<Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-background to-emerald-500/5">
								<CardHeader>
									<CardTitle className="flex items-center">
										<TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
										Funding Progress
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="flex justify-between text-sm mb-2">
												<span className="text-muted-foreground">Progress</span>
												<span className="font-bold text-lg">
													{Math.round(progress)}%
												</span>
											</div>
											<Progress value={progress} className="h-3" />
											<div className="flex justify-between text-xs mt-2 text-muted-foreground">
												<span>
													{fundraising.totalPortions -
														fundraising.remainingPortions}{" "}
													portions sold
												</span>
												<span>{fundraising.remainingPortions} remaining</span>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-4 pt-4 border-t">
											<div className="text-center">
												<p className="text-sm text-muted-foreground mb-1">
													Funding Goal
												</p>
												<p className="text-xl font-bold text-emerald-600">
													{formatCurrency(fundraising.fundingAmount)}
												</p>
											</div>
											<div className="text-center">
												<p className="text-sm text-muted-foreground mb-1">
													Amount Raised
												</p>
												<p className="text-xl font-bold text-primary">
													{formatCurrency(raisedAmount)}
												</p>
											</div>
											<div className="text-center">
												<p className="text-sm text-muted-foreground mb-1">
													Equity Offered
												</p>
												<p className="text-xl font-bold">
													{fundraising.equityPercentage}%
												</p>
											</div>
											<div className="text-center">
												<p className="text-sm text-muted-foreground mb-1">
													Equity Remaining
												</p>
												<p className="text-xl font-bold">
													{remainingEquity.toFixed(2)}%
												</p>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Key Metrics Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
						>
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center">
										<Target className="h-5 w-5 mr-2 text-primary" />
										Key Metrics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{[
											{
												label: "Company Valuation",
												value: formatCurrency(
													fundraising.fundingAmount /
														(fundraising.equityPercentage / 100),
												),
												icon: Award,
											},
											{
												label: "Price per Equity Point",
												value: formatCurrency(
													fundraising.fundingAmount /
														fundraising.equityPercentage,
												),
												icon: DollarSign,
											},
											{
												label: "Investment Term",
												value: "5 years",
												icon: Clock,
											},
											{
												label: "Funding Round",
												value: "Series A",
												icon: Briefcase,
											},
										].map((metric, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
											>
												<div className="flex items-center space-x-3">
													<metric.icon className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm text-muted-foreground">
														{metric.label}
													</span>
												</div>
												<span className="font-semibold">{metric.value}</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Right Column - Investment Details */}
					<div className="xl:col-span-2">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<Card className="h-full border-2 border-primary/20">
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="text-2xl flex items-center">
											<Sparkles className="h-6 w-6 mr-2 text-primary" />
											Investment Opportunity
										</CardTitle>
										<Badge variant="outline" className="text-sm">
											<Shield className="h-3 w-3 mr-1" />
											Secure Investment
										</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<Tabs defaultValue="invest" className="h-full">
										<TabsList className="grid grid-cols-3 mb-8 h-12">
											<TabsTrigger value="invest" className="text-sm">
												💰 Invest Now
											</TabsTrigger>
											<TabsTrigger value="metrics" className="text-sm">
												📊 Financial Data
											</TabsTrigger>
											<TabsTrigger value="faqs" className="text-sm">
												❓ FAQ
											</TabsTrigger>
										</TabsList>

										<TabsContent value="invest" className="space-y-6">
											{/* Investment Summary */}
											<div className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
												<h3 className="text-xl font-semibold mb-4 flex items-center">
													<Info className="h-5 w-5 mr-2 text-primary" />
													Investment Summary
												</h3>
												<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
													{[
														{
															label: "Price Per Portion",
															value: formatCurrency(
																fundraising.pricePerPortion,
															),
															highlight: true,
														},
														{
															label: "Equity Per Portion",
															value: `${portionEquity.toFixed(3)}%`,
															highlight: true,
														},
														{
															label: "Available Portions",
															value:
																fundraising.remainingPortions.toLocaleString(),
														},
														{
															label: "Total Portions",
															value: fundraising.totalPortions.toLocaleString(),
														},
													].map((item, index) => (
														<div key={index} className="text-center">
															<p className="text-sm text-muted-foreground mb-1">
																{item.label}
															</p>
															<p
																className={`text-lg font-bold ${item.highlight ? "text-primary" : ""}`}
															>
																{item.value}
															</p>
														</div>
													))}
												</div>
											</div>

											{/* Investment Form */}
											<div className="bg-background rounded-xl border p-6">
												<FundingCardForm
													fundraising={fundraising}
													portionEquity={portionEquity}
													remainingEquity={remainingEquity}
													owner={fundraising.owner}
												/>
											</div>
										</TabsContent>

										<TabsContent value="metrics" className="space-y-6">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
												{/* Financial Metrics */}
												<Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
													<CardHeader>
														<CardTitle className="text-lg text-blue-700 dark:text-blue-300">
															💼 Financial Metrics
														</CardTitle>
													</CardHeader>
													<CardContent className="space-y-4">
														{[
															{
																label: "Company Valuation",
																value: formatCurrency(
																	fundraising.fundingAmount /
																		(fundraising.equityPercentage / 100),
																),
															},
															{
																label: "Price Per Equity Point",
																value: formatCurrency(
																	fundraising.fundingAmount /
																		fundraising.equityPercentage,
																),
															},
															{
																label: "Funding Round",
																value: "Series A",
															},
															{
																label: "Investment Term",
																value: "5 years",
															},
														].map((metric, index) => (
															<div
																key={index}
																className="flex justify-between items-center"
															>
																<span className="text-sm text-muted-foreground">
																	{metric.label}
																</span>
																<span className="font-semibold">
																	{metric.value}
																</span>
															</div>
														))}
													</CardContent>
												</Card>

												{/* Growth Projections */}
												<Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
													<CardHeader>
														<CardTitle className="text-lg text-emerald-700 dark:text-emerald-300">
															📈 Growth Projections
														</CardTitle>
													</CardHeader>
													<CardContent className="space-y-4">
														{[
															{
																label: "Year 1 Revenue Projection",
																value: formatCurrency(2500000),
															},
															{
																label: "Year 3 Revenue Projection",
																value: formatCurrency(8000000),
															},
															{
																label: "Projected Break Even",
																value: "Q4 2025",
															},
															{
																label: "Expected ROI",
																value: "15-25%",
															},
														].map((projection, index) => (
															<div
																key={index}
																className="flex justify-between items-center"
															>
																<span className="text-sm text-muted-foreground">
																	{projection.label}
																</span>
																<span className="font-semibold">
																	{projection.value}
																</span>
															</div>
														))}
													</CardContent>
												</Card>
											</div>

											{/* Risk Assessment */}
											<Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
												<CardHeader>
													<CardTitle className="text-lg text-amber-700 dark:text-amber-300">
														⚠️ Risk Assessment
													</CardTitle>
												</CardHeader>
												<CardContent>
													<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
														<div className="text-center">
															<div className="text-2xl font-bold text-emerald-600 mb-1">
																Low
															</div>
															<div className="text-sm text-muted-foreground">
																Market Risk
															</div>
														</div>
														<div className="text-center">
															<div className="text-2xl font-bold text-amber-600 mb-1">
																Medium
															</div>
															<div className="text-sm text-muted-foreground">
																Technology Risk
															</div>
														</div>
														<div className="text-center">
															<div className="text-2xl font-bold text-emerald-600 mb-1">
																Low
															</div>
															<div className="text-sm text-muted-foreground">
																Regulatory Risk
															</div>
														</div>
													</div>
												</CardContent>
											</Card>
										</TabsContent>

										<TabsContent value="faqs" className="space-y-6">
											<div className="space-y-6">
												{[
													{
														question: "How does investing work?",
														answer:
															"You can invest by purchasing portions at the fixed price or by making an offer. Each portion represents a percentage of equity in the company. Once your investment is confirmed, you'll receive a digital certificate representing your ownership stake.",
													},
													{
														question: "What happens after I invest?",
														answer:
															"After your investment is confirmed, you'll receive a digital certificate representing your equity stake in the company. You'll also gain access to investor-only updates and communications from the company.",
													},
													{
														question: "Can I sell my investment?",
														answer:
															"Yes, you can sell your investment to other users on the platform once the initial fundraising round is complete. We provide a marketplace for secondary sales to ensure liquidity.",
													},
													{
														question: "What are the risks involved?",
														answer:
															"Investing in startups involves risks, including the potential loss of your entire investment. We encourage you to do your own research and consult with a financial advisor before making any investment decisions.",
													},
												].map((faq, index) => (
													<div
														key={index}
														className="p-4 rounded-lg bg-muted/30"
													>
														<h4 className="font-medium text-lg">
															{faq.question}
														</h4>
														<p className="text-sm text-muted-foreground mt-2">
															{faq.answer}
														</p>
													</div>
												))}
											</div>
										</TabsContent>
									</Tabs>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="py-6 text-center text-muted-foreground border-t">
				<p>
					<Info className="inline-block h-4 w-4 mr-1 align-middle" />
					Investing involves risk. You could lose some or all of your money.
				</p>
			</div>
		</div>
	);
}
