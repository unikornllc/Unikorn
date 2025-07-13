"use client";

import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
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
import { TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import {
	addCompanyFundingRound,
	fetchCompanyFinancialInfo,
	fetchCompanyActiveRaisingFunds,
} from "@/app/_utils/_api/companyAPIs";
import DeleteButton from "@/app/_components/_ui/DeleteButton";

import {
	updateCompanyItem,
	updateCompanyFundingRound,
	deleteFundingRound,
} from "@/app/_utils/_api/companyAPIs";

import { useRouter } from "next/navigation";

export default function FundingSection({ company, isOwner }) {
	const [activeTab, setActiveTab] = useState("rounds");
	const [isEditingFinancials, setIsEditingFinancials] = useState(false);
	const [isAddingRound, setIsAddingRound] = useState(false);
	const [isEditingRound, setIsEditingRound] = useState(false);
	const [loading, setLoading] = useState(true);
	const [financials, setFinancials] = useState(null);
	const [activeFundraising, setActiveFundraising] = useState(null);
	const [selectedRound, setSelectedRound] = useState(null);

	const [investors, setInvestors] = useState([]);

	const [financialInfo, setFinancialInfo] = useState({
		valuation: 0,
		totalFundingAmount: 0,
		investors: "",
		fundingRounds: [],
	});

	const [newRound, setNewRound] = useState({
		type: "Seed",
		fundingAmount: 0,
		equityPercentage: 0,
		roundDate: new Date().toISOString().split("T")[0],
		leadInvestors: "",
		external: true,
	});

	const [editRound, setEditRound] = useState({
		id: "",
		type: "Seed",
		fundingAmount: 0,
		equityPercentage: 0,
		roundDate: "",
		leadInvestors: "",
	});

	const router = useRouter();

	const handleSaveFinancials = () => {
		const financialsToSave = {
			id: financials?.id || "f" + Date.now(),
			valuation: Number.parseFloat(financialInfo.valuation) || 0,
			totalFundingAmount:
				Number.parseFloat(financialInfo.totalFundingAmount) || 0,
			investors: financialInfo.investors
				.split(",")
				.map((i) => i.trim())
				.filter((i) => i),
			fundingRounds: financials?.fundingRounds || [],
			companyId: company.id,
		};

		// updateCompany({ financials: financialsToSave });
		setIsEditingFinancials(false);
	};

	const handleAddRound = async () => {
		try {
			if (!newRound.type || !newRound.fundingAmount) return;
			const round = {
				id: Date.now().toString(),
				type: newRound.type,
				fundingAmount: Number.parseFloat(newRound.fundingAmount) || 0,
				equityPercentage: Number.parseFloat(newRound.equityPercentage) || 0,
				roundDate: new Date(newRound.roundDate),
				leadInvestors: newRound.leadInvestors
					.split(",")
					.map((i) => i.trim())
					.filter((i) => i),
				financialsId: financials?.id || "f" + Date.now(),
			};
			await addCompanyFundingRound(round).then((response) => {
				if (response.fundingRound) {
					response.fundingRound.external = true;
					setFinancials((prev) => ({
						...prev,
						valuation: prev?.valuation || 0,
						totalFundingAmount:
							(prev?.totalFundingAmount || 0) +
							(Number.parseFloat(response.fundingRound.fundingAmount) || 0),
						fundingRounds: [
							...(prev?.fundingRounds || []),
							response.fundingRound,
						],
					}));
				}
			});
			setNewRound({
				type: "Seed",
				fundingAmount: "",
				roundDate: new Date().toISOString().split("T")[0],
				leadInvestors: "",
				external: true,
			});
		} catch (error) {
			console.error("Error updating funding round:", error);
		} finally {
			setIsAddingRound(false);
		}
	};

	const handleEditRound = (round) => {
		setSelectedRound(round);
		setEditRound({
			id: round.id,
			type: round.type,
			fundingAmount: round.fundingAmount.toString(),
			roundDate: new Date(round.roundDate).toISOString().split("T")[0],
			leadInvestors: round.leadInvestors.join(", "),
		});
		setIsEditingRound(true);
	};

	const handleSaveEditRound = async () => {
		try {
			if (!editRound.type || !editRound.fundingAmount) return;

			const updatedRound = {
				fundingRoundId: editRound.id,
				type: editRound.type,
				fundingAmount: Number.parseFloat(editRound.fundingAmount) || 0,
				equityPercentage: Number.parseFloat(editRound.equityPercentage) || 0,
				roundDate: editRound.roundDate,
				leadInvestors: editRound.leadInvestors
					.split(",")
					.map((i) => i.trim())
					.filter((i) => i),
			};
			await updateCompanyFundingRound(updatedRound);
			setFinancials((prev) => {
				const oldRound = prev.fundingRounds.find((r) => r.id === editRound.id);
				const amountDiff = updatedRound.fundingAmount - oldRound.fundingAmount;

				return {
					...prev,
					totalFundingAmount: prev.totalFundingAmount + amountDiff,
					fundingRounds: prev.fundingRounds.map((round) =>
						round.id === editRound.id
							? {
									...round,
									type: updatedRound.type,
									fundingAmount: updatedRound.fundingAmount,
									equityPercentage: updatedRound.equityPercentage,
									roundDate: new Date(updatedRound.roundDate),
									leadInvestors: updatedRound.leadInvestors,
								}
							: round,
					),
				};
			});

			setIsEditingRound(false);
		} catch (error) {
			console.error("Error updating funding round:", error);
		}
	};

	const handleDeleteRound = async (id) => {
		try {
			console.log("Deleting round with ID:", id);
			setFinancials((prev) => {
				const roundToDelete = prev.fundingRounds.find((r) => r.id === id);
				console.log("Deleting round:", roundToDelete);
				return {
					...prev,
					totalFundingAmount:
						prev.totalFundingAmount - roundToDelete.fundingAmount,
					fundingRounds: prev.fundingRounds.filter((round) => round.id !== id),
				};
			});
			await deleteFundingRound(id);
		} catch (error) {
			console.error("Error deleting funding round:", error);
		}
	};

	useEffect(() => {
		const fetchFinancials = async () => {
			try {
				const response = await fetchCompanyFinancialInfo(company.username);
				if (response.financials) {
					setFinancials(response.financials);

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
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Funding</CardTitle>
						<CardDescription>Investment history and details</CardDescription>
					</div>
					{isOwner && (
						<div className="flex gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsAddingRound(true)}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Round
							</Button>
						</div>
					)}
				</CardHeader>
				<CardContent>
					{financials ? (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Card>
									<CardContent className="pt-6">
										<div className="text-center">
											<h3 className="text-2xl font-bold text-purple-600">
												{formatCurrency(financials.totalFundingAmount)}
											</h3>
											<p className="text-sm text-gray-500 mt-1">
												Total Funding Amount
											</p>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardContent className="pt-6">
										<div className="text-center">
											<h3 className="text-2xl font-bold text-purple-600">
												{formatCurrency(financials.valuation)}
											</h3>
											<p className="text-sm text-gray-500 mt-1">
												Company Valuation
											</p>
										</div>
									</CardContent>
								</Card>

								{/* <Card>
									<CardContent className="pt-6">
										<div className="text-center">
											<h3 className="text-2xl font-bold text-purple-600">
												{financials.investors.length}
											</h3>
											<p className="text-sm text-gray-500 mt-1">
												Number of Investors
											</p>
										</div>
									</CardContent>
								</Card> */}
							</div>

							<Tabs
								defaultValue="rounds"
								value={activeTab}
								onValueChange={setActiveTab}
							>
								<TabsList className="grid w-full grid-cols-1">
									<TabsTrigger value="rounds">Funding Rounds</TabsTrigger>
									{/* <TabsTrigger value="investors">Investors</TabsTrigger> */}
								</TabsList>

								<TabsContent value="rounds" className="pt-4">
									{financials.fundingRounds &&
									financials.fundingRounds.length > 0 ? (
										<div className="overflow-x-auto">
											<table className="w-full border-collapse">
												<thead>
													<tr className="border-b">
														<th className="text-left py-3 px-4">Round</th>
														<th className="text-left py-3 px-4">Date</th>
														<th className="text-left py-3 px-4">Amount</th>
														<th className="text-left py-3 px-4">Equity</th>
														<th className="text-left py-3 px-4">
															Lead Investors
														</th>
														{isOwner && (
															<th className="text-right py-3 px-4">Actions</th>
														)}
													</tr>
												</thead>
												<tbody>
													{financials.fundingRounds.map((round) => (
														<tr
															key={round.id}
															className="border-b hover:bg-gray-50"
														>
															<td className="py-3 px-4">{round.type}</td>
															<td className="py-3 px-4">
																{formatDate(round.roundDate)}
															</td>
															<td className="py-3 px-4">
																{formatCurrency(round.fundingAmount)}
															</td>
															<td className="py-3 px-4">
																{round.equityPercentage}%
															</td>
															<td className="py-3 px-4">
																<div className="flex flex-wrap gap-1">
																	{round.leadInvestors.map(
																		(investor, index) => (
																			<Badge key={index} variant="outline">
																				{investor}
																			</Badge>
																		),
																	)}
																</div>
															</td>
															{isOwner && round.external && (
																<td className="py-3 px-4 text-right">
																	<div className="flex justify-end gap-2">
																		<Button
																			variant="ghost"
																			size="icon"
																			className="h-8 w-8"
																			onClick={() => handleEditRound(round)}
																		>
																			<Edit className="h-4 w-4" />
																		</Button>

																		<DeleteButton
																			onDelete={() => {
																				handleDeleteRound(round.id);
																			}}
																			itemType="Funding Round"
																			size="small"
																		/>
																	</div>
																</td>
															)}
														</tr>
													))}
												</tbody>
											</table>
										</div>
									) : (
										<div className="text-center py-8 text-gray-500">
											<p>No funding rounds available</p>
											{isOwner && (
												<Button
													variant="outline"
													className="mt-4"
													onClick={() => setIsAddingRound(true)}
												>
													<Plus className="h-4 w-4 mr-2" />
													Add Funding Round
												</Button>
											)}
										</div>
									)}
								</TabsContent>

								{/* <TabsContent value="investors" className="pt-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{investors.map((investor) => (
											<Card key={investor.id}>
												<CardContent className="p-6">
													<div className="flex items-center gap-4">
														<Avatar className="h-12 w-12">
															<AvatarImage
																src={investor.logo || "/placeholder.svg"}
																alt={investor.name}
															/>
															<AvatarFallback>
																{investor.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<div>
															<h3 className="font-medium">{investor.name}</h3>
															<p className="text-sm text-gray-500">
																{investor.round}
															</p>
															<p className="text-sm font-medium text-purple-600">
																{formatCurrency(investor.amount)}
															</p>
														</div>
													</div>
												</CardContent>
											</Card>
										))}
									</div>
								</TabsContent> */}
							</Tabs>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<p>No financials information available</p>
							{isOwner && (
								<div className="flex flex-col items-center gap-2 mt-4">
									{/* <Button
										variant="outline"
										onClick={() => setIsEditingFinancials(true)}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Financial Information
									</Button> */}
									<Button
										variant="outline"
										onClick={() => setIsAddingRound(true)}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Funding Round
									</Button>
								</div>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Current Fundraising */}
			<Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-purple-800">
							Current Fundraising
						</CardTitle>
						<CardDescription>Active investment opportunities</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					{activeFundraising ? (
						<div className="space-y-6">
							<div className="bg-white rounded-lg p-6 border border-purple-200">
								<div className="flex justify-between items-center mb-4">
									<h3 className="font-medium text-lg">Equity Offering</h3>
									<Badge
										variant="outline"
										className="bg-green-50 text-green-600 border-green-200"
									>
										{activeFundraising.status}
									</Badge>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
									<div>
										<p className="text-sm text-gray-500">Equity</p>
										<p className="text-xl font-medium">
											{activeFundraising.equityPercentage}%
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Funding Goal</p>
										<p className="text-xl font-medium">
											{formatCurrency(activeFundraising.fundingAmount)}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Price Per Portion</p>
										<p className="text-xl font-medium">
											{formatCurrency(activeFundraising.pricePerPortion)}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Portions Available</p>
										<p className="text-xl font-medium">
											{activeFundraising.remainingPortions}/
											{activeFundraising.totalPortions}
										</p>
									</div>
								</div>

								<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
									<div
										className="bg-purple-600 h-2 rounded-full"
										style={{
											width: `${((activeFundraising.totalPortions - activeFundraising.remainingPortions) / activeFundraising.totalPortions) * 100}%`,
										}}
									></div>
								</div>

								<div className="flex justify-between items-center text-sm text-gray-500 mb-6">
									<span>
										{((activeFundraising.totalPortions -
											activeFundraising.remainingPortions) /
											activeFundraising.totalPortions) *
											100}
										% Funded
									</span>
									<span>
										{formatCurrency(
											(activeFundraising.totalPortions -
												activeFundraising.remainingPortions) *
												activeFundraising.pricePerPortion,
										)}{" "}
										of {formatCurrency(activeFundraising.fundingAmount)}
									</span>
								</div>

								{!isOwner && (
									<Button
										className="w-full bg-purple-600 hover:bg-purple-700"
										onClick={() => {
											router.push("/companies/" + activeFundraising.id);
										}}
									>
										<TrendingUp className="h-4 w-4 mr-2" />
										Invest Now
									</Button>
								)}
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<p>No active fundraising campaigns</p>
							{isOwner && (
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => router.push(`/company/fundraising`)}
								>
									<Plus className="h-4 w-4 mr-2" />
									Start Fundraising
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Edit Financials Dialog */}
			{/* <Dialog open={isEditingFinancials} onOpenChange={setIsEditingFinancials}>
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
								onChange={(e) =>
									setFinancialInfo({
										...financialInfo,
										valuation: e.target.value,
									})
								}
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
								onChange={(e) =>
									setFinancialInfo({
										...financialInfo,
										totalFundingAmount: e.target.value,
									})
								}
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
								onChange={(e) =>
									setFinancialInfo({
										...financialInfo,
										investors: e.target.value,
									})
								}
								placeholder="Comma-separated list of investors"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditingFinancials(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveFinancials}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog> */}

			{/* Add Funding Round Dialog */}
			<Dialog open={isAddingRound} onOpenChange={setIsAddingRound}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Funding Round</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="round-type" className="text-right">
								Round Type
							</Label>
							<select
								id="round-type"
								value={newRound.type}
								onChange={(e) =>
									setNewRound({ ...newRound, type: e.target.value })
								}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Seed">Seed</option>
								<option value="Series A">Series A</option>
								<option value="Series B">Series B</option>
								<option value="Series C">Series C</option>
								<option value="Series D">Series D</option>
								<option value="Series E">Series E</option>
								<option value="Series F">Series F</option>
								<option value="Series F">Other</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="round-amount" className="text-right">
								Amount ($)
							</Label>
							<Input
								id="round-amount"
								type="number"
								value={newRound.fundingAmount}
								onChange={(e) =>
									setNewRound({ ...newRound, fundingAmount: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="round-equityPercentage" className="text-right">
								Equity (%)
							</Label>
							<Input
								id="round-equityPercentage"
								type="number"
								value={newRound.equityPercentage}
								onChange={(e) =>
									setNewRound({
										...newRound,
										equityPercentage: e.target.value,
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="round-date" className="text-right">
								Date
							</Label>
							<Input
								id="round-date"
								type="date"
								value={newRound.roundDate}
								onChange={(e) =>
									setNewRound({ ...newRound, roundDate: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="round-investors" className="text-right pt-2">
								Lead Investors
							</Label>
							<Textarea
								id="round-investors"
								value={newRound.leadInvestors}
								onChange={(e) =>
									setNewRound({ ...newRound, leadInvestors: e.target.value })
								}
								placeholder="Comma-separated list of lead investors"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddingRound(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddRound}>Add Round</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Funding Round Dialog */}
			<Dialog open={isEditingRound} onOpenChange={setIsEditingRound}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Funding Round</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-round-type" className="text-right">
								Round Type
							</Label>
							<select
								id="edit-round-type"
								value={editRound.type}
								onChange={(e) =>
									setEditRound({ ...editRound, type: e.target.value })
								}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Seed">Seed</option>
								<option value="Series A">Series A</option>
								<option value="Series B">Series B</option>
								<option value="Series C">Series C</option>
								<option value="Series D">Series D</option>
								<option value="IPO">IPO</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-round-amount" className="text-right">
								Amount ($)
							</Label>
							<Input
								id="edit-round-amount"
								type="number"
								value={editRound.fundingAmount}
								onChange={(e) =>
									setEditRound({ ...editRound, fundingAmount: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label
								htmlFor="edit-round-equityPercentage"
								className="text-right"
							>
								Equity (%)
							</Label>
							<Input
								id="edit-round-equityPercentage"
								type="number"
								value={editRound.equityPercentage}
								onChange={(e) =>
									setEditRound({
										...editRound,
										equityPercentage: e.target.value,
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-round-date" className="text-right">
								Date
							</Label>
							<Input
								id="edit-round-date"
								type="date"
								value={editRound.roundDate}
								onChange={(e) =>
									setEditRound({ ...editRound, roundDate: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="edit-round-investors" className="text-right pt-2">
								Lead Investors
							</Label>
							<Textarea
								id="edit-round-investors"
								value={editRound.leadInvestors}
								onChange={(e) =>
									setEditRound({ ...editRound, leadInvestors: e.target.value })
								}
								placeholder="Comma-separated list of lead investors"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<DeleteButton
							onDelete={() => {
								handleDeleteRound(editRound.id);
								setIsEditingRound(false);
							}}
							itemType="Funding Round"
							size="small"
						/>
						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => setIsEditingRound(false)}
							>
								Cancel
							</Button>
							<Button onClick={handleSaveEditRound}>Save Changes</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
