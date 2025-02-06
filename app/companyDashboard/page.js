"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Snackbar,
	Alert,
	CircularProgress,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from "@mui/material";

export default function CompanyDashboard() {
	const [activeFundraising, setActiveFundraising] = useState(null);
	const [pendingFundraising, setPendingFundraising] = useState(null);
	const [pastFundraisings, setPastFundraisings] = useState([]);
	const [investmentOffers, setInvestmentOffers] = useState([]);
	const [fundraisers, setFundraisers] = useState([]);
	const [selectedOffer, setSelectedOffer] = useState(null);
	const [actionType, setActionType] = useState(""); // 'accept', 'reject', 'cancelFundraising', 'cancelPendingFundraising'
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openFundraisersDialog, setOpenFundraisersDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [handlingItems, setHandlingItems] = useState({});

	const fetchDashboardData = async () => {
		try {
			// Fetch active fundraising
			const activeResponse = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/active`,
				{ withCredentials: true },
			);
			setActiveFundraising(activeResponse.data.activeFundraising);

			// Fetch pending fundraising
			const pendingResponse = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/pending`,
				{ withCredentials: true },
			);
			setPendingFundraising(pendingResponse.data.pendingFundraising);

			// Fetch past fundraisings
			const pastResponse = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/past`,
				{ withCredentials: true },
			);
			setPastFundraisings(pastResponse.data.pastFundraisings);
			// Fetch investment offers for active fundraising
			if (activeResponse.data.activeFundraising) {
				const offersResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/offers`,
					{ withCredentials: true },
				);
				setInvestmentOffers(offersResponse.data.offers);

				// Fetch fundraisers for active fundraising
				const fundraisersResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/fundraisers`,
					{
						params: {
							raisingFundsId: activeResponse.data.activeFundraising.id,
						},
						withCredentials: true,
					},
				);
				setFundraisers(fundraisersResponse.data.fundraisers);
			} else {
				setInvestmentOffers([]);
				setFundraisers([]);
			}
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchDashboardData();
		setLoading(false);
	}, []);

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
		// if(actionType !== "cancelFundraising" && actionType !== "cancelPendingFundraising" ){

		// }
		setHandlingItems((prevState) => ({
			...prevState,
			[selectedOffer.id]: true,
		}));
		try {
			if (actionType === "accept") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/offer/accept`,
					{ offerId: selectedOffer.id },
					{ withCredentials: true },
				);
				setSnackbar({
					open: true,
					message: "Offer accepted successfully",
					severity: "success",
				});
			} else if (actionType === "reject") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/offer/reject`,
					{ offerId: selectedOffer.id },
					{ withCredentials: true },
				);
				setSnackbar({
					open: true,
					message: "Offer rejected",
					severity: "info",
				});
			} else if (actionType === "cancelFundraising") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/cancel`,
					{ raisingFundsId: activeFundraising.id },
					{ withCredentials: true },
				);
				setSnackbar({
					open: true,
					message: "Fundraising cancelled successfully",
					severity: "success",
				});
			} else if (actionType === "cancelPendingFundraising") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/cancel`,
					{ raisingFundsId: pendingFundraising.id },
					{ withCredentials: true },
				);
				setSnackbar({
					open: true,
					message: "Pending fundraising cancelled successfully",
					severity: "success",
				});
			}
			await fetchDashboardData();
		} catch (error) {
			console.error("Error processing action:", error);
			setSnackbar({
				open: true,
				message: "An error occurred. Please try again.",
				severity: "error",
			});
		} finally {
			setHandlingItems((prevState) => {
				const newState = { ...prevState };
				delete newState[selectedOffer.id];
				return newState;
			});
		}
	};

	const handleContinueContract = () => {
		window.location.href = `/signContract/${pendingFundraising.id}`;
	};

	const handleViewFundraisers = async (fundraising) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/fundraisers`,
				{ params: { raisingFundsId: fundraising.id }, withCredentials: true },
			);
			setFundraisers(response.data.fundraisers);
			setOpenFundraisersDialog(true);
		} catch (error) {
			console.error("Error fetching fundraisers:", error);
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	if (loading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="80vh"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box maxWidth={1000} margin="auto" marginTop={4}>
			<Typography variant="h4" gutterBottom>
				Company Dashboard
			</Typography>

			{/* Pending Fundraising */}
			{pendingFundraising && (
				<Card sx={{ marginBottom: 4 }}>
					<CardContent>
						<Typography variant="h5" gutterBottom>
							Pending Fundraising
						</Typography>
						<Typography variant="body1" gutterBottom>
							Please complete the contract to activate your fundraising.
						</Typography>
						{/* Display fundraising details */}
						<Grid container spacing={4} alignItems="center">
							<Grid item xs={12} md={6}>
								<Typography variant="body1" gutterBottom>
									<strong>Total Amount Required:</strong> $
									{pendingFundraising.fundingAmount}
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Total Equity Offered:</strong>{" "}
									{pendingFundraising.equityPercentage}%
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Portions Available:</strong>{" "}
									{pendingFundraising.totalPortions}
								</Typography>
							</Grid>
						</Grid>
						<Box marginTop={2}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleContinueContract}
								sx={{ marginRight: 2 }}
							>
								Continue Contract
							</Button>
							<Button
								variant="outlined"
								color="error"
								onClick={() =>
									handleFundraisingActionClick("cancelPendingFundraising")
								}
							>
								Cancel Fundraising
							</Button>
						</Box>
					</CardContent>
				</Card>
			)}

			{/* Active Fundraising */}
			{activeFundraising && (
				<Card sx={{ marginBottom: 4 }}>
					<CardContent>
						<Typography variant="h5" gutterBottom>
							Active Fundraising
						</Typography>
						{/* Display fundraising progress */}
						<Grid container spacing={4} alignItems="center">
							<Grid item xs={12} md={6}>
								{/* Progress Circle */}
								<Box position="relative" display="inline-flex">
									<CircularProgress
										variant="determinate"
										value={activeFundraising.fundedPercentage}
										size={180}
										thickness={4}
										color="primary"
									/>
									<Box
										top={0}
										left={0}
										bottom={0}
										right={0}
										position="absolute"
										display="flex"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
									>
										<Typography
											variant="h5"
											component="div"
											color="textPrimary"
										>{`${activeFundraising.fundedPercentage}%`}</Typography>
										<Typography variant="body2" color="textSecondary">
											Funded
										</Typography>
									</Box>
								</Box>
							</Grid>
							<Grid item xs={12} md={6}>
								<Typography variant="body1" gutterBottom>
									<strong>Total Amount Required:</strong> $
									{activeFundraising.fundingAmount}
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Total Equity Offered:</strong>{" "}
									{activeFundraising.equityPercentage}%
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Remaining Equity:</strong>{" "}
									{activeFundraising.remainingEquity}%
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Portions Available:</strong>{" "}
									{activeFundraising.remainingPortions} out of{" "}
									{activeFundraising.totalPortions}
								</Typography>
							</Grid>
						</Grid>
						<Box marginTop={2}>
							{activeFundraising.fundedPercentage < 50 && (
								<Button
									variant="outlined"
									color="error"
									onClick={() =>
										handleFundraisingActionClick("cancelFundraising")
									}
								>
									Cancel Fundraising
								</Button>
							)}
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleViewFundraisers(activeFundraising)}
								sx={{ marginLeft: 2 }}
							>
								View Fundraisers
							</Button>
						</Box>
					</CardContent>
				</Card>
			)}

			{/* Investment Offers */}
			{activeFundraising && investmentOffers.length > 0 && (
				<Box marginBottom={4}>
					<Typography variant="h6" gutterBottom>
						Investment Offers
					</Typography>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Investor</TableCell>
								<TableCell>Portions</TableCell>
								<TableCell>Offered Price Per Portion</TableCell>
								<TableCell>Total Offered Price</TableCell>
								<TableCell>Date</TableCell>
								<TableCell>Status</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{investmentOffers.map((offer) => (
								<TableRow key={offer.id}>
									<TableCell
										sx={{
											maxWidth: 150,
											overflow: "hidden",
											textOverflow: "ellipsis",
										}}
									>
										{offer.investorType === "User"
											? offer.investorUser?.name
											: offer.investorCompany?.name}
									</TableCell>
									<TableCell>{offer.portions}</TableCell>
									<TableCell>${offer.offeredPricePerPortion}</TableCell>
									<TableCell>${offer.totalOfferedPrice}</TableCell>
									<TableCell>
										{new Date(offer.date).toLocaleDateString()}
									</TableCell>
									<TableCell>{offer.status}</TableCell>
									<TableCell align="right">
										{offer.status === "Pending" && (
											<div>
												<Button
													variant="contained"
													color="primary"
													size="small"
													onClick={() => handleActionClick(offer, "accept")}
													sx={{ marginRight: 1 }}
													disabled={handlingItems[offer.id]}
												>
													{handlingItems[offer.id] ? (
														<CircularProgress size={24} color="inherit" />
													) : (
														"Accept"
													)}
												</Button>
												<Button
													variant="contained"
													color="error"
													size="small"
													onClick={() => handleActionClick(offer, "reject")}
													disabled={handlingItems[offer.id]}
												>
													{handlingItems[offer.id] ? (
														<CircularProgress size={24} color="inherit" />
													) : (
														"Reject"
													)}
												</Button>
											</div>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			)}

			{/* Past Fundraisings */}
			{pastFundraisings.length > 0 && (
				<Box>
					<Typography variant="h5" gutterBottom>
						Past Fundraisings
					</Typography>
					{pastFundraisings.map((fundraising) => (
						<Card key={fundraising.id} sx={{ marginBottom: 4 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									{fundraising.status} Fundraising
								</Typography>
								{/* Display fundraising details */}
								<Typography variant="body1" gutterBottom>
									<strong>Total Amount Required:</strong> $
									{fundraising.fundingAmount}
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Total Equity Offered:</strong>{" "}
									{fundraising.equityPercentage}%
								</Typography>
								<Typography variant="body1" gutterBottom>
									<strong>Status:</strong> {fundraising.status}
								</Typography>
								{fundraising.status === "Completed" && (
									<Box marginTop={2}>
										<Button
											variant="contained"
											color="primary"
											onClick={() => handleViewFundraisers(fundraising)}
										>
											View Fundraisers
										</Button>
									</Box>
								)}
							</CardContent>
						</Card>
					))}
				</Box>
			)}

			{/* Fundraisers Dialog */}
			<Dialog
				open={openFundraisersDialog}
				onClose={() => setOpenFundraisersDialog(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>Fundraisers</DialogTitle>
				<DialogContent>
					{fundraisers ? (
						<Typography>No fundraisers found.</Typography>
					) : (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Investor</TableCell>
									<TableCell>Portions</TableCell>
									<TableCell>Price Per Portion</TableCell>
									<TableCell>Total Investment</TableCell>
									<TableCell>Contract Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{fundraisers.map((fundraiser) => (
									<TableRow key={fundraiser.id}>
										<TableCell>
											{fundraiser.investorType === "User"
												? fundraiser.investorUser?.name
												: fundraiser.investorCompany?.name}
										</TableCell>
										<TableCell>{fundraiser.portions}</TableCell>
										<TableCell>${fundraiser.pricePerPortion}</TableCell>
										<TableCell>${fundraiser.fundingAmount}</TableCell>
										<TableCell>{fundraiser.status}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setOpenFundraisersDialog(false)}
						color="primary"
					>
						Close
					</Button>
				</DialogActions>
			</Dialog>

			{/* Confirmation Dialog */}
			<Dialog
				open={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
			>
				<DialogTitle>Confirm Action</DialogTitle>
				<DialogContent>
					<Typography>
						{actionType === "accept" &&
							"Are you sure you want to accept this offer?"}
						{actionType === "reject" &&
							"Are you sure you want to reject this offer?"}
						{actionType === "cancelFundraising" &&
							"Are you sure you want to cancel the active fundraising?"}
						{actionType === "cancelPendingFundraising" &&
							"Are you sure you want to cancel the pending fundraising?"}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirmDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirmAction} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar for notifications */}
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: "100%" }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
}
