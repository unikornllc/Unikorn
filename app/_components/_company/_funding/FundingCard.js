"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/app/_components/_ui/Card";
import { Badge } from "@/app/_components/_ui/Badge";
import { Button } from "@/app/_components/_ui/Button";
import Link from "next/link";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import { FundingCardForm } from "./FundingCardForm";
import { ChevronDown, ChevronUp, Info, Users } from "lucide-react";
import { formatCurrency } from "@/app/_utils/utils";

export function FundingCard({ fundraising, id, onMakeOffer, onViewDetails }) {
	const [expanded, setExpanded] = useState(false);

	const progress =
		((fundraising.totalPortions - fundraising.remainingPortions) /
			fundraising.totalPortions) *
		100;

	const portionEquity =
		fundraising.equityPercentage / fundraising.totalPortions;

	const remainingEquity = portionEquity * fundraising.remainingPortions;

	return (
		<Card
			id={id}
			className="overflow-hidden hover:border-primary/50 transition-all hover:shadow-md"
		>
			<div className="relative">
				<div className="p-6 pb-4">
					<div className="flex justify-between items-start mb-4">
						<div>
							<h3 className="text-xl font-bold mb-1">
								{fundraising.company?.name}
							</h3>
							<Badge variant="outline" className="mb-2">
								{fundraising.company?.industry}
							</Badge>
						</div>
						<Badge
							variant="secondary"
							className={`
                ${
									progress >= 75
										? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
										: progress >= 50
											? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
											: "bg-primary/10 text-primary hover:bg-primary/20"
								}
              `}
						>
							{progress >= 75
								? "Almost Funded"
								: progress >= 50
									? "Funding Well"
									: "New Opportunity"}
						</Badge>
					</div>

					<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
						{fundraising.company?.description}
					</p>

					<div>
						<div className="flex justify-between text-sm mb-1">
							<span>Funding Progress</span>
							<span className="font-medium">{Math.round(progress)}%</span>
						</div>
						<div className="w-full h-2 bg-muted rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full ${
									progress >= 75
										? "bg-amber-500"
										: progress >= 50
											? "bg-emerald-500"
											: "bg-primary"
								}`}
								style={{ width: `${progress}%` }}
							></div>
						</div>
					</div>
				</div>

				<div className="px-6 pb-4">
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p className="text-muted-foreground">Total Equity</p>
							<p className="font-semibold">{fundraising.equityPercentage}%</p>
						</div>
						<div>
							<p className="text-muted-foreground">Funding Amount</p>
							<p className="font-semibold">
								{formatCurrency(fundraising.fundingAmount)}
							</p>
						</div>
						<div>
							<p className="text-muted-foreground">Price Per Portion</p>
							<p className="font-semibold">
								{formatCurrency(fundraising.pricePerPortion)}
							</p>
						</div>
						<div>
							<p className="text-muted-foreground">Available Portions</p>
							<p className="font-semibold">
								{fundraising.remainingPortions} of {fundraising.totalPortions}
							</p>
						</div>
					</div>
				</div>

				{onViewDetails ? (
					<div className="px-6 pb-4">
						<Button
							variant="ghost"
							className="w-full flex items-center justify-center border border-border"
							onClick={() => setExpanded(!expanded)}
						>
							{expanded ? (
								<>
									<ChevronUp className="h-4 w-4 mr-2" />
									Hide Details
								</>
							) : (
								<>
									<ChevronDown className="h-4 w-4 mr-2" />
									View Details
								</>
							)}
						</Button>
					</div>
				) : (
					<div className="px-6 pb-4">
						<Button
							variant="ghost"
							className="w-full flex items-center justify-center border border-border"
						>
							<Link href={"/companies/" + fundraising.id}>
								View Funding Round
							</Link>
						</Button>
					</div>
				)}

				{expanded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<div className="border-t border-border">
							<Tabs defaultValue="invest" className="w-full">
								<TabsList className="w-full grid grid-cols-3">
									<TabsTrigger value="invest">Invest</TabsTrigger>
									<TabsTrigger value="company">Company</TabsTrigger>
									{/* <TabsTrigger value="investors">Investors</TabsTrigger> */}
									<TabsTrigger value="faqs">FAQs</TabsTrigger>
								</TabsList>

								<TabsContent value="invest" className="p-6">
									<FundingCardForm
										fundraising={fundraising}
										portionEquity={portionEquity}
										remainingEquity={remainingEquity}
									/>
								</TabsContent>

								<TabsContent value="company" className="p-6">
									<div className="space-y-4">
										<div>
											<h4 className="text-sm font-medium mb-2 flex items-center">
												<Info className="h-4 w-4 mr-2 text-muted-foreground" />
												About {fundraising.company.name}
											</h4>
											<p className="text-sm">
												{fundraising.company.description}
											</p>
										</div>

										<div className="grid grid-cols-2 gap-4 text-sm">
											<div>
												<p className="text-muted-foreground">Founded</p>
												<p className="font-medium">
													{new Date(fundraising.company.founded).getFullYear()}
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">Headquarters</p>
												<p className="font-medium">
													{fundraising.company.hqLocation}
												</p>
											</div>
											<div>
												<p className="text-muted-foreground">Website</p>
												<a
													href={fundraising.company.website}
													target="_blank"
													rel="noopener noreferrer"
													className="font-medium text-primary hover:underline"
												>
													Visit Website
												</a>
											</div>
											<div>
												<p className="text-muted-foreground">Company Type</p>
												<p className="font-medium">
													{fundraising.company.type}
												</p>
											</div>
										</div>

										<Button
											variant="outline"
											className="w-full"
											onClick={onViewDetails}
										>
											View Full Company Profile
										</Button>
									</div>
								</TabsContent>

								{/* <TabsContent value="investors" className="p-6">
									<div className="space-y-4">
										<div className="flex items-center">
											<Users className="h-5 w-5 mr-2 text-muted-foreground" />
											<h4 className="text-sm font-medium">Current Investors</h4>
										</div>

										{fundraising.fundraisers &&
										fundraising.fundraisers.length > 0 ? (
											<div className="space-y-3">
												{fundraising.fundraisers.map((fundraiser) => (
													<div
														key={fundraiser.id}
														className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
													>
														<div>
															<p className="font-medium">
																{fundraiser.investorType === "User"
																	? fundraiser.investorUser?.name
																	: fundraiser.investorCompany?.name}
															</p>
															<p className="text-xs text-muted-foreground">
																{new Date(fundraiser.date).toLocaleDateString()}
															</p>
														</div>
														<div className="text-right">
															<p className="font-medium">
																{fundraiser.equityPercentage}%
															</p>
															<p className="text-xs text-muted-foreground">
																{formatCurrency(fundraiser.fundingAmount)}
															</p>
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="text-center py-6 bg-muted/30 rounded-md">
												<p className="text-muted-foreground">
													No investors yet
												</p>
												<p className="text-sm">Be the first to invest!</p>
											</div>
										)}

										<Button className="w-full" onClick={onMakeOffer}>
                      Invest Now
                    </Button>
									</div>
								</TabsContent> */}
								<TabsContent value="faqs" className="p-6">
									<div className="space-y-4">
										<div>
											<h4 className="font-medium">How does investing work?</h4>
											<p className="text-sm text-muted-foreground mt-1">
												You can invest by purchasing portions at the fixed price
												or by making an offer. Each portion represents a
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
											<h4 className="font-medium">Can I sell my investment?</h4>
											<p className="text-sm text-muted-foreground mt-1">
												Yes, you can sell your investment to other users on the
												platform once the initial fundraising round is complete.
											</p>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</motion.div>
				)}
			</div>
			{/* <div className="px-6 pb-6 flex space-x-2">
				<Button className="flex-1" onClick={onViewDetails}>
					View Details
				</Button>
				<Button variant="outline" className="flex-1" onClick={onMakeOffer}>
					Make Offer
				</Button>
			</div> */}
		</Card>
	);
}
