"use client";

import { useState, useEffect } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/_ui/Dialog";
import { useToast } from "@/app/_components/_hooks/useToast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/app/_utils/utils";

export function FundingCardForm({
	fundraising,
	portionEquity,
	remainingEquity,
}) {
	const [mode, setMode] = useState("invest");
	const [partsToInvest, setPartsToInvest] = useState(1);
	const [offeredPricePerPart, setOfferedPricePerPart] = useState(
		fundraising.pricePerPortion,
	);
	const [walletBalance, setWalletBalance] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [confirmDialog, setConfirmDialog] = useState(false);
	const [errorDialog, setErrorDialog] = useState(false);

	const { toast } = useToast();

	const maxPartsToInvest = Math.min(
		fundraising.remainingPortions,
		Math.floor(remainingEquity / portionEquity),
	);

	const equityToReceive = (partsToInvest * portionEquity).toFixed(2);

	const totalInvestment =
		mode === "invest"
			? partsToInvest * fundraising.pricePerPortion
			: partsToInvest * offeredPricePerPart;

	useEffect(() => {
		const fetchWallet = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getWallet`,
					{ withCredentials: true },
				);
				setWalletBalance(response.data.amount);
			} catch (err) {
				console.error("Error fetching wallet:", err);
				toast({
					title: "Error",
					description: "Could not fetch wallet balance",
					variant: "destructive",
				});
			}
		};

		fetchWallet();
	}, []);

	const handleInvestment = () => {
		if (walletBalance === null) {
			toast({
				title: "Please wait",
				description: "Your wallet balance is still loading",
			});
			return;
		}

		if (partsToInvest < 1 || partsToInvest > maxPartsToInvest) {
			toast({
				title: "Invalid input",
				description: `Please enter a number between 1 and ${maxPartsToInvest}`,
				variant: "destructive",
			});
			return;
		}

		if (walletBalance < totalInvestment) {
			setErrorDialog(true);
		} else {
			setConfirmDialog(true);
		}
	};

	const handleConfirmInvestment = async () => {
		setConfirmDialog(false);
		setIsLoading(true);

		try {
			if (mode === "invest") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/api/investments/fixedPrice`,
					{
						raisingFundsId: fundraising.id,
						portions: partsToInvest,
					},
					{ withCredentials: true },
				);

				toast({
					title: "Success!",
					description: "Your investment has been processed successfully",
					variant: "success",
				});

				setWalletBalance((prev) => prev - totalInvestment);
			} else {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/api/investments/negotiatePrice`,
					{
						raisingFundsId: fundraising.id,
						portions: partsToInvest,
						offeredPricePerPortion: offeredPricePerPart,
						walletBalance,
					},
					{ withCredentials: true },
				);

				toast({
					title: "Offer submitted!",
					description: "Your investment offer has been sent to the company",
					variant: "success",
				});
			}
		} catch (error) {
			console.error("Transaction error:", error);
			toast({
				title: "Transaction failed",
				description: error.response?.data?.message || "Please try again later",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<Tabs defaultValue="invest" className="w-full">
				<TabsList className="grid grid-cols-2">
					<TabsTrigger value="invest" onClick={() => setMode("invest")}>
						Fixed Price
					</TabsTrigger>
					<TabsTrigger value="offer" onClick={() => setMode("offer")}>
						Make Offer
					</TabsTrigger>
				</TabsList>

				<TabsContent value="invest" className="space-y-4 pt-4">
					<div className="space-y-2">
						<Label htmlFor="parts">Number of portions</Label>
						<Input
							id="parts"
							type="number"
							min={1}
							max={maxPartsToInvest}
							value={partsToInvest}
							onChange={(e) => {
								const value = Number.parseInt(e.target.value);
								if (isNaN(value)) {
									setPartsToInvest(1);
								} else if (value > maxPartsToInvest) {
									setPartsToInvest(maxPartsToInvest);
								} else if (value < 1) {
									setPartsToInvest(1);
								} else {
									setPartsToInvest(value);
								}
							}}
						/>
						<p className="text-xs text-muted-foreground">
							Max: {maxPartsToInvest} portions
						</p>
					</div>
				</TabsContent>

				<TabsContent value="offer" className="space-y-4 pt-4">
					<div className="space-y-2">
						<Label htmlFor="parts">Number of portions</Label>
						<Input
							id="parts"
							type="number"
							min={1}
							max={maxPartsToInvest}
							value={partsToInvest}
							onChange={(e) => {
								const value = Number.parseInt(e.target.value);
								if (isNaN(value)) {
									setPartsToInvest(1);
								} else if (value > maxPartsToInvest) {
									setPartsToInvest(maxPartsToInvest);
								} else if (value < 1) {
									setPartsToInvest(1);
								} else {
									setPartsToInvest(value);
								}
							}}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="price">Your offered price per portion</Label>
						<Input
							id="price"
							type="number"
							min={1}
							value={offeredPricePerPart}
							onChange={(e) => {
								const value = Number.parseFloat(e.target.value);
								if (isNaN(value) || value < 1) {
									setOfferedPricePerPart(1);
								} else {
									setOfferedPricePerPart(value);
								}
							}}
						/>
						<p className="text-xs text-muted-foreground">
							Market price: {formatCurrency(fundraising.pricePerPortion)} per
							portion
						</p>
					</div>
				</TabsContent>
			</Tabs>

			<div className="bg-muted/50 p-4 rounded-lg space-y-2">
				<div className="flex justify-between">
					<span>Total investment:</span>
					<span className="font-semibold">
						{formatCurrency(totalInvestment)}
					</span>
				</div>
				<div className="flex justify-between">
					<span>Equity to receive:</span>
					<span className="font-semibold">{equityToReceive}%</span>
				</div>
				{walletBalance !== null && (
					<div className="flex justify-between">
						<span>Your wallet balance:</span>
						<span className="font-semibold">
							{formatCurrency(walletBalance)}
						</span>
					</div>
				)}
			</div>

			<Button
				className="w-full"
				size="lg"
				onClick={handleInvestment}
				disabled={isLoading || walletBalance === null}
			>
				{isLoading ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Processing...
					</>
				) : mode === "invest" ? (
					"Invest Now"
				) : (
					"Submit Offer"
				)}
			</Button>

			<Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{mode === "invest" ? "Confirm Investment" : "Confirm Offer"}
						</DialogTitle>
						<DialogDescription>
							{mode === "invest"
								? `You are about to invest ${formatCurrency(totalInvestment)} for ${equityToReceive}% equity in ${fundraising.company.name}.`
								: `You are about to offer ${formatCurrency(totalInvestment)} for ${equityToReceive}% equity in ${fundraising.company.name}.`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setConfirmDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleConfirmInvestment} disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Processing...
								</>
							) : (
								"Confirm"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog open={errorDialog} onOpenChange={setErrorDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Insufficient Funds</DialogTitle>
						<DialogDescription>
							You don't have enough funds in your wallet to complete this
							transaction. Please add funds to your wallet and try again.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setErrorDialog(false)}>OK</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
