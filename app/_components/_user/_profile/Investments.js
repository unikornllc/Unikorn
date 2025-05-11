"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/solid";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Badge } from "@/app/_components/_ui/Badge";
import { Button } from "@/app/_components/_ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import DeleteButton from "@/app/_components/_ui/DeleteButton";

const Investments = ({ investments, editable }) => {
	const [isAddingInvestment, setIsAddingInvestment] = useState(false);
	const [editingInvestmentId, setEditingInvestmentId] = useState(null);
	const [loading, setLoading] = useState(false);

	const [newInvestment, setNewInvestment] = useState({
		companyName: "",
		amount: 0,
		equityPercentage: 0,
		date: new Date().toISOString().split("T")[0],
	});
	const [editData, setEditData] = useState({
		companyName: "",
		amount: 0,
		equityPercentage: 0,
		date: "",
	});

	const handleAddInvestment = async () => {
		try {
			setLoading(true);
			console.log("Adding investment:", newInvestment);
			// const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/investments`, newInvestment)

			setIsAddingInvestment(false);
			setNewInvestment({
				companyName: "",
				amount: 0,
				equityPercentage: 0,
				date: new Date().toISOString().split("T")[0],
			});
		} catch (error) {
			console.error("Error adding investment:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateInvestment = async () => {
		try {
			setLoading(true);
			console.log("Updating investment:", editData);

			setEditingInvestmentId(null);
			setEditData({
				companyName: "",
				amount: 0,
				equityPercentage: 0,
				date: "",
			});
		} catch (error) {
			console.error("Error updating investment:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteInvestment = async (investmentId) => {
		try {
			setLoading(true);
			console.log("Deleting investment:", investmentId);
			// await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/investments/${investmentId}`)
		} catch (error) {
			console.error("Error deleting investment:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h3 className="text-2xl font-semibold text-textPrimary">Investments</h3>
				{editable && (
					<Button
						onClick={() => setIsAddingInvestment(true)}
						className="flex items-center gap-2"
					>
						<PlusIcon className="h-5 w-5" />
						Add Investment
					</Button>
				)}
			</div>

			{investments.length === 0 ? (
				<div className="bg-white p-8 rounded-lg shadow text-center">
					<p className="text-gray-500">No investments found.</p>
					{editable && (
						<Button
							onClick={() => setIsAddingInvestment(true)}
							className="mt-4"
						>
							Add Your First Investment
						</Button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{investments.map((investment) => (
						<Card key={investment.id} className="overflow-hidden">
							<CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
								<div className="flex justify-between items-start">
									<CardTitle>{investment.raisingFunds.company.name}</CardTitle>
									{editable && (
										<button
											className="p-2 rounded-full bg-white hover:bg-gray-100"
											onClick={() => {
												setEditingInvestmentId(investment.id);
												setEditData({
													companyName: investment.raisingFunds.company.name,
													amount: investment.fundingAmount,
													equityPercentage: investment.equityPercentage,
													date: new Date(investment.date)
														.toISOString()
														.split("T")[0],
												});
											}}
										>
											<PencilIcon className="w-4 h-4 text-gray-600" />
										</button>
									)}
								</div>
								<CardDescription>
									Invested on {formatDate(investment.date)}
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-4">
								<div className="space-y-2">
									<div className="flex justify-between">
										<span className="text-gray-500">Investment Amount:</span>
										<span className="font-medium">
											{formatCurrency(investment.fundingAmount)}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Equity Percentage:</span>
										<span className="font-medium">
											{investment.equityPercentage}%
										</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="border-t pt-4 flex justify-between">
								<Badge
									variant="outline"
									className="bg-green-50 text-green-600 border-green-200"
								>
									{investment.status} Investment
								</Badge>
								{editable && (
									<DeleteButton
										onDelete={() => handleDeleteInvestment(investment.id)}
										itemType="Investment"
										loading={loading}
										size="small"
									/>
								)}
							</CardFooter>
						</Card>
					))}
				</div>
			)}

			<Dialog open={isAddingInvestment} onOpenChange={setIsAddingInvestment}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add New Investment</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-name" className="text-right">
								Company Name
							</Label>
							<Input
								id="company-name"
								value={newInvestment.companyName}
								onChange={(e) =>
									setNewInvestment({
										...newInvestment,
										companyName: e.target.value,
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="amount" className="text-right">
								Amount ($)
							</Label>
							<Input
								id="amount"
								type="number"
								value={newInvestment.amount}
								onChange={(e) =>
									setNewInvestment({
										...newInvestment,
										amount: Number.parseFloat(e.target.value),
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="equity" className="text-right">
								Equity (%)
							</Label>
							<Input
								id="equity"
								type="number"
								step="0.01"
								value={newInvestment.equityPercentage}
								onChange={(e) =>
									setNewInvestment({
										...newInvestment,
										equityPercentage: Number.parseFloat(e.target.value),
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="date" className="text-right">
								Date
							</Label>
							<Input
								id="date"
								type="date"
								value={newInvestment.date}
								onChange={(e) =>
									setNewInvestment({ ...newInvestment, date: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAddingInvestment(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleAddInvestment} disabled={loading}>
							Add Investment
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={!!editingInvestmentId}
				onOpenChange={(open) => !open && setEditingInvestmentId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Investment</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-company-name" className="text-right">
								Company Name
							</Label>
							<Input
								id="edit-company-name"
								value={editData.companyName}
								onChange={(e) =>
									setEditData({ ...editData, companyName: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-amount" className="text-right">
								Amount ($)
							</Label>
							<Input
								id="edit-amount"
								type="number"
								value={editData.amount}
								onChange={(e) =>
									setEditData({
										...editData,
										amount: Number.parseFloat(e.target.value),
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-equity" className="text-right">
								Equity (%)
							</Label>
							<Input
								id="edit-equity"
								type="number"
								step="0.01"
								value={editData.equityPercentage}
								onChange={(e) =>
									setEditData({
										...editData,
										equityPercentage: Number.parseFloat(e.target.value),
									})
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-date" className="text-right">
								Date
							</Label>
							<Input
								id="edit-date"
								type="date"
								value={editData.date}
								onChange={(e) =>
									setEditData({ ...editData, date: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setEditingInvestmentId(null)}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdateInvestment} disabled={loading}>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Investments;
