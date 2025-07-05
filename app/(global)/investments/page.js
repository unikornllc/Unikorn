"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
	TrendingUp,
	Calendar,
	Building2,
	AlertCircle,
	CheckCircle,
	Clock,
	X,
	Search,
	Download,
	RefreshCw,
	Eye,
	BarChart3,
	PieChart,
	ArrowUpRight,
	ArrowDownRight,
	Wallet,
	Target,
	Activity,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import { Input } from "@/app/_components/_ui/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/_ui/Select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/_ui/Dialog";
import { Alert, AlertDescription } from "@/app/_components/_ui/Alert";
import { Progress } from "@/app/_components/_ui/Progress";

export default function MyInvestmentsPage() {
	const [activeTab, setActiveTab] = useState("investments");
	const [investments, setInvestments] = useState([]);
	const [investmentOffers, setInvestmentOffers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [retryCount, setRetryCount] = useState(0);

	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState("date");
	const [sortOrder, setSortOrder] = useState("desc");

	const [selectedItem, setSelectedItem] = useState(null);
	const [actionType, setActionType] = useState("");
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [cancellingItems, setCancellingItems] = useState(new Set());
	const [showDetailsModal, setShowDetailsModal] = useState(false);

	const [notification, setNotification] = useState({
		show: false,
		message: "",
		type: "success",
	});

	const [portfolioStats, setPortfolioStats] = useState({
		totalInvested: 0,
		totalEquity: 0,
		activeInvestments: 0,
		pendingOffers: 0,
		// totalReturns: 0,
		// portfolioGrowth: 0,
	});

	const fetchInvestments = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/investments/my`,
				{
					withCredentials: true,
				},
			);

			if (response.data && Array.isArray(response.data.investments)) {
				setInvestments(response.data.investments);
				calculatePortfolioStats(response.data.investments, investmentOffers);
			} else {
				setInvestments([]);
			}
		} catch (error) {
			console.error("Error fetching investments:", error);
			if (error.response?.status === 401) {
				setError("Please log in to view your investments");
			} else if (error.response?.status === 403) {
				setError("You don't have permission to view this data");
			} else {
				setError("Failed to load investments. Please try again.");
			}
			throw error;
		}
	};

	const fetchInvestmentOffers = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/investments/offers`,
				{
					withCredentials: true,
				},
			);

			if (response.data && Array.isArray(response.data.offers)) {
				setInvestmentOffers(response.data.offers);
				calculatePortfolioStats(investments, response.data.offers);
			} else {
				setInvestmentOffers([]);
			}
		} catch (error) {
			console.error("Error fetching investment offers:", error);
			if (error.response?.status === 401) {
				setError("Please log in to view your investment offers");
			} else {
				setError("Failed to load investment offers. Please try again.");
			}
			throw error;
		}
	};

	const calculatePortfolioStats = (investmentData, offerData) => {
		console.log(investmentData);
		console.log(offerData);
		let newStats = {};
		if (investmentData && investmentData.length > 0) {
			console.log("Calculating investment stats...");
			newStats = {
				totalInvested: investmentData.reduce(
					(sum, inv) => sum + (inv.fundingAmount || 0),
					0,
				),
				totalEquity: investmentData.reduce(
					(sum, inv) => sum + (inv.equityPercentage || 0),
					0,
				),
				activeInvestments: investmentData.filter(
					(inv) => inv.status === "Active",
				).length,
			};
		}
		if (offerData && offerData.length > 0) {
			console.log("Calculating offer stats...");
			newStats.pendingOffers = offerData.filter(
				(offer) => offer.status === "Pending",
			).length;
		}
		if (newStats != {}) {
			console.log("Updating portfolio stats:", newStats);
			setPortfolioStats({
				...portfolioStats,
				...newStats,
				// totalReturns: totalInvested * 0.12, // Mock calculation
				// portfolioGrowth: 12.5, // Mock percentage
			});
		}
	};

	const fetchData = async () => {
		setLoading(true);
		setError(null);

		try {
			await Promise.all([fetchInvestments(), fetchInvestmentOffers()]);
			calculatePortfolioStats(investments, investmentOffers);
			setRetryCount(0);
		} catch (error) {
			if (retryCount < 3) {
				setTimeout(
					() => {
						setRetryCount((prev) => prev + 1);
						fetchData();
					},
					2000 * (retryCount + 1),
				);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleCancelClick = (item, type) => {
		setSelectedItem(item);
		setActionType(type);
		setShowCancelDialog(true);
	};

	const handleConfirmCancel = async () => {
		if (!selectedItem) return;

		setShowCancelDialog(false);
		setCancellingItems((prev) => new Set([...prev, selectedItem.id]));

		try {
			const endpoint =
				actionType === "cancelInvestment"
					? "/api/investments/cancel"
					: "/api/investments/offer/cancel";

			const payload =
				actionType === "cancelInvestment"
					? { fundraiserId: selectedItem.id }
					: { offerId: selectedItem.id };

			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}${endpoint}`,
				payload,
				{
					withCredentials: true,
				},
			);

			showNotification(
				`${actionType === "cancelInvestment" ? "Investment" : "Investment offer"} cancelled successfully`,
				"success",
			);

			await fetchData();
		} catch (error) {
			console.error("Error cancelling:", error);
			showNotification("Failed to cancel. Please try again.", "error");
		} finally {
			setCancellingItems((prev) => {
				const newSet = new Set(prev);
				newSet.delete(selectedItem.id);
				return newSet;
			});
		}
	};

	const showNotification = (message, type = "success") => {
		setNotification({ show: true, message, type });
		setTimeout(
			() => setNotification({ show: false, message: "", type: "success" }),
			5000,
		);
	};

	const filterAndSortData = (data) => {
		const filtered = data.filter((item) => {
			const matchesSearch =
				searchTerm === "" ||
				(item.raisingFunds?.company?.name || "")
					.toLowerCase()
					.includes(searchTerm.toLowerCase());
			const matchesStatus =
				statusFilter === "all" ||
				item.status.toLowerCase() === statusFilter.toLowerCase();
			return matchesSearch && matchesStatus;
		});

		return filtered.sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case "date":
					aValue = new Date(a.date);
					bValue = new Date(b.date);
					break;
				case "amount":
					aValue = a.fundingAmount || a.totalOfferedPrice || 0;
					bValue = b.fundingAmount || b.totalOfferedPrice || 0;
					break;
				case "company":
					aValue = a.raisingFunds?.company?.name || "";
					bValue = b.raisingFunds?.company?.name || "";
					break;
				default:
					return 0;
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});
	};

	const getStatusIcon = (status) => {
		switch (status?.toLowerCase()) {
			case "active":
			case "confirmed":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "pending":
				return <Clock className="h-4 w-4 text-yellow-500" />;
			case "cancelled":
			case "rejected":
				return <X className="h-4 w-4 text-red-500" />;
			default:
				return <AlertCircle className="h-4 w-4 text-gray-500" />;
		}
	};

	const getStatusBadge = (status) => {
		const variants = {
			active: "default",
			confirmed: "default",
			pending: "secondary",
			cancelled: "destructive",
			rejected: "destructive",
		};

		return (
			<Badge
				variant={variants[status?.toLowerCase()] || "outline"}
				className="flex items-center gap-1"
			>
				{getStatusIcon(status)}
				{status}
			</Badge>
		);
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount || 0);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const LoadingState = () => (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
			<div className="text-center">
				<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600 text-lg">Loading your Investments ...</p>
				<p className="text-gray-500 text-sm mt-2">
					This may take a few moments
				</p>
			</div>
		</div>
	);

	const ErrorState = () => (
		<div className="flex flex-col items-center justify-center py-12">
			<AlertCircle className="h-12 w-12 text-red-500 mb-4" />
			<h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
			<p className="text-muted-foreground mb-4 text-center max-w-md">{error}</p>
			<Button onClick={fetchData} className="flex items-center gap-2">
				<RefreshCw className="h-4 w-4" />
				Try Again
			</Button>
		</div>
	);

	const EmptyState = ({ type }) => (
		<div className="flex flex-col items-center justify-center py-12">
			<div className="rounded-full bg-muted p-6 mb-4">
				{type === "investments" ? (
					<TrendingUp className="h-8 w-8 text-muted-foreground" />
				) : (
					<Target className="h-8 w-8 text-muted-foreground" />
				)}
			</div>
			<h3 className="text-lg font-semibold mb-2">
				No {type === "investments" ? "investments" : "investment offers"} yet
			</h3>
			<p className="text-muted-foreground mb-4 text-center max-w-md">
				{type === "investments"
					? "Start building your investment portfolio by exploring available opportunities."
					: "You haven't made any investment offers yet. Browse companies to get started."}
			</p>
			<Button asChild>
				<a href="/companies">Explore Opportunities</a>
			</Button>
		</div>
	);

	const InvestmentCard = ({ investment, type = "investment" }) => {
		const isOffer = type === "offer";
		const amount = isOffer
			? investment.totalOfferedPrice
			: investment.fundingAmount;
		const pricePerPortion = isOffer
			? investment.offeredPricePerPortion
			: investment.pricePerPortion;

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.3 }}
			>
				<Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/20 hover:border-l-primary">
					<CardHeader className="pb-3">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-lg bg-primary/10">
									<Building2 className="h-5 w-5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-lg">
										{investment.raisingFunds?.company?.name ||
											"Unknown Company"}
									</CardTitle>
									<CardDescription className="flex items-center gap-2">
										<Calendar className="h-3 w-3" />
										{formatDate(investment.date)}
									</CardDescription>
								</div>
							</div>
							{getStatusBadge(investment.status)}
						</div>
					</CardHeader>

					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="space-y-1">
								<p className="text-xs text-muted-foreground uppercase tracking-wide">
									{isOffer ? "Offered Amount" : "Investment"}
								</p>
								<p className="text-lg font-semibold text-green-600">
									{formatCurrency(amount)}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-xs text-muted-foreground uppercase tracking-wide">
									Portions
								</p>
								<p className="text-lg font-semibold">
									{investment.portions || 0}
								</p>
							</div>

							<div className="space-y-1">
								<p className="text-xs text-muted-foreground uppercase tracking-wide">
									Price/Portion
								</p>
								<p className="text-lg font-semibold">
									{formatCurrency(pricePerPortion)}
								</p>
							</div>

							{!isOffer && (
								<div className="space-y-1">
									<p className="text-xs text-muted-foreground uppercase tracking-wide">
										Equity
									</p>
									<p className="text-lg font-semibold text-blue-600">
										{investment.equityPercentage?.toFixed(2) || 0}%
									</p>
								</div>
							)}
						</div>

						{investment.status === "Pending" && (
							<div className="flex gap-2 pt-2 border-t">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setSelectedItem(investment) || setShowDetailsModal(true)
									}
									className="flex items-center gap-2"
								>
									<Eye className="h-4 w-4" />
									View Details
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() =>
										handleCancelClick(
											investment,
											isOffer ? "cancelOffer" : "cancelInvestment",
										)
									}
									disabled={cancellingItems.has(investment.id)}
									className="flex items-center gap-2"
								>
									{cancellingItems.has(investment.id) ? (
										<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
									) : (
										<X className="h-4 w-4" />
									)}
									Cancel {isOffer ? "Offer" : "Investment"}
								</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</motion.div>
		);
	};

	if (loading) return <LoadingState />;
	if (error) return <ErrorState />;

	const filteredInvestments = filterAndSortData(investments);
	const filteredOffers = filterAndSortData(investmentOffers);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
			{/* Hero Section */}
			<div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
				<div className="container mx-auto px-4 py-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
								My Investment Portfolio
							</h1>
							<p className="text-lg text-muted-foreground">
								Track and manage your investments and offers
							</p>
						</div>

						<div className="flex gap-3">
							<Button
								variant="outline"
								onClick={fetchData}
								className="flex items-center gap-2 bg-transparent"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* Portfolio Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium text-green-700">
									Total Invested
								</CardTitle>
								<Wallet className="h-4 w-4 text-green-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-900">
								{formatCurrency(portfolioStats.totalInvested)}
							</div>
							<div className="flex items-center text-xs text-green-600 mt-1">
								<ArrowUpRight className="h-3 w-3 mr-1" />
								{/* +{portfolioStats.portfolioGrowth}% this month */}
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium text-blue-700">
									Total Equity
								</CardTitle>
								<PieChart className="h-4 w-4 text-blue-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-blue-900">
								{portfolioStats.totalEquity.toFixed(2)}%
							</div>
							<div className="text-xs text-blue-600 mt-1">
								Across {portfolioStats.activeInvestments} companies
							</div>
						</CardContent>
					</Card>

					<Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium text-purple-700">
									Active Investments
								</CardTitle>
								<Activity className="h-4 w-4 text-purple-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-purple-900">
								{portfolioStats.activeInvestments}
							</div>
							<div className="text-xs text-purple-600 mt-1">
								{portfolioStats.pendingOffers} pending offers
							</div>
						</CardContent>
					</Card>

					{/* <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-medium text-orange-700">
									Estimated Returns
								</CardTitle>
								<BarChart3 className="h-4 w-4 text-orange-600" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-orange-900">
								{formatCurrency(portfolioStats.totalReturns)}
							</div>
							<div className="text-xs text-orange-600 mt-1">
								Projected annual return
							</div>
						</CardContent>
					</Card> */}
				</div>

				{/* Filters and Search */}
				<Card className="mb-6">
					<CardContent className="p-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1">
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search by company name..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10"
									/>
								</div>
							</div>

							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="w-full md:w-40">
									<SelectValue placeholder="Status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="active">Active</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>

							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-full md:w-40">
									<SelectValue placeholder="Sort by" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="date">Date</SelectItem>
									<SelectItem value="amount">Amount</SelectItem>
									<SelectItem value="company">Company</SelectItem>
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								onClick={() =>
									setSortOrder(sortOrder === "asc" ? "desc" : "asc")
								}
								className="flex items-center gap-2"
							>
								{sortOrder === "asc" ? (
									<ArrowUpRight className="h-4 w-4" />
								) : (
									<ArrowDownRight className="h-4 w-4" />
								)}
								{sortOrder === "asc" ? "Ascending" : "Descending"}
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="space-y-6"
				>
					<TabsList className="grid w-full grid-cols-2 lg:w-96">
						<TabsTrigger
							value="investments"
							className="flex items-center gap-2"
						>
							<TrendingUp className="h-4 w-4" />
							My Investments ({investments.length})
						</TabsTrigger>
						<TabsTrigger value="offers" className="flex items-center gap-2">
							<Target className="h-4 w-4" />
							My Offers ({investmentOffers.length})
						</TabsTrigger>
					</TabsList>

					<TabsContent value="investments" className="space-y-6">
						{filteredInvestments.length === 0 ? (
							searchTerm || statusFilter !== "all" ? (
								<Card>
									<CardContent className="p-12 text-center">
										<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											No investments found
										</h3>
										<p className="text-muted-foreground">
											Try adjusting your search or filter criteria
										</p>
									</CardContent>
								</Card>
							) : (
								<EmptyState type="investments" />
							)
						) : (
							<AnimatePresence>
								<div className="grid gap-6">
									{filteredInvestments.map((investment) => (
										<InvestmentCard
											key={investment.id}
											investment={investment}
											type="investment"
										/>
									))}
								</div>
							</AnimatePresence>
						)}
					</TabsContent>

					<TabsContent value="offers" className="space-y-6">
						{filteredOffers.length === 0 ? (
							searchTerm || statusFilter !== "all" ? (
								<Card>
									<CardContent className="p-12 text-center">
										<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-lg font-semibold mb-2">
											No offers found
										</h3>
										<p className="text-muted-foreground">
											Try adjusting your search or filter criteria
										</p>
									</CardContent>
								</Card>
							) : (
								<EmptyState type="offers" />
							)
						) : (
							<AnimatePresence>
								<div className="grid gap-6">
									{filteredOffers.map((offer) => (
										<InvestmentCard
											key={offer.id}
											investment={offer}
											type="offer"
										/>
									))}
								</div>
							</AnimatePresence>
						)}
					</TabsContent>
				</Tabs>
			</div>

			{/* Cancel Confirmation Dialog */}
			<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<AlertCircle className="h-5 w-5 text-amber-500" />
							Confirm Cancellation
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel this{" "}
							{actionType === "cancelInvestment"
								? "investment"
								: "investment offer"}
							?
						</DialogDescription>
					</DialogHeader>

					{/* <Alert className="border-amber-200 bg-amber-50">
						<AlertCircle className="h-4 w-4 text-amber-600" />
						<AlertDescription className="text-amber-800">
							<strong>Important:</strong> A 5% cancellation fee will be applied
							to this transaction.
						</AlertDescription>
					</Alert> */}

					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowCancelDialog(false)}
						>
							Keep {actionType === "cancelInvestment" ? "Investment" : "Offer"}
						</Button>
						<Button variant="destructive" onClick={handleConfirmCancel}>
							Yes, Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Details Modal */}
			<Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Investment Details</DialogTitle>
					</DialogHeader>

					{selectedItem && (
						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<h4 className="font-semibold mb-2">Company Information</h4>
									<div className="space-y-2 text-sm">
										<p>
											<strong>Name:</strong>{" "}
											{selectedItem.raisingFunds?.company?.name}
										</p>
										<p>
											<strong>Industry:</strong>{" "}
											{selectedItem.raisingFunds?.company?.industry || "N/A"}
										</p>
										<p>
											<strong>Founded:</strong>{" "}
											{selectedItem.raisingFunds?.company?.founded
												? new Date(
														selectedItem.raisingFunds.company.founded,
													).getFullYear()
												: "N/A"}
										</p>
									</div>
								</div>

								<div>
									<h4 className="font-semibold mb-2">Investment Details</h4>
									<div className="space-y-2 text-sm">
										<p>
											<strong>Amount:</strong>{" "}
											{formatCurrency(
												selectedItem.fundingAmount ||
													selectedItem.totalOfferedPrice,
											)}
										</p>
										<p>
											<strong>Portions:</strong> {selectedItem.portions}
										</p>
										<p>
											<strong>Date:</strong> {formatDate(selectedItem.date)}
										</p>
										<p>
											<strong>Status:</strong> {selectedItem.status}
										</p>
									</div>
								</div>
							</div>

							{selectedItem.equityPercentage && (
								<div>
									<h4 className="font-semibold mb-2">Equity Information</h4>
									<div className="bg-muted p-4 rounded-lg">
										<div className="flex justify-between items-center">
											<span>Your Equity Stake:</span>
											<span className="font-semibold text-lg">
												{selectedItem.equityPercentage.toFixed(2)}%
											</span>
										</div>
										<Progress
											value={selectedItem.equityPercentage}
											className="mt-2"
										/>
									</div>
								</div>
							)}
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Notification */}
			<AnimatePresence>
				{notification.show && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="fixed bottom-4 right-4 z-50"
					>
						<Alert
							className={`${notification.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
						>
							{notification.type === "error" ? (
								<AlertCircle className="h-4 w-4 text-red-600" />
							) : (
								<CheckCircle className="h-4 w-4 text-green-600" />
							)}
							<AlertDescription
								className={
									notification.type === "error"
										? "text-red-800"
										: "text-green-800"
								}
							>
								{notification.message}
							</AlertDescription>
						</Alert>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
