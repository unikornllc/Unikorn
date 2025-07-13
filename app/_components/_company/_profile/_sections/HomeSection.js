"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import { Label } from "@/app/_components/_ui/Label";
import { Input } from "@/app/_components/_ui/Input";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { formatDate, formatCurrency } from "@/app/_utils/utils";
import { BarChart3, TrendingUp, Award, Edit, Plus } from "lucide-react";
import MutualFollowers from "@/app/_components/_company/_profile/MutualFollowers";

import { useRouter } from "next/navigation";

import {
	fetchCompanyFinancialInfo,
	fetchCompanyActiveRaisingFunds,
} from "@/app/_utils/_api/companyAPIs";

export default function HomeSection({ company, isOwner }) {
	const [loading, setLoading] = useState(true);

	const [activities, setActivities] = useState(company.activities || []);

	const [companyOverview, setCompanyOverview] = useState({
		founded: company.founded,
		hqLocation: company.hqLocation,
		type: company.type,
		website: company.website,
		companySize: company.companySize,
		industry: company.industry || [],
	});

	const [financialInfo, setFinancialInfo] = useState({
		valuation: company.financials?.valuation || 0,
		totalFundingAmount: company.financials?.totalFundingAmount || 0,
		investors: company.financials?.investors?.join(", ") || "",
	});

	const [activeFundraising, setActiveFundraising] = useState(null);

	const router = useRouter();

	useEffect(() => {
		const fetchFinancials = async () => {
			try {
				const response = await fetchCompanyFinancialInfo(company.username);
				if (response.financials) {
					setFinancialInfo({
						valuation: response.financials?.valuation || 0,
						totalFundingAmount: response.financials?.totalFundingAmount || 0,
						investors: response.financials?.investors?.join(", ") || "",
						fundingRounds: response.financials?.fundingRounds || [],
					});
				}
				const response2 = await fetchCompanyActiveRaisingFunds(
					company.username,
				);
				if (response2.activeFundraising) {
					setActiveFundraising(response2.activeFundraising);
				}
			} catch (error) {
				console.error(
					"Error fetching financials or active fundraising:",
					error,
				);
			} finally {
				setLoading(false);
			}
		};
		fetchFinancials();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2 space-y-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Company Overview</CardTitle>
							<CardDescription>
								Key information about {company.name}
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">Founded</h3>
									<p className="text-lg">{formatDate(company.founded)}</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Headquarters
									</h3>
									<p className="text-lg">
										{company.hqLocation || "Not specified"}
									</p>
								</div>
								{/* <div>
									<h3 className="text-sm font-medium text-gray-500">
										Company Type
									</h3>
									<p className="text-lg">{company.type}</p>
								</div> */}
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Industry
									</h3>
									<div className="flex flex-wrap gap-2 mt-1">
										{Array.isArray(company.industry) ? (
											company.industry.map((industry, index) => (
												<Badge key={index} variant="secondary">
													{industry}
												</Badge>
											))
										) : (
											<p className="text-lg">Not specified</p>
										)}
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<div>
									<h3 className="text-sm font-medium text-gray-500">Website</h3>
									<p className="text-lg">
										<Link
											href={company.website}
											target="_blank"
											className="text-blue-600 hover:underline"
										>
											{company.website.replace(/^https?:\/\//, "")}
										</Link>
									</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Company Size
									</h3>
									<p className="text-lg">{companyOverview.companySize}</p>
								</div>
								{/* <div>
									<h3 className="text-sm font-medium text-gray-500">
										Industries
									</h3>
									<div className="flex flex-wrap gap-2 mt-1">
										{companyOverview.industry.map((industry, index) => {
											return (
												<Badge variant="secondary" key={index}>
													{industry}
												</Badge>
											);
										})}
									</div>
								</div> */}
							</div>
						</div>
					</CardContent>
				</Card>
				{/* </LoadingWrapper> */}

				{/* Recent Activities */}
				{/* <LoadingWrapper sectionName="home-activities"> */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Recent Activities</CardTitle>
							<CardDescription>
								Latest updates from {company.name}
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{activities && activities.length > 0 ? (
								activities.map((activity) => (
									<div key={activity.id} className="flex gap-4">
										<div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
											<Award className="h-6 w-6" />
										</div>
										<div>
											<h3 className="font-medium">{activity.title}</h3>
											<p className="text-gray-600 mt-1">
												{activity.description}
											</p>
											<p className="text-sm text-gray-400 mt-2">
												{formatDate(activity.date || new Date())}
											</p>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									<p>No recent activities to display</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
				{/* </LoadingWrapper> */}

				{/* Key People */}
				{/* <LoadingWrapper sectionName="home-people"> */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Key People</CardTitle>
							<CardDescription>Leadership and key personnel</CardDescription>
						</div>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{company.personnel && company.personnel.length > 0 ? (
								company.personnel.map((person) => (
									<div key={person.id} className="flex items-center gap-4">
										<Avatar className="h-12 w-12">
											<AvatarImage src="/placeholder.png" alt={person.name} />
											<AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
										</Avatar>
										<div>
											<h3 className="font-medium">{person.name}</h3>
											<p className="text-sm text-gray-500">{person.role}</p>
											{person.username && (
												<Link
													href={`/user/profile/${person.username}`}
													target="_blank"
													className="text-xs text-blue-600 hover:underline"
												>
													View Profile
												</Link>
											)}
										</div>
									</div>
								))
							) : (
								<div className="col-span-2 text-center py-8 text-gray-500">
									<p>No key people added yet</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
				{/* </LoadingWrapper> */}
			</div>

			<div className="space-y-6">
				{/* Funding Summary */}
				{/* <LoadingWrapper
					sectionName="home-funding"
					skeletonType="cardWithHeader"
				> */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Funding Summary</CardTitle>
					</CardHeader>
					<CardContent>
						{company.financials ? (
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-gray-500">Total Funding</span>
									<span className="font-medium">
										{formatCurrency(company.financials.totalFundingAmount)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-500">Valuation</span>
									<span className="font-medium">
										{formatCurrency(company.financials.valuation)}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-500">Investors</span>
									<span className="font-medium">
										{company.financials.investors.length}
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-gray-500">Latest Round</span>
									<span className="font-medium">
										{company.financials.fundingRounds &&
										company.financials.fundingRounds.length > 0
											? company.financials.fundingRounds[0].type
											: "None"}
									</span>
								</div>
								<Button variant="outline" className="w-full mt-2">
									<BarChart3 className="h-4 w-4 mr-2" />
									View Full Financials
								</Button>
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<p>No financial information available</p>
							</div>
						)}
					</CardContent>
				</Card>
				{/* </LoadingWrapper> */}

				{/* Raising Funds */}
				{/* <LoadingWrapper
					sectionName="home-raising-funds"
					skeletonType="cardWithHeader"
				> */}
				<Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
					<CardHeader>
						<CardTitle className="text-purple-800">Raising Funds</CardTitle>
					</CardHeader>
					<CardContent>
						{activeFundraising ? (
							<div className="space-y-4">
								<div className="bg-white rounded-lg p-4 border border-purple-200">
									<div className="flex items-center justify-between mb-2">
										<span className="text-gray-500">Equity Offered</span>
										<span className="font-medium">
											{activeFundraising.equityPercentage}%
										</span>
									</div>
									<div className="flex items-center justify-between mb-2">
										<span className="text-gray-500">Funding Goal</span>
										<span className="font-medium">
											{formatCurrency(activeFundraising.fundingAmount)}
										</span>
									</div>
									<div className="flex items-center justify-between mb-2">
										<span className="text-gray-500">Price Per Portion</span>
										<span className="font-medium">
											{formatCurrency(activeFundraising.pricePerPortion)}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-gray-500">Portions Available</span>
										<span className="font-medium">
											{activeFundraising.remainingPortions}/
											{activeFundraising.totalPortions}
										</span>
									</div>
								</div>
								<Button
									className="w-full bg-purple-600 hover:bg-purple-700"
									onClick={() => {
										router.push("/companies/" + activeFundraising.id);
									}}
								>
									<TrendingUp className="h-4 w-4 mr-2" />
									Invest Now
								</Button>
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<p>Not currently raising funds</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* <MutualFollowers /> */}
			</div>
		</div>
	);
}
