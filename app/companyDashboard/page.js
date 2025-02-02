"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	CircularProgress,
	Box,
	Grid,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Snackbar,
	Alert,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";

export default function CompanyDashboard() {
	const [raisingFund, setRaisingFund] = useState(null);
	const [investmentOffers, setInvestmentOffers] = useState([]);
	const [selectedOffer, setSelectedOffer] = useState(null);
	const [actionType, setActionType] = useState("");
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [handlingItems, setHandlingItems] = useState({});

	const fetchRaisingFundData = async () => {
		try {
			const response = await axios
				.get(`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/active`, {
					withCredentials: true,
				})
				.then((response) => {
					console.log(response.data);
					setRaisingFund(response.data);
				});
		} catch (error) {
			console.error("Error fetching raising fund data:", error);
		}
	};

	const fetchInvestmentOffers = async () => {
		try {
			const response = await axios
				.get(`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/offers`, {
					withCredentials: true,
				})
				.then((response) => {
					console.log(response.data);
					setInvestmentOffers(response.data);
				});
		} catch (error) {
			console.error("Error fetching investment offers:", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await fetchRaisingFundData();
			await fetchInvestmentOffers();
			setLoading(false);
		};
		fetchData();
	}, []);

	const handleActionClick = (offer, type) => {
		setSelectedOffer(offer);
		setActionType(type);
		setOpenConfirmDialog(true);
	};

	const handleConfirmAction = async () => {
		setOpenConfirmDialog(false);
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
			}
			await fetchRaisingFundData();
			await fetchInvestmentOffers();
		} catch (error) {
			console.error("Error processing offer:", error);
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

	if (!raisingFund) {
		return (
			<Typography variant="h6" align="center" style={{ marginTop: 20 }}>
				No active raising fund found.
			</Typography>
		);
	}

	return (
		<Box maxWidth={1000} margin="auto" marginTop={4}>
			<Card>
				<CardContent>
					<Typography variant="h5" gutterBottom>
						Raising Fund Progress
					</Typography>
					<Grid container spacing={4} alignItems="center">
						<Grid item xs={12} md={6}>
							<Box position="relative" display="inline-flex">
								<CircularProgress
									variant="determinate"
									value={raisingFund.fundedPercentage}
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
									>{`${raisingFund.fundedPercentage}%`}</Typography>
									<Typography variant="body2" color="textSecondary">
										Funded
									</Typography>
								</Box>
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="body1" gutterBottom>
								<strong>Total Amount Required:</strong> $
								{raisingFund.totalAmount}
							</Typography>
							<Typography variant="body1" gutterBottom>
								<strong>Total Equity Offered:</strong> {raisingFund.totalEquity}
								%
							</Typography>

							<Typography variant="body1" gutterBottom>
								<strong>Remaining Equity:</strong> {raisingFund.remainingEquity}
								%
							</Typography>
							<Typography variant="body1" gutterBottom>
								<strong>Portions Available:</strong>{" "}
								{raisingFund.remainingPortions} out of{" "}
								{raisingFund.totalPortions}
							</Typography>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			<Box marginTop={4}>
				<Typography variant="h6" gutterBottom>
					Investment Offers
				</Typography>
				{investmentOffers.length === 0 ? (
					<Typography>No investment offers at this time.</Typography>
				) : (
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
										<Box
											title={
												offer.investorType === "User"
													? offer.investorUser?.name
													: offer.investorCompany?.name
											}
										>
											{offer.investorType === "User"
												? offer.investorUser?.name
												: offer.investorCompany?.name}
										</Box>
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
				)}
			</Box>

			<Dialog
				open={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
			>
				<DialogTitle>
					{actionType === "accept" ? "Accept Offer" : "Reject Offer"}
				</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to {actionType} this offer from{" "}
						{selectedOffer?.investorType === "User"
							? selectedOffer?.investorUser?.name
							: selectedOffer?.investorCompany?.name}
						?
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
