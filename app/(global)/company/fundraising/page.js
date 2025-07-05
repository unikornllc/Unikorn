"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
	TrendingUp,
	DollarSign,
	Users,
	Target,
	AlertCircle,
	CheckCircle,
	XCircle,
	Eye,
	Plus,
	BarChart3,
	Clock,
	Award,
	Rocket,
	Building2,
	ArrowUpRight,
	Filter,
	Download,
	Share2,
	Bell,
	Settings,
	RefreshCw,
	PieChart,
	Activity,
	Info,
	Copy,
	ExternalLink,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/app/_utils/utils";

export default function CompanyFundraisingDashboard() {
	const [activeFundraising, setActiveFundraising] = useState(null);
	const [pendingFundraising, setPendingFundraising] = useState(null);
	const [pastFundraisings, setPastFundraisings] = useState([]);
	const [investmentOffers, setInvestmentOffers] = useState([]);
	const [fundraisers, setFundraisers] = useState([]);
	const [selectedOffer, setSelectedOffer] = useState(null);
	const [actionType, setActionType] = useState("");
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openFundraisersDialog, setOpenFundraisersDialog] = useState(false);
	const [isShareModalOpen, setIsShareModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [handlingItems, setHandlingItems] = useState({});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fundingDetails, setFundingDetails] = useState({
		equityPercentage: "",
		fundingAmount: "",
		date: "",
	});
	const [stats, setStats] = useState({
		totalRaised: 0,
		totalInvestors: 0,
		averageInvestment: 0,
		successRate: 0,
		activeCampaigns: 0,
		totalCampaigns: 0,
	});

	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				setIsModalOpen(false);
			}
		};

		if (
			isModalOpen ||
			isShareModalOpen ||
			openFundraisersDialog ||
			openConfirmDialog
		) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isModalOpen, isShareModalOpen, openFundraisersDialog, openConfirmDialog]);
	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			const [activeResponse, pendingResponse, pastResponse] = await Promise.all(
				[
					axios.get(
						`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/company/active`,
						{ withCredentials: true },
					),
					axios.get(
						`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/company/pending`,
						{ withCredentials: true },
					),
					axios.get(
						`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/company/past`,
						{ withCredentials: true },
					),
				],
			);

			const activeData = activeResponse.data.activeFundraising;
			const pendingData = pendingResponse.data.pendingFundraising;
			const pastData = pastResponse.data.pastFundraisings || [];

			setActiveFundraising(activeData);
			setPendingFundraising(pendingData);
			setPastFundraisings(pastData);

			const completedFundraisings = pastData.filter(
				(f) => f.status === "Completed",
			);
			const totalRaised = completedFundraisings.reduce(
				(sum, f) => sum + (f.fundingAmount || 0),
				0,
			);
			const totalInvestors = pastData.reduce(
				(sum, f) => sum + (f.fundraisers?.length || 0),
				0,
			);
			const activeCampaigns = (activeData ? 1 : 0) + (pendingData ? 1 : 0);
			const totalCampaigns = pastData.length + activeCampaigns;

			setStats({
				totalRaised,
				totalInvestors,
				averageInvestment:
					totalInvestors > 0 ? totalRaised / totalInvestors : 0,
				successRate:
					pastData.length > 0
						? (completedFundraisings.length / pastData.length) * 100
						: 0,
				activeCampaigns,
				totalCampaigns,
			});

			if (activeData) {
				try {
					const [offersResponse, fundraisersResponse] = await Promise.all([
						axios.get(
							`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/offers`,
							{ withCredentials: true },
						),
						axios.get(
							`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/fundraisers`,
							{
								params: { raisingFundsId: activeData.id },
								withCredentials: true,
							},
						),
					]);
					setInvestmentOffers(offersResponse.data.offers || []);
					setFundraisers(fundraisersResponse.data.fundraisers || []);
				} catch (err) {
					console.warn("Error fetching active fundraising details:", err);
					setInvestmentOffers([]);
					setFundraisers([]);
				}
			} else {
				setInvestmentOffers([]);
				setFundraisers([]);
			}
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
			setError("Failed to load dashboard data. Please try again.");
			setSnackbar({
				open: true,
				message: "Failed to load dashboard data",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const handleRaiseFunds = async () => {
		try {
			const { equityPercentage, fundingAmount, date } = fundingDetails;

			if (!equityPercentage || !fundingAmount || !date) {
				setSnackbar({
					open: true,
					message: "Please fill in all fields",
					severity: "error",
				});
				return;
			}

			if (
				Number.parseFloat(equityPercentage) <= 0 ||
				Number.parseFloat(equityPercentage) > 100
			) {
				setSnackbar({
					open: true,
					message: "Equity percentage must be between 0 and 100",
					severity: "error",
				});
				return;
			}

			if (Number.parseInt(fundingAmount) <= 0) {
				setSnackbar({
					open: true,
					message: "Funding amount must be greater than 0",
					severity: "error",
				});
				return;
			}

			const selectedDate = new Date(date);
			const today = new Date();
			if (selectedDate <= today) {
				setSnackbar({
					open: true,
					message: "Campaign end date must be in the future",
					severity: "error",
				});
				return;
			}
			// const response = await axios.post(
			// 	`${process.env.NEXT_PUBLIC_SERVER}/api/docusign`,
			// 	{
			// 		data: {
			// 			equity: Number.parseFloat(equityPercentage),
			// 			price: Number.parseInt(fundingAmount),
			// 			date,
			// 		},
			// 	},
			// 	{ withCredentials: true },
			// );

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/create`,
				{
					data: {
						equityPercentage: Number.parseFloat(equityPercentage),
						fundingAmount: Number.parseInt(fundingAmount),
						date,
					},
				},
				{ withCredentials: true },
			);

			setIsModalOpen(false);
			setFundingDetails({ equityPercentage: "", fundingAmount: "", date: "" });

			if (response.data.redirectUrl) {
				window.open(response.data.redirectUrl, "_blank");
			}
			if (response.data.message) {
				setSnackbar({
					open: true,
					message: response.data.message,
					severity: "error",
				});
			} else {
				setSnackbar({
					open: true,
					message: "Fundraising initiated successfully!",
					severity: "success",
				});
			}

			setTimeout(() => fetchDashboardData(), 2000);
		} catch (error) {
			console.error("Error initiating fundraising:", error);
			setSnackbar({
				open: true,
				message:
					error.response?.data?.message ||
					"Failed to start fundraising process",
				severity: "error",
			});
		}
	};

	const handleActionClick = (item, type) => {
		setSelectedOffer(item);
		setActionType(type);
		setOpenConfirmDialog(true);
	};

	const handleFundraisingActionClick = (type) => {
		setActionType(type);
		setOpenConfirmDialog(true);
	};

	const handleConfirmAction = async () => {
		setOpenConfirmDialog(false);

		if (selectedOffer) {
			setHandlingItems((prevState) => ({
				...prevState,
				[selectedOffer.id]: true,
			}));
		}

		try {
			let endpoint = "";
			let data = {};

			switch (actionType) {
				case "accept":
					endpoint = "/api/raisingFunds/offer/accept";
					data = { offerId: selectedOffer.id };
					break;
				case "reject":
					endpoint = "/api/raisingFunds/offer/reject";
					data = { offerId: selectedOffer.id };
					break;
				case "cancelFundraising":
					endpoint = "/api/raisingFunds/cancel";
					data = { raisingFundsId: activeFundraising.id };
					break;
				case "cancelPendingFundraising":
					endpoint = "/api/raisingFunds/cancel";
					data = { raisingFundsId: pendingFundraising.id };
					break;
			}

			await axios.post(`${process.env.NEXT_PUBLIC_SERVER}${endpoint}`, data, {
				withCredentials: true,
			});

			const messages = {
				accept: "Offer accepted successfully",
				reject: "Offer rejected",
				cancelFundraising: "Fundraising cancelled successfully",
				cancelPendingFundraising: "Pending fundraising cancelled successfully",
			};

			setSnackbar({
				open: true,
				message: messages[actionType],
				severity: actionType.includes("cancel") ? "info" : "success",
			});

			await fetchDashboardData();
		} catch (error) {
			console.error("Error processing action:", error);
			setSnackbar({
				open: true,
				message:
					error.response?.data?.message ||
					"An error occurred. Please try again.",
				severity: "error",
			});
		} finally {
			if (selectedOffer) {
				setHandlingItems((prevState) => {
					const newState = { ...prevState };
					delete newState[selectedOffer.id];
					return newState;
				});
			}
		}
	};

	const handleContinueContract = () => {
		window.location.href = `/api/signContract/${pendingFundraising.id}`;
	};

	const handleViewFundraisers = async (fundraising) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/fundraisers`,
				{
					params: { raisingFundsId: fundraising.id },
					withCredentials: true,
				},
			);
			setFundraisers(response.data.fundraisers || []);
			setOpenFundraisersDialog(true);
		} catch (error) {
			console.error("Error fetching fundraisers:", error);
			setSnackbar({
				open: true,
				message: "Failed to load fundraisers",
				severity: "error",
			});
		}
	};
	const handleShareCampaign = () => {
		setIsShareModalOpen(true);
	};

	const handleCopyLink = async () => {
		const campaignLink = `${process.env.NEXT_PUBLIC_FRONTEND}/companies/${activeFundraising.id}`;

		try {
			await navigator.clipboard.writeText(campaignLink);
			setSnackbar({
				open: true,
				message: "Campaign link copied to clipboard!",
				severity: "success",
			});
		} catch (error) {
			const textArea = document.createElement("textarea");
			textArea.value = campaignLink;
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand("copy");
				setSnackbar({
					open: true,
					message: "Campaign link copied to clipboard!",
					severity: "success",
				});
			} catch (fallbackError) {
				setSnackbar({
					open: true,
					message: "Failed to copy link. Please copy manually.",
					severity: "error",
				});
			}
			document.body.removeChild(textArea);
		}
	};

	const EmptyState = () => (
		<div className="text-center py-16 px-8">
			<div className="max-w-2xl mx-auto">
				<div className="relative mb-8">
					<div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
						<Rocket className="w-16 h-16 text-blue-600" />
					</div>
					<div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
						<Plus className="w-4 h-4 text-yellow-800" />
					</div>
				</div>

				<h3 className="text-3xl font-bold text-gray-900 mb-4">
					Ready to Raise Capital?
				</h3>
				<p className="text-lg text-gray-600 mb-8 leading-relaxed">
					Launch your first fundraising campaign and connect with investors who
					believe in your vision. Our platform makes it easy to raise capital
					and grow your business with the right partners.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
					<div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
						<Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
						<div className="font-semibold text-blue-900 mb-2">
							Set Your Goal
						</div>
						<div className="text-blue-700 text-sm">
							Define funding amount, equity percentage, and campaign timeline
						</div>
					</div>
					<div className="bg-green-50 p-6 rounded-xl border border-green-100">
						<Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
						<div className="font-semibold text-green-900 mb-2">
							Find Investors
						</div>
						<div className="text-green-700 text-sm">
							Connect with our network of verified investors and partners
						</div>
					</div>
					<div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
						<Award className="w-8 h-8 text-purple-600 mx-auto mb-3" />
						<div className="font-semibold text-purple-900 mb-2">
							Close Deals
						</div>
						<div className="text-purple-700 text-sm">
							Secure funding with legal contracts and grow your business
						</div>
					</div>
				</div>

				<div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
					<h4 className="font-semibold text-gray-900 mb-3">
						Why Choose Our Platform?
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-green-500" />
							<span>Verified investor network</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-green-500" />
							<span>Legal document automation</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-green-500" />
							<span>Real-time campaign tracking</span>
						</div>
						<div className="flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-green-500" />
							<span>Secure payment processing</span>
						</div>
					</div>
				</div>

				<button
					onClick={() => setIsModalOpen(true)}
					className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
				>
					<Rocket className="w-6 h-6" />
					Start Your First Campaign
				</button>

				<p className="text-sm text-gray-500 mt-4">
					No setup fees • Free to start • Pay only when you raise funds
				</p>
			</div>
		</div>
	);

	const NoDataState = ({
		icon: Icon,
		title,
		description,
		actionText,
		onAction,
	}) => (
		<div className="text-center py-12 px-6">
			<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<Icon className="w-8 h-8 text-gray-400" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
			{actionText && onAction && (
				<button
					onClick={onAction}
					className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
				>
					{actionText}
				</button>
			)}
		</div>
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 text-lg">
						Loading your fundraising dashboard...
					</p>
					<p className="text-gray-500 text-sm mt-2">
						This may take a few moments
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
				<div className="text-center max-w-md mx-auto px-6">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<AlertCircle className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-xl font-bold text-gray-900 mb-2">
						Something went wrong
					</h2>
					<p className="text-gray-600 mb-6">{error}</p>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={fetchDashboardData}
						className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
					>
						<RefreshCw className="w-5 h-5" />
						Try Again
					</motion.button>
				</div>
			</div>
		);
	}

	const hasAnyFundraising =
		activeFundraising || pendingFundraising || pastFundraisings.length > 0;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			{/* Header */}
			<div
				className={`bg-white shadow-sm border-b ${isModalOpen || isShareModalOpen ? "pointer-events-none" : ""}`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center py-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
								<Building2 className="w-8 h-8 text-blue-600" />
								Fundraising Dashboard
							</h1>
							<p className="text-gray-600 mt-1">
								Manage your capital raising activities and investor
								relationships
							</p>
						</div>
						<div className="flex items-center gap-4">
							<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
								<Bell className="w-5 h-5" />
								{investmentOffers.filter((o) => o.status === "Pending").length >
									0 && (
									<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
								)}
							</button>
							{/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
								<Settings className="w-5 h-5" />
							</button> */}
							<button
								onClick={fetchDashboardData}
								className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<RefreshCw className="w-5 h-5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div
				className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isModalOpen || isShareModalOpen ? "pointer-events-none" : ""}`}
			>
				{!hasAnyFundraising ? (
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100">
						<EmptyState />
					</div>
				) : (
					<>
						{/* Stats Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Total Raised
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{formatCurrency(stats.totalRaised)}
										</p>
									</div>
									<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
										<TrendingUp className="w-6 h-6 text-green-600" />
									</div>
								</div>
								<div className="flex items-center mt-4 text-sm">
									{stats.totalRaised > 0 ? (
										<>
											<ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
											<span className="text-green-600 font-medium">Active</span>
										</>
									) : (
										<>
											<Info className="w-4 h-4 text-gray-400 mr-1" />
											<span className="text-gray-500">No funds raised yet</span>
										</>
									)}
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Total Investors
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{stats.totalInvestors}
										</p>
									</div>
									<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
										<Users className="w-6 h-6 text-blue-600" />
									</div>
								</div>
								<div className="flex items-center mt-4 text-sm">
									{stats.totalInvestors > 0 ? (
										<>
											<ArrowUpRight className="w-4 h-4 text-blue-500 mr-1" />
											<span className="text-blue-600 font-medium">
												Growing network
											</span>
										</>
									) : (
										<>
											<Info className="w-4 h-4 text-gray-400 mr-1" />
											<span className="text-gray-500">No investors yet</span>
										</>
									)}
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Avg Investment
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{formatCurrency(stats.averageInvestment)}
										</p>
									</div>
									<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
										<DollarSign className="w-6 h-6 text-purple-600" />
									</div>
								</div>
								<div className="flex items-center mt-4 text-sm">
									{stats.averageInvestment > 0 ? (
										<>
											<PieChart className="w-4 h-4 text-purple-500 mr-1" />
											<span className="text-purple-600 font-medium">
												Per investor
											</span>
										</>
									) : (
										<>
											<Info className="w-4 h-4 text-gray-400 mr-1" />
											<span className="text-gray-500">No data available</span>
										</>
									)}
								</div>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-gray-600">
											Success Rate
										</p>
										<p className="text-2xl font-bold text-gray-900">
											{stats.totalCampaigns > 0
												? `${stats.successRate.toFixed(1)}%`
												: "N/A"}
										</p>
									</div>
									<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
										<Target className="w-6 h-6 text-orange-600" />
									</div>
								</div>
								<div className="flex items-center mt-4 text-sm">
									{stats.totalCampaigns > 0 ? (
										<>
											<Activity className="w-4 h-4 text-orange-500 mr-1" />
											<span className="text-orange-600 font-medium">
												{stats.totalCampaigns} campaigns
											</span>
										</>
									) : (
										<>
											<Info className="w-4 h-4 text-gray-400 mr-1" />
											<span className="text-gray-500">No campaigns yet</span>
										</>
									)}
								</div>
							</div>
						</div>

						{/* Main Content */}
						<div className="space-y-8">
							{/* Pending Fundraising */}
							{pendingFundraising && (
								<div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-200">
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
											<Clock className="w-6 h-6 text-yellow-600" />
										</div>
										<div>
											<h2 className="text-2xl font-bold text-gray-900">
												Pending Fundraising
											</h2>
											<p className="text-gray-600">
												Complete your contract to activate fundraising
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
										<div className="bg-white/80 rounded-lg p-4">
											<p className="text-sm font-medium text-gray-600 mb-1">
												Funding Amount
											</p>
											<p className="text-xl font-bold text-gray-900">
												{formatCurrency(pendingFundraising.fundingAmount)}
											</p>
										</div>
										<div className="bg-white/80 rounded-lg p-4">
											<p className="text-sm font-medium text-gray-600 mb-1">
												Equity Offered
											</p>
											<p className="text-xl font-bold text-gray-900">
												{pendingFundraising.equityPercentage}%
											</p>
										</div>
										<div className="bg-white/80 rounded-lg p-4">
											<p className="text-sm font-medium text-gray-600 mb-1">
												Total Portions
											</p>
											<p className="text-xl font-bold text-gray-900">
												{pendingFundraising.totalPortions}
											</p>
										</div>
									</div>

									<div className="flex flex-wrap gap-4">
										<button
											onClick={handleContinueContract}
											className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
										>
											<CheckCircle className="w-5 h-5" />
											Continue Contract
										</button>
										<button
											onClick={() =>
												handleFundraisingActionClick("cancelPendingFundraising")
											}
											className="bg-white text-red-600 border border-red-200 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-50 transition-all duration-300"
										>
											<XCircle className="w-5 h-5" />
											Cancel Fundraising
										</button>
									</div>
								</div>
							)}

							{/* Active Fundraising */}
							{activeFundraising && (
								<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
									<div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
										<div className="flex items-center justify-between mb-6">
											<div>
												<h2 className="text-3xl font-bold mb-2">
													Active Fundraising
												</h2>
												<p className="text-blue-100">
													Your campaign is live and accepting investments
												</p>
											</div>
											<div className="text-right">
												<div className="text-4xl font-bold">
													{activeFundraising.fundedPercentage || 0}%
												</div>
												<div className="text-blue-100">Funded</div>
											</div>
										</div>

										{/* Progress Bar */}
										<div className="w-full bg-blue-400/30 rounded-full h-3 mb-6">
											<div
												style={{
													width: `${activeFundraising.fundedPercentage || 0}%`,
												}}
												className="bg-white h-3 rounded-full shadow-sm transition-all duration-1000 ease-out"
											/>
										</div>

										<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
											<div>
												<p className="text-blue-100 text-sm">Target Amount</p>
												<p className="text-xl font-bold">
													{formatCurrency(activeFundraising.fundingAmount)}
												</p>
											</div>
											<div>
												<p className="text-blue-100 text-sm">Equity Offered</p>
												<p className="text-xl font-bold">
													{activeFundraising.equityPercentage}%
												</p>
											</div>
											<div>
												<p className="text-blue-100 text-sm">
													Remaining Equity
												</p>
												<p className="text-xl font-bold">
													{activeFundraising.remainingEquity ||
														activeFundraising.equityPercentage}
													%
												</p>
											</div>
											<div>
												<p className="text-blue-100 text-sm">
													Available Portions
												</p>
												<p className="text-xl font-bold">
													{activeFundraising.remainingPortions ||
														activeFundraising.totalPortions}
													/{activeFundraising.totalPortions}
												</p>
											</div>
										</div>
									</div>

									<div className="p-8">
										<div className="flex flex-wrap gap-4 mb-8">
											<button
												onClick={() => handleViewFundraisers(activeFundraising)}
												className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
											>
												<Eye className="w-5 h-5" />
												View Investors ({fundraisers.length})
											</button>
											<button
												onClick={handleShareCampaign}
												className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition-all duration-300"
											>
												<Share2 className="w-5 h-5" />
												Share Campaign
											</button>
											{/* <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-200 transition-all duration-300">
												<Download className="w-5 h-5" />
												Export Data
											</button> */}
											{(activeFundraising.fundedPercentage || 0) < 50 && (
												<button
													onClick={() =>
														handleFundraisingActionClick("cancelFundraising")
													}
													className="bg-red-100 text-red-600 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-200 transition-all duration-300"
												>
													<XCircle className="w-5 h-5" />
													Cancel Campaign
												</button>
											)}
										</div>

										{/* Investment Offers */}
										<div className="bg-gray-50 rounded-xl p-6">
											<div className="flex items-center justify-between mb-6">
												<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
													<Users className="w-6 h-6 text-blue-600" />
													Investment Offers
												</h3>
												<div className="flex items-center gap-2">
													<span className="text-sm text-gray-500">
														{investmentOffers.length} total offers
													</span>
													<button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
														<Filter className="w-5 h-5" />
													</button>
												</div>
											</div>

											{investmentOffers.length === 0 ? (
												<NoDataState
													icon={Users}
													title="No Investment Offers Yet"
													description="When investors show interest in your campaign, their offers will appear here for you to review and respond to."
												/>
											) : (
												<div className="overflow-x-auto">
													<table className="w-full bg-white rounded-lg overflow-hidden">
														<thead className="bg-gray-100">
															<tr>
																<th className="text-left py-4 px-6 font-semibold text-gray-900">
																	Investor
																</th>
																<th className="text-left py-4 px-6 font-semibold text-gray-900">
																	Portions
																</th>
																<th className="text-left py-4 px-6 font-semibold text-gray-900">
																	Price/Portion
																</th>
																<th className="text-left py-4 px-6 font-semibold text-gray-900">
																	Total Offer
																</th>
																<th className="text-left py-4 px-6 font-semibold text-gray-900">
																	Date
																</th>
																<th className="text-left py-4 px-6 font-semibold text-gray-900">
																	Status
																</th>
																<th className="text-right py-4 px-6 font-semibold text-gray-900">
																	Actions
																</th>
															</tr>
														</thead>
														<tbody>
															{investmentOffers.map((offer, index) => (
																<tr
																	key={offer.id}
																	className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
																>
																	<td className="py-4 px-6">
																		<div className="flex items-center gap-3">
																			<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
																				{(offer.investorType === "User"
																					? offer.investorUser?.name
																					: offer.investorCompany?.name
																				)?.charAt(0) || "?"}
																			</div>
																			<div>
																				<p className="font-semibold text-gray-900">
																					{offer.investorType === "User"
																						? offer.investorUser?.name ||
																							"Unknown User"
																						: offer.investorCompany?.name ||
																							"Unknown Company"}
																				</p>
																				<p className="text-sm text-gray-500">
																					{offer.investorType}
																				</p>
																			</div>
																		</div>
																	</td>
																	<td className="py-4 px-6 font-semibold">
																		{offer.portions}
																	</td>
																	<td className="py-4 px-6 font-semibold">
																		{formatCurrency(
																			offer.offeredPricePerPortion,
																		)}
																	</td>
																	<td className="py-4 px-6 font-semibold text-green-600">
																		{formatCurrency(offer.totalOfferedPrice)}
																	</td>
																	<td className="py-4 px-6 text-gray-600">
																		{formatDate(offer.date)}
																	</td>
																	<td className="py-4 px-6">
																		<span
																			className={`px-3 py-1 rounded-full text-xs font-semibold ${
																				offer.status === "Pending"
																					? "bg-yellow-100 text-yellow-800"
																					: offer.status === "Accepted"
																						? "bg-green-100 text-green-800"
																						: "bg-red-100 text-red-800"
																			}`}
																		>
																			{offer.status}
																		</span>
																	</td>
																	<td className="py-4 px-6 text-right">
																		{offer.status === "Pending" && (
																			<div className="flex items-center gap-2 justify-end">
																				<button
																					onClick={() =>
																						handleActionClick(offer, "accept")
																					}
																					disabled={handlingItems[offer.id]}
																					className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-1"
																				>
																					{handlingItems[offer.id] ? (
																						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
																					) : (
																						<>
																							<CheckCircle className="w-4 h-4" />
																							Accept
																						</>
																					)}
																				</button>
																				<button
																					onClick={() =>
																						handleActionClick(offer, "reject")
																					}
																					disabled={handlingItems[offer.id]}
																					className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
																				>
																					{handlingItems[offer.id] ? (
																						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
																					) : (
																						<>
																							<XCircle className="w-4 h-4" />
																							Reject
																						</>
																					)}
																				</button>
																			</div>
																		)}
																	</td>
																</tr>
															))}
														</tbody>
													</table>
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Past Fundraisings */}
							<div className="bg-white rounded-2xl shadow-sm border border-gray-100">
								<div className="p-8 border-b border-gray-100">
									<div className="flex items-center justify-between">
										<div>
											<h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
												<BarChart3 className="w-7 h-7 text-gray-600" />
												Fundraising History
											</h2>
											<p className="text-gray-600 mt-1">
												Your past fundraising campaigns and their performance
											</p>
										</div>
										{!activeFundraising && !pendingFundraising && (
											<button
												onClick={() => setIsModalOpen(true)}
												className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
											>
												<Plus className="w-5 h-5" />
												New Campaign
											</button>
										)}
									</div>
								</div>

								<div className="p-8">
									{pastFundraisings.length === 0 ? (
										<NoDataState
											icon={BarChart3}
											title="No Past Campaigns"
											description="Your completed and cancelled fundraising campaigns will appear here. Start your first campaign to begin building your fundraising history."
											actionText={
												!activeFundraising && !pendingFundraising
													? "Start First Campaign"
													: undefined
											}
											onAction={
												!activeFundraising && !pendingFundraising
													? () => setIsModalOpen(true)
													: undefined
											}
										/>
									) : (
										<div className="grid gap-6">
											{pastFundraisings.map((fundraising, index) => (
												<div
													key={fundraising.id}
													className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300"
												>
													<div className="flex items-center justify-between mb-4">
														<div className="flex items-center gap-3">
															<div
																className={`w-12 h-12 rounded-lg flex items-center justify-center ${
																	fundraising.status === "Completed"
																		? "bg-green-100"
																		: fundraising.status === "Cancelled"
																			? "bg-red-100"
																			: "bg-gray-100"
																}`}
															>
																{fundraising.status === "Completed" ? (
																	<CheckCircle className="w-6 h-6 text-green-600" />
																) : fundraising.status === "Cancelled" ? (
																	<XCircle className="w-6 h-6 text-red-600" />
																) : (
																	<Clock className="w-6 h-6 text-gray-600" />
																)}
															</div>
															<div>
																<h3 className="text-lg font-bold text-gray-900">
																	{fundraising.status} Campaign
																</h3>
																<p className="text-sm text-gray-500">
																	Created At:{" "}
																	{formatDate(fundraising.createdAt)}
																</p>
																<p className="text-sm text-gray-500">
																	Ended At: {formatDate(fundraising.endedAt)}
																</p>
															</div>
														</div>
														<span
															className={`px-4 py-2 rounded-full text-sm font-semibold ${
																fundraising.status === "Completed"
																	? "bg-green-100 text-green-800"
																	: fundraising.status === "Cancelled"
																		? "bg-red-100 text-red-800"
																		: "bg-gray-100 text-gray-800"
															}`}
														>
															{fundraising.status}
														</span>
													</div>

													<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
														<div>
															<p className="text-sm text-gray-600">
																Target Amount
															</p>
															<p className="font-bold text-gray-900">
																{formatCurrency(fundraising.fundingAmount)}
															</p>
														</div>
														<div>
															<p className="text-sm text-gray-600">
																Equity Offered
															</p>
															<p className="font-bold text-gray-900">
																{fundraising.equityPercentage}%
															</p>
														</div>
														<div>
															<p className="text-sm text-gray-600">
																Total Portions
															</p>
															<p className="font-bold text-gray-900">
																{fundraising.totalPortions}
															</p>
														</div>
														<div>
															<p className="text-sm text-gray-600">
																Completion
															</p>
															<p className="font-bold text-gray-900">
																{fundraising.fundedPercentage || 0}%
															</p>
														</div>
													</div>

													{fundraising.status === "Completed" && (
														<button
															onClick={() => handleViewFundraisers(fundraising)}
															className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors flex items-center gap-2"
														>
															<Eye className="w-4 h-4" />
															View Investors
														</button>
													)}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					</>
				)}
			</div>

			{/* Share Campaign Modal */}
			<AnimatePresence>
				{isShareModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
						onClick={(e) => {
							if (e.target === e.currentTarget) {
								setIsShareModalOpen(false);
							}
						}}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="p-6 pb-4 border-b border-gray-100">
								<div className="text-center">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
										<Share2 className="w-6 h-6 text-white" />
									</div>
									<h2 className="text-xl font-bold text-gray-900 mb-1">
										Share Your Campaign
									</h2>
									<p className="text-sm text-gray-600">
										Share your fundraising campaign with potential investors
									</p>
								</div>
							</div>

							{/* Content */}
							<div className="p-6">
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Campaign Link
										</label>
										<div className="flex items-center gap-2">
											<input
												type="text"
												readOnly
												value={`${process.env.NEXT_PUBLIC_FRONTEND}/companies/${activeFundraising?.id}`}
												className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
											/>
											<button
												onClick={handleCopyLink}
												className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
											>
												<Copy className="w-4 h-4" />
												Copy
											</button>
										</div>
										<p className="text-xs text-gray-500 mt-2">
											Share this link with potential investors to showcase your
											campaign
										</p>
									</div>

									<div className="bg-blue-50 rounded-lg p-4">
										<div className="flex items-start gap-3">
											<Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
											<div className="text-sm text-blue-800">
												<p className="font-medium mb-1">Sharing Tips:</p>
												<ul className="text-xs space-y-1 text-blue-700">
													<li>• Share on social media platforms</li>
													<li>• Send directly to potential investors</li>
													<li>• Include in your pitch deck presentations</li>
													<li>• Add to your company website</li>
												</ul>
											</div>
										</div>
									</div>

									{/* <div className="grid grid-cols-2 gap-3">
										<button
											onClick={() => {
												const campaignLink = `${process.env.NEXT_PUBLIC_FRONTEND}/companies/${activeFundraising?.id}`;
												const text = `Check out our fundraising campaign: ${campaignLink}`;
												window.open(
													`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
													"_blank",
												);
											}}
											className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 justify-center text-sm"
										>
											<ExternalLink className="w-4 h-4" />
											Twitter
										</button>
										<button
											onClick={() => {
												const campaignLink = `${process.env.NEXT_PUBLIC_FRONTEND}/companies/${activeFundraising?.id}`;
												window.open(
													`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(campaignLink)}`,
													"_blank",
												);
											}}
											className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 justify-center text-sm"
										>
											<ExternalLink className="w-4 h-4" />
											LinkedIn
										</button>
									</div> */}
								</div>
							</div>

							{/* Footer */}
							<div className="p-6 pt-4 border-t border-gray-100">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setIsShareModalOpen(false)}
									className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
								>
									Close
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Fundraising Modal */}
			<AnimatePresence>
				{isModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
						onClick={(e) => {
							// Only close if clicking the backdrop, not the modal content
							// if (e.target === e.currentTarget) {
							// 	setIsModalOpen(false);
							// }
						}}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							{/* Header - Fixed */}
							<div className="p-6 pb-4 border-b border-gray-100">
								<div className="text-center">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
										<Rocket className="w-6 h-6 text-white" />
									</div>
									<h2 className="text-xl font-bold text-gray-900 mb-1">
										Start Fundraising
									</h2>
									<p className="text-sm text-gray-600">
										Set up your fundraising campaign details
									</p>
								</div>
							</div>

							{/* Content - Scrollable */}
							<div className="flex-1 overflow-y-auto p-6">
								<div className="space-y-5">
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Equity Percentage (%)
											<span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="number"
											min="0.1"
											max="100"
											step="0.1"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
											placeholder="e.g., 10.5"
											value={fundingDetails.equityPercentage}
											onChange={(e) => {
												e.stopPropagation();
												setFundingDetails((prev) => ({
													...prev,
													equityPercentage: e.target.value,
												}));
											}}
											onFocus={(e) => e.stopPropagation()}
											onBlur={(e) => e.stopPropagation()}
											onClick={(e) => e.stopPropagation()}
										/>
										<p className="text-xs text-gray-500 mt-1">
											Percentage of company equity to offer investors
										</p>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Funding Amount ($)
											<span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="number"
											min="1000"
											step="1000"
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
											placeholder="e.g., 100000"
											value={fundingDetails.fundingAmount}
											onChange={(e) => {
												e.stopPropagation();
												setFundingDetails((prev) => ({
													...prev,
													fundingAmount: e.target.value,
												}));
											}}
											onFocus={(e) => e.stopPropagation()}
											onBlur={(e) => e.stopPropagation()}
											onClick={(e) => e.stopPropagation()}
										/>
										<p className="text-xs text-gray-500 mt-1">
											Total amount you want to raise
										</p>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Campaign End Date
											<span className="text-red-500 ml-1">*</span>
										</label>
										<input
											type="date"
											min={
												new Date(Date.now() + 24 * 60 * 60 * 1000)
													.toISOString()
													.split("T")[0]
											}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
											value={fundingDetails.date}
											onChange={(e) => {
												e.stopPropagation();
												setFundingDetails((prev) => ({
													...prev,
													date: e.target.value,
												}));
											}}
											onFocus={(e) => e.stopPropagation()}
											onBlur={(e) => e.stopPropagation()}
											onClick={(e) => e.stopPropagation()}
										/>
										<p className="text-xs text-gray-500 mt-1">
											When your fundraising campaign will end
										</p>
									</div>

									<div className="bg-blue-50 rounded-lg p-4">
										<div className="flex items-start gap-3">
											<Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
											<div className="text-sm text-blue-800">
												<p className="font-medium mb-1">Before you start:</p>
												<ul className="text-xs space-y-1 text-blue-700">
													<li>• Ensure your company profile is complete</li>
													<li>• Have your legal documents ready</li>
													<li>• Review our terms and conditions</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Footer - Fixed */}
							<div className="p-6 pt-4 border-t border-gray-100">
								<div className="flex gap-3">
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={(e) => {
											e.stopPropagation();
											setIsModalOpen(false);
										}}
										className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
									>
										Cancel
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={(e) => {
											e.stopPropagation();
											handleRaiseFunds();
										}}
										disabled={
											!fundingDetails.equityPercentage ||
											!fundingDetails.fundingAmount ||
											!fundingDetails.date
										}
										className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Launch Campaign
									</motion.button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Confirmation Dialog */}
			<AnimatePresence>
				{openConfirmDialog && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
						>
							<div className="text-center mb-6">
								<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<AlertCircle className="w-8 h-8 text-red-600" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									Confirm Action
								</h3>
								<p className="text-gray-600">
									{actionType === "accept" &&
										"Are you sure you want to accept this investment offer? This action cannot be undone."}
									{actionType === "reject" &&
										"Are you sure you want to reject this investment offer? The investor will be notified."}
									{actionType === "cancelFundraising" &&
										"Are you sure you want to cancel your active fundraising campaign? This will notify all investors and cannot be undone."}
									{actionType === "cancelPendingFundraising" &&
										"Are you sure you want to cancel your pending fundraising campaign? You'll need to restart the process."}
								</p>
							</div>

							<div className="flex gap-4">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setOpenConfirmDialog(false)}
									className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
								>
									Cancel
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={handleConfirmAction}
									className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
								>
									Confirm
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Fundraisers Dialog */}
			<AnimatePresence>
				{openFundraisersDialog && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
						>
							<div className="p-8 border-b border-gray-200">
								<h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
									<Users className="w-7 h-7 text-blue-600" />
									Campaign Investors
								</h3>
								<p className="text-gray-600 mt-1">
									View all investors in this campaign
								</p>
							</div>

							<div className="p-8 overflow-y-auto max-h-96">
								{fundraisers.length === 0 ? (
									<NoDataState
										icon={Users}
										title="No Investors Found"
										description="This campaign doesn't have any investors yet. Investors will appear here once they start investing in your campaign."
									/>
								) : (
									<div className="overflow-x-auto">
										<table className="w-full bg-white rounded-lg overflow-hidden">
											<thead className="bg-gray-100">
												<tr>
													<th className="text-left py-4 px-6 font-semibold text-gray-900">
														Investor
													</th>
													<th className="text-left py-4 px-6 font-semibold text-gray-900">
														Username
													</th>
													<th className="text-left py-4 px-6 font-semibold text-gray-900">
														Portions
													</th>
													<th className="text-left py-4 px-6 font-semibold text-gray-900">
														Price/Portion
													</th>
													<th className="text-left py-4 px-6 font-semibold text-gray-900">
														Total Investment
													</th>
													<th className="text-left py-4 px-6 font-semibold text-gray-900">
														Status
													</th>
												</tr>
											</thead>
											<tbody>
												{fundraisers.map((fundraiser, index) => (
													<motion.tr
														key={fundraiser.id}
														initial={{ opacity: 0, y: 20 }}
														animate={{ opacity: 1, y: 0 }}
														transition={{ delay: index * 0.1 }}
														className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
													>
														<td className="py-4 px-6">
															<div className="flex items-center gap-3">
																<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
																	{(fundraiser.investorType === "User"
																		? fundraiser.investorUser?.name
																		: fundraiser.investorCompany?.name
																	)?.charAt(0) || "?"}
																</div>
																<div>
																	<p className="font-semibold text-gray-900">
																		{fundraiser.investorType === "User"
																			? fundraiser.investorUser?.name ||
																				"Unknown User"
																			: fundraiser.investorCompany?.name ||
																				"Unknown Company"}
																	</p>
																	<p className="text-sm text-gray-500">
																		{fundraiser.investorType}
																	</p>
																</div>
															</div>
														</td>
														<td className="py-4 px-6 text-gray-600">
															@
															{fundraiser.investorType === "User"
																? fundraiser.investorUser?.account?.username ||
																	"unknown"
																: fundraiser.investorCompany?.account
																		?.username || "unknown"}
														</td>
														<td className="py-4 px-6 font-semibold">
															{fundraiser.portions}
														</td>
														<td className="py-4 px-6 font-semibold">
															{formatCurrency(fundraiser.pricePerPortion)}
														</td>
														<td className="py-4 px-6 font-semibold text-green-600">
															{formatCurrency(fundraiser.fundingAmount)}
														</td>
														<td className="py-4 px-6">
															<span
																className={`px-3 py-1 rounded-full text-xs font-semibold ${
																	fundraiser.status === "Completed"
																		? "bg-green-100 text-green-800"
																		: "bg-yellow-100 text-yellow-800"
																}`}
															>
																{fundraiser.status}
															</span>
														</td>
													</motion.tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>

							<div className="p-8 border-t border-gray-200">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setOpenFundraisersDialog(false)}
									className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
								>
									Close
								</motion.button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Snackbar */}
			<AnimatePresence>
				{snackbar.open && (
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className="fixed bottom-6 right-6 z-50"
						onAnimationComplete={() => {
							if (snackbar.open) {
								setTimeout(
									() => setSnackbar({ ...snackbar, open: false }),
									4000,
								);
							}
						}}
					>
						<div
							className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md ${
								snackbar.severity === "success"
									? "bg-green-600 text-white"
									: snackbar.severity === "error"
										? "bg-red-600 text-white"
										: "bg-blue-600 text-white"
							}`}
						>
							{snackbar.severity === "success" && (
								<CheckCircle className="w-5 h-5" />
							)}
							{snackbar.severity === "error" && <XCircle className="w-5 h-5" />}
							{snackbar.severity === "info" && (
								<AlertCircle className="w-5 h-5" />
							)}
							<span className="font-medium">{snackbar.message}</span>
							<button
								onClick={() => setSnackbar({ ...snackbar, open: false })}
								className="ml-2 hover:opacity-80 transition-opacity"
							>
								<XCircle className="w-4 h-4" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
