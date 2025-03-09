"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
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

import { FundingCardForm } from "@/app/_components/_company/_funding/FundingCardForm";

import {
	Loader2,
	ArrowLeft,
	Building,
	Users,
	DollarSign,
	Calendar,
} from "lucide-react";
import { useToast } from "@/app/_components/_hooks/useToast";
import { formatCurrency } from "@/app/_utils/utils";

export default function FundraisingDetailsPage() {
	const [fundraising, setFundraising] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const params = useParams();
	const { toast } = useToast();

	useEffect(() => {
		const fetchFundraising = async () => {
			try {
				setIsLoading(true);
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/id`,
					{
						params: {
							id: params.id,
						},
						withCredentials: true,
					},
				);
				setFundraising(response.data);
			} catch (error) {
				console.error("Error fetching fundraising details:", error);
				toast({
					title: "Error",
					description: "Failed to load fundraising details",
					variant: "destructive",
				});

				setFundraising({
					id: params.id,
					company: {
						name: "Demo Company",
						description:
							"This is a demo company for showcasing the fundraising details page.",
						industry: "Technology",
						founded: "2020-01-01",
						hqLocation: "San Francisco, CA",
						website: "https://example.com",
						type: "Startup",
					},
					equityPercentage: 15,
					fundingAmount: 2000000,
					pricePerPortion: 50000,
					totalPortions: 40,
					remainingPortions: 20,
					date: new Date().toISOString(),
				});
			} finally {
				setIsLoading(false);
			}
		};

		fetchFundraising();
	}, [params.id]);

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

	if (isLoading) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
				<p className="text-lg text-muted-foreground">
					Loading fundraising details...
				</p>
			</div>
		);
	}

	if (!fundraising) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center">
				<p className="text-lg text-red-500 mb-4">Fundraising not found</p>
				<Button onClick={() => router.push("/companies")}>
					Back to Fundraising
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-10">
			<div className="container mx-auto px-4">
				<Button
					variant="ghost"
					className="mb-6"
					onClick={() => router.push("/companies")}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Fundraising
				</Button>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-2xl">
									{fundraising.company.name}
								</CardTitle>
								<Badge className="mt-2">{fundraising.company.industry}</Badge>
							</CardHeader>
							<CardContent>
								<p className="mb-6">{fundraising.company.description}</p>

								<div className="space-y-4">
									<div className="flex items-center">
										<Building className="h-5 w-5 mr-3 text-muted-foreground" />
										<div>
											<p className="text-sm text-muted-foreground">
												Headquarters
											</p>
											<p className="font-medium">
												{fundraising.company.hqLocation}
											</p>
										</div>
									</div>

									<div className="flex items-center">
										<Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
										<div>
											<p className="text-sm text-muted-foreground">Founded</p>
											<p className="font-medium">
												{new Date(fundraising.company.founded).getFullYear()}
											</p>
										</div>
									</div>

									<div className="flex items-center">
										<Users className="h-5 w-5 mr-3 text-muted-foreground" />
										<div>
											<p className="text-sm text-muted-foreground">
												Company Type
											</p>
											<p className="font-medium">{fundraising.company.type}</p>
										</div>
									</div>
								</div>

								<div className="mt-6">
									<Button variant="outline" className="w-full" asChild>
										<a
											href={fundraising.company.website}
											target="_blank"
											rel="noopener noreferrer"
										>
											Visit Website
										</a>
									</Button>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Funding Progress</CardTitle>
							</CardHeader>
							<CardContent>
								<div>
									<div className="flex justify-between text-sm mb-1">
										<span>Progress</span>
										<span className="font-medium">{Math.round(progress)}%</span>
									</div>
									<Progress value={progress} className="h-2" />
									<div className="flex justify-between text-sm mt-1">
										<span>
											{fundraising.totalPortions -
												fundraising.remainingPortions}{" "}
											portions sold
										</span>
										<span>{fundraising.remainingPortions} remaining</span>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4 mt-6">
									<div>
										<p className="text-sm text-muted-foreground">
											Funding Goal
										</p>
										<p className="font-semibold">
											{formatCurrency(fundraising.fundingAmount)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Funding Raised
										</p>
										<p className="font-semibold">
											{formatCurrency(
												fundraising.pricePerPortion *
													(fundraising.totalPortions -
														fundraising.remainingPortions) -
													(fundraising.totalPortions *
														fundraising.pricePerPortion -
														fundraising.fundingAmount),
											)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Equity Offered
										</p>
										<p className="font-semibold">
											{fundraising.equityPercentage}%
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Equity Remaining
										</p>
										<p className="font-semibold">
											{remainingEquity.toFixed(2)}%
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="lg:col-span-2">
						<Card className="h-full">
							<CardHeader>
								<CardTitle>Investment Details</CardTitle>
							</CardHeader>
							<CardContent>
								<Tabs defaultValue="invest" className="h-full">
									<TabsList className="grid grid-cols-3 mb-6">
										<TabsTrigger value="invest">Invest</TabsTrigger>
										<TabsTrigger value="metrics">Metrics</TabsTrigger>
										<TabsTrigger value="faqs">FAQs</TabsTrigger>
										{/* <TabsTrigger value="investors">Investors</TabsTrigger> */}
									</TabsList>

									<TabsContent value="invest">
										<div className="p-6 bg-muted/30 rounded-lg mb-6">
											<h3 className="text-lg font-semibold mb-2">
												Investment Summary
											</h3>
											<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
												<div>
													<p className="text-sm text-muted-foreground">
														Price Per Portion
													</p>
													<p className="text-lg font-bold">
														{formatCurrency(fundraising.pricePerPortion)}
													</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														Equity Per Portion
													</p>
													<p className="text-lg font-bold">
														{portionEquity.toFixed(2)}%
													</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														Available Portions
													</p>
													<p className="text-lg font-bold">
														{fundraising.remainingPortions}
													</p>
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														Total Portions
													</p>
													<p className="text-lg font-bold">
														{fundraising.totalPortions}
													</p>
												</div>
											</div>
										</div>

										<FundingCardForm
											fundraising={fundraising}
											portionEquity={portionEquity}
											remainingEquity={remainingEquity}
										/>
									</TabsContent>

									<TabsContent value="metrics">
										<div className="space-y-6">
											<div className="p-6 bg-muted/30 rounded-lg">
												<h3 className="text-lg font-semibold mb-4">
													Financial Metrics
												</h3>
												<div className="grid grid-cols-2 gap-6">
													<div>
														<p className="text-sm text-muted-foreground">
															Valuation
														</p>
														<p className="text-xl font-bold">
															{formatCurrency(
																fundraising.fundingAmount /
																	(fundraising.equityPercentage / 100),
															)}
														</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															Price Per Equity Point
														</p>
														<p className="text-xl font-bold">
															{formatCurrency(
																fundraising.fundingAmount /
																	fundraising.equityPercentage,
															)}
														</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															Funding Round
														</p>
														<p className="text-xl font-bold">Series A</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															Investment Term
														</p>
														<p className="text-xl font-bold">5 years</p>
													</div>
												</div>
											</div>

											<div className="p-6 bg-muted/30 rounded-lg">
												<h3 className="text-lg font-semibold mb-4">
													Growth Projections
												</h3>
												<div className="space-y-4">
													<div>
														<p className="text-sm text-muted-foreground">
															Year 1 Revenue Projection
														</p>
														<p className="text-xl font-bold">
															{formatCurrency(2500000)}
														</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															Year 3 Revenue Projection
														</p>
														<p className="text-xl font-bold">
															{formatCurrency(8000000)}
														</p>
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															Projected Break Even
														</p>
														<p className="text-xl font-bold">Q4 2025</p>
													</div>
												</div>
											</div>
										</div>
									</TabsContent>

									{/* <TabsContent value="investors">
										<div className="space-y-6">
											<div className="flex items-center">
												<DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
												<h3 className="text-lg font-semibold">
													Current Investors
												</h3>
											</div>

											{fundraising.fundraisers &&
											fundraising.fundraisers.length > 0 ? (
												<div className="space-y-3">
													{fundraising.fundraisers.map((investor) => (
														<div
															key={investor.id}
															className="flex justify-between p-4 bg-muted/30 rounded-lg"
														>
															<div>
																<p className="font-medium">
																	{investor.investorType === "User"
																		? investor.investorUser?.name
																		: investor.investorCompany?.name ||
																			"Anonymous Investor"}
																</p>
																<p className="text-sm text-muted-foreground">
																	Invested on{" "}
																	{new Date(investor.date).toLocaleDateString()}
																</p>
															</div>
															<div className="text-right">
																<p className="font-medium">
																	{formatCurrency(
																		investor.amount ||
																			investor.portions *
																				fundraising.pricePerPortion,
																	)}
																</p>
																<p className="text-sm text-muted-foreground">
																	{investor.portions || 1} portion(s)
																</p>
															</div>
														</div>
													))}
												</div>
											) : (
												<div className="text-center py-10 bg-muted/30 rounded-lg">
													<p className="text-lg font-medium">
														No investors yet
													</p>
													<p className="text-muted-foreground mt-2">
														Be the first to invest in this opportunity!
													</p>
													<Button className="mt-4">Invest Now</Button>
												</div>
											)}
										</div>
									</TabsContent> */}
									<TabsContent value="faqs" className="p-6">
										<div className="space-y-4">
											<div>
												<h4 className="font-medium">
													How does investing work?
												</h4>
												<p className="text-sm text-muted-foreground mt-1">
													You can invest by purchasing portions at the fixed
													price or by making an offer. Each portion represents a
													percentage of equity in the company.
												</p>
											</div>
											<div>
												<h4 className="font-medium">
													What happens after I invest?
												</h4>
												<p className="text-sm text-muted-foreground mt-1">
													After your investment is confirmed, you'll receive a
													digital certificate representing your equity stake in
													the company.
												</p>
											</div>
											<div>
												<h4 className="font-medium">
													Can I sell my investment?
												</h4>
												<p className="text-sm text-muted-foreground mt-1">
													Yes, you can sell your investment to other users on
													the platform once the initial fundraising round is
													complete.
												</p>
											</div>
										</div>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
