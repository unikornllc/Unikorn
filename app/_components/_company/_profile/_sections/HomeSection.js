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
// import { LoadingWrapper } from "@/app/_components/_ui/_loading/LoadingWrapper";
import {
	SkeletonText,
	SkeletonAvatar,
} from "@/app/_components/_ui/_loading/Skeleton";

export default function HomeSection({ company, isOwner, updateCompany }) {
	const [activities, setActivities] = useState(company.activities || []);
	const [isEditingOverview, setIsEditingOverview] = useState(false);
	const [isAddingActivity, setIsAddingActivity] = useState(false);
	const [isAddingPerson, setIsAddingPerson] = useState(false);
	const [isEditingFinancials, setIsEditingFinancials] = useState(false);

	const [companyOverview, setCompanyOverview] = useState({
		founded: company.founded || new Date().toISOString(),
		hqLocation: company.hqLocation || "",
		type: company.type || "Private",
		industry: company.industry || "",
		website: company.website || "https://example.com",
		companySize: "51-200 employees",
		specialties: ["SaaS", "Fintech", "AI", "Blockchain"],
	});

	const [newActivity, setNewActivity] = useState({
		title: "",
		description: "",
	});

	const [newPerson, setNewPerson] = useState({
		name: "",
		role: "Founder",
		crunchBaseLink: "",
	});

	const [financialInfo, setFinancialInfo] = useState({
		valuation: company.financials?.valuation || 0,
		totalFundingAmount: company.financials?.totalFundingAmount || 0,
		investors: company.financials?.investors?.join(", ") || "",
	});

	// Function to save company overview - replace with API call
	const handleSaveOverview = async () => {
		try {
			// Replace with actual API call
			// await axios.put(`/api/company/${company.id}/overview`, companyOverview);

			updateCompany({
				founded: companyOverview.founded,
				hqLocation: companyOverview.hqLocation,
				type: companyOverview.type,
				industry: companyOverview.industry,
				website: companyOverview.website,
			});

			setIsEditingOverview(false);
		} catch (error) {
			console.error("Error saving overview:", error);
		}
	};

	// Function to add activity - replace with API call
	const handleAddActivity = async () => {
		if (!newActivity.title || !newActivity.description) return;

		const activity = {
			id: Date.now().toString(),
			title: newActivity.title,
			description: newActivity.description,
			companyId: company.id,
			date: new Date(),
		};

		try {
			// Replace with actual API call
			// const response = await axios.post(`/api/company/${company.id}/activities`, activity);
			// const savedActivity = response.data;

			const updatedActivities = [activity].concat(activities);
			setActivities(updatedActivities);
			updateCompany({ activities: updatedActivities });

			setNewActivity({ title: "", description: "" });
			setIsAddingActivity(false);
		} catch (error) {
			console.error("Error adding activity:", error);
		}
	};

	// Function to add person - replace with API call
	const handleAddPerson = async () => {
		if (!newPerson.name || !newPerson.role) return;

		const person = {
			id: Date.now().toString(),
			name: newPerson.name,
			role: newPerson.role,
			crunchBaseLink: newPerson.crunchBaseLink,
			companyId: company.id,
		};

		try {
			// Replace with actual API call
			// const response = await axios.post(`/api/company/${company.id}/personnel`, person);
			// const savedPerson = response.data;

			const updatedPersonnel = (company.personnel || []).concat([person]);
			updateCompany({ personnel: updatedPersonnel });

			setNewPerson({ name: "", role: "Founder", crunchBaseLink: "" });
			setIsAddingPerson(false);
		} catch (error) {
			console.error("Error adding person:", error);
		}
	};

	// Function to save financials - replace with API call
	const handleSaveFinancials = async () => {
		const financials = {
			id: company.financials?.id || "f" + Date.now(),
			valuation: Number(financialInfo.valuation) || 0,
			totalFundingAmount: Number(financialInfo.totalFundingAmount) || 0,
			investors: financialInfo.investors
				.split(",")
				.map((i) => i.trim())
				.filter((i) => i),
			fundingRounds: company.financials?.fundingRounds || [],
			companyId: company.id,
		};

		try {
			// Replace with actual API call
			// const response = await axios.put(`/api/company/${company.id}/financials`, financials);
			// const savedFinancials = response.data;

			updateCompany({ financials: financials });
			setIsEditingFinancials(false);
		} catch (error) {
			console.error("Error saving financials:", error);
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2 space-y-6">
				{/* Company Overview */}
				{/* <LoadingWrapper sectionName="home-overview"> */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Company Overview</CardTitle>
							<CardDescription>
								Key information about {company.name}
							</CardDescription>
						</div>
						{isOwner && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setIsEditingOverview(true);
								}}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
						)}
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
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Company Type
									</h3>
									<p className="text-lg">{company.type}</p>
								</div>
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
									<p className="text-lg">51-200 employees</p>
								</div>
								<div>
									<h3 className="text-sm font-medium text-gray-500">
										Specialties
									</h3>
									<div className="flex flex-wrap gap-2 mt-1">
										<Badge variant="secondary">SaaS</Badge>
										<Badge variant="secondary">Fintech</Badge>
										<Badge variant="secondary">AI</Badge>
										<Badge variant="secondary">Blockchain</Badge>
									</div>
								</div>
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
						{isOwner && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setIsAddingActivity(true);
								}}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Activity
							</Button>
						)}
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
									{isOwner && (
										<Button
											variant="outline"
											className="mt-4"
											onClick={() => {
												setIsAddingActivity(true);
											}}
										>
											Add Your First Activity
										</Button>
									)}
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
						{isOwner && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setIsAddingPerson(true);
								}}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Person
							</Button>
						)}
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
									{isOwner && (
										<Button
											variant="outline"
											className="mt-4"
											onClick={() => {
												setIsAddingPerson(true);
											}}
										>
											Add Key Personnel
										</Button>
									)}
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
						{isOwner && (
							<Button
								variant="outline"
								size="sm"
								onClick={() => {
									setIsEditingFinancials(true);
								}}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit
							</Button>
						)}
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
								{isOwner && (
									<Button
										variant="outline"
										className="mt-4"
										onClick={() => {
											setIsEditingFinancials(true);
										}}
									>
										Add Financial Information
									</Button>
								)}
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
						{company.raisingFunds && company.raisingFunds.length > 0 ? (
							<div className="space-y-4">
								<div className="bg-white rounded-lg p-4 border border-purple-200">
									<div className="flex items-center justify-between mb-2">
										<span className="text-gray-500">Equity Offered</span>
										<span className="font-medium">
											{company.raisingFunds[0].equityPercentage}%
										</span>
									</div>
									<div className="flex items-center justify-between mb-2">
										<span className="text-gray-500">Funding Goal</span>
										<span className="font-medium">
											{formatCurrency(company.raisingFunds[0].fundingAmount)}
										</span>
									</div>
									<div className="flex items-center justify-between mb-2">
										<span className="text-gray-500">Price Per Portion</span>
										<span className="font-medium">
											{formatCurrency(company.raisingFunds[0].pricePerPortion)}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-gray-500">Portions Available</span>
										<span className="font-medium">
											{company.raisingFunds[0].remainingPortions}/
											{company.raisingFunds[0].totalPortions}
										</span>
									</div>
								</div>
								<Button className="w-full bg-purple-600 hover:bg-purple-700">
									<TrendingUp className="h-4 w-4 mr-2" />
									Invest Now
								</Button>
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<p>Not currently raising funds</p>
								{isOwner && (
									<Button variant="outline" className="mt-4">
										Start Fundraising
									</Button>
								)}
							</div>
						)}
					</CardContent>
				</Card>
				{/* </LoadingWrapper> */}

				{/* Mutual Followers */}
				{/* <LoadingWrapper sectionName="home-mutual-followers" skeletonType="card"> */}
				<MutualFollowers />
				{/* </LoadingWrapper> */}
			</div>

			{/* Edit Overview Dialog */}
			<Dialog open={isEditingOverview} onOpenChange={setIsEditingOverview}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Company Overview</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-location" className="text-right">
								Headquarters
							</Label>
							<Input
								id="company-location"
								value={companyOverview.hqLocation}
								onChange={(e) => {
									setCompanyOverview(
										Object.assign({}, companyOverview, {
											hqLocation: e.target.value,
										}),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-type" className="text-right">
								Company Type
							</Label>
							<select
								id="company-type"
								value={companyOverview.type}
								onChange={(e) => {
									setCompanyOverview(
										Object.assign({}, companyOverview, {
											type: e.target.value,
										}),
									);
								}}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Profit">Profit</option>
								<option value="NonProfit">NonProfit</option>
								<option value="Private">Private</option>
								<option value="Public">Public</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="company-industry" className="text-right pt-2">
								Industry
							</Label>
							<Textarea
								id="company-industry"
								value={
									Array.isArray(companyOverview.industry)
										? companyOverview.industry.join(", ")
										: ""
								}
								onChange={(e) =>
									setCompanyOverview({
										...companyOverview,
										industry: e.target.value
											.split(",")
											.map((item) => item.trim())
											.filter((item) => item),
									})
								}
								placeholder="Enter industries separated by commas (e.g. Nike, Adidas, New Balance)"
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-website" className="text-right">
								Website
							</Label>
							<Input
								id="company-website"
								value={companyOverview.website}
								onChange={(e) => {
									setCompanyOverview(
										Object.assign({}, companyOverview, {
											website: e.target.value,
										}),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-size" className="text-right">
								Company Size
							</Label>
							<select
								id="company-size"
								value={companyOverview.companySize}
								onChange={(e) => {
									setCompanyOverview(
										Object.assign({}, companyOverview, {
											companySize: e.target.value,
										}),
									);
								}}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="1-10 employees">1-10 employees</option>
								<option value="11-50 employees">11-50 employees</option>
								<option value="51-200 employees">51-200 employees</option>
								<option value="201-500 employees">201-500 employees</option>
								<option value="501+ employees">501+ employees</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsEditingOverview(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveOverview}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Activity Dialog */}
			<Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Activity</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="activity-title" className="text-right">
								Title
							</Label>
							<Input
								id="activity-title"
								value={newActivity.title}
								onChange={(e) => {
									setNewActivity(
										Object.assign({}, newActivity, { title: e.target.value }),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="activity-description" className="text-right pt-2">
								Description
							</Label>
							<Textarea
								id="activity-description"
								value={newActivity.description}
								onChange={(e) => {
									setNewActivity(
										Object.assign({}, newActivity, {
											description: e.target.value,
										}),
									);
								}}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsAddingActivity(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleAddActivity}>Add Activity</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Person Dialog */}
			<Dialog open={isAddingPerson} onOpenChange={setIsAddingPerson}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Key Person</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="person-name" className="text-right">
								Name
							</Label>
							<Input
								id="person-name"
								value={newPerson.name}
								onChange={(e) => {
									setNewPerson(
										Object.assign({}, newPerson, { name: e.target.value }),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="person-role" className="text-right">
								Role
							</Label>
							<select
								id="person-role"
								value={newPerson.role}
								onChange={(e) => {
									setNewPerson(
										Object.assign({}, newPerson, { role: e.target.value }),
									);
								}}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Founder">Founder</option>
								<option value="Advisor">Advisor</option>
								<option value="BoardMember">Board Member</option>
								<option value="KeyEmployee">Key Employee</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="person-crunchbase" className="text-right">
								CrunchBase Link
							</Label>
							<Input
								id="person-crunchbase"
								value={newPerson.crunchBaseLink}
								onChange={(e) => {
									setNewPerson(
										Object.assign({}, newPerson, {
											crunchBaseLink: e.target.value,
										}),
									);
								}}
								placeholder="https://crunchbase.com/person/name"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsAddingPerson(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleAddPerson}>Add Person</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Financials Dialog */}
			<Dialog open={isEditingFinancials} onOpenChange={setIsEditingFinancials}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Financial Information</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-valuation" className="text-right">
								Valuation ($)
							</Label>
							<Input
								id="company-valuation"
								type="number"
								value={financialInfo.valuation}
								onChange={(e) => {
									setFinancialInfo(
										Object.assign({}, financialInfo, {
											valuation: e.target.value,
										}),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-funding" className="text-right">
								Total Funding ($)
							</Label>
							<Input
								id="company-funding"
								type="number"
								value={financialInfo.totalFundingAmount}
								onChange={(e) => {
									setFinancialInfo(
										Object.assign({}, financialInfo, {
											totalFundingAmount: e.target.value,
										}),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="company-investors" className="text-right pt-2">
								Investors
							</Label>
							<Textarea
								id="company-investors"
								value={financialInfo.investors}
								onChange={(e) => {
									setFinancialInfo(
										Object.assign({}, financialInfo, {
											investors: e.target.value,
										}),
									);
								}}
								placeholder="Comma-separated list of investors"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsEditingFinancials(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveFinancials}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
