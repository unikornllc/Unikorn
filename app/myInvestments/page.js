"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Typography,
	Tabs,
	Tab,
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
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";

export default function MyInvestmentsPage() {
	const [tabValue, setTabValue] = useState(0);
	const [investments, setInvestments] = useState([]);
	const [investmentOffers, setInvestmentOffers] = useState([]);
	const [selectedItem, setSelectedItem] = useState(null);
	const [actionType, setActionType] = useState("");
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: "",
		severity: "success",
	});
	const [cancellingItems, setCancellingItems] = useState({});
	const [loading, setLoading] = useState(true);

	const fetchInvestments = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/investments/my`,
				{
					withCredentials: true,
				},
			);
			setInvestments(response.data.investments);
		} catch (error) {
			console.error("Error fetching investments:", error);
		}
	};

	const fetchInvestmentOffers = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/investments/offers`,
				{
					withCredentials: true,
				},
			);
			setInvestmentOffers(response.data.offers);
		} catch (error) {
			console.error("Error fetching investment offers:", error);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			await fetchInvestments();
			await fetchInvestmentOffers();
			setLoading(false);
		};
		fetchData();
	}, []);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleCancelClick = (item, type) => {
		setSelectedItem(item);
		setActionType(type);
		setOpenConfirmDialog(true);
	};

	const handleConfirmCancel = async () => {
		setOpenConfirmDialog(false);

		setCancellingItems((prevState) => ({
			...prevState,
			[selectedItem.id]: true,
		}));

		try {
			if (actionType === "cancelInvestment") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/investments/cancel`,
					{ fundraiserId: selectedItem.id },
					{ withCredentials: true },
				);
				setSnackbar({
					open: true,
					message: "Investment cancelled successfully",
					severity: "success",
				});
			} else if (actionType === "cancelOffer") {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/investments/offer/cancel`,
					{ offerId: selectedItem.id },
					{ withCredentials: true },
				);
				setSnackbar({
					open: true,
					message: "Investment offer cancelled successfully",
					severity: "success",
				});
			}
			await fetchInvestments();
			await fetchInvestmentOffers();
		} catch (error) {
			console.error("Error cancelling:", error);
			setSnackbar({
				open: true,
				message: "An error occurred. Please try again.",
				severity: "error",
			});
		} finally {
			setCancellingItems((prevState) => {
				const newState = { ...prevState };
				delete newState[selectedItem.id];
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

	return (
		<Box maxWidth={1000} margin="auto" marginTop={4}>
			<Tabs value={tabValue} onChange={handleTabChange} centered>
				<Tab label="My Investments" />
				<Tab label="My Investment Offers" />
			</Tabs>

			{tabValue === 0 && (
				<Box marginTop={4}>
					<Typography variant="h6" gutterBottom>
						My Investments
					</Typography>
					{investments.length === 0 ? (
						<Typography>You have not made any investments yet.</Typography>
					) : (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Company</TableCell>
									<TableCell>Portions</TableCell>
									<TableCell>Price Per Portion</TableCell>
									<TableCell>Total Investment</TableCell>
									<TableCell>Equity</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Date</TableCell>
									<TableCell align="right">Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{investments.map((investment) => (
									<TableRow key={investment.id}>
										<TableCell>
											{investment.raisingFunds.company.name}
										</TableCell>
										<TableCell>{investment.portions}</TableCell>
										<TableCell>
											${investment.pricePerPortion.toFixed(1)}
										</TableCell>
										<TableCell>
											${investment.fundingAmount.toFixed(1)}
										</TableCell>
										<TableCell>
											{investment.equityPercentage.toFixed(1)}
										</TableCell>
										<TableCell>{investment.status}</TableCell>
										<TableCell>
											{new Date(investment.date).toLocaleDateString()}
										</TableCell>
										<TableCell align="right">
											{investment.status == "Pending" && (
												<Button
													variant="contained"
													color="error"
													size="small"
													onClick={() =>
														handleCancelClick(investment, "cancelInvestment")
													}
													disabled={cancellingItems[investment.id]}
												>
													{cancellingItems[investment.id] ? (
														<CircularProgress size={24} color="inherit" />
													) : (
														"Cancel Investment"
													)}
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</Box>
			)}

			{tabValue === 1 && (
				<Box marginTop={4}>
					<Typography variant="h6" gutterBottom>
						My Investment Offers
					</Typography>
					{investmentOffers.length === 0 ? (
						<Typography>
							You have not made any investment offers yet.
						</Typography>
					) : (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Company</TableCell>
									<TableCell>Portions</TableCell>
									<TableCell>Offered Price Per Portion</TableCell>
									<TableCell>Total Offered Price</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Date</TableCell>
									<TableCell align="right">Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{investmentOffers.map((offer) => (
									<TableRow key={offer.id}>
										<TableCell>{offer.raisingFunds.company.name}</TableCell>
										<TableCell>{offer.portions}</TableCell>
										<TableCell>
											${offer.offeredPricePerPortion.toFixed(1)}
										</TableCell>
										<TableCell>${offer.totalOfferedPrice.toFixed(1)}</TableCell>
										<TableCell>{offer.status}</TableCell>
										<TableCell>
											{new Date(offer.date).toLocaleDateString()}
										</TableCell>
										<TableCell align="right">
											{offer.status === "Pending" && (
												<Button
													variant="contained"
													color="error"
													size="small"
													onClick={() =>
														handleCancelClick(offer, "cancelOffer")
													}
													disabled={cancellingItems[offer.id]}
												>
													{cancellingItems[offer.id] ? (
														<CircularProgress size={24} color="inherit" />
													) : (
														"Cancel Offer"
													)}
												</Button>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</Box>
			)}

			<Dialog
				open={openConfirmDialog}
				onClose={() => setOpenConfirmDialog(false)}
			>
				<DialogTitle>Confirm Cancellation</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to cancel this{" "}
						{actionType === "cancelInvestment"
							? "investment."
							: "investment offer."}
						?
					</Typography>
					<Typography component="p" className="text-center">
						<span className="text-red-600 font-bold">
							A 5% fee will be applied.
						</span>
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenConfirmDialog(false)} color="primary">
						No
					</Button>
					<Button onClick={handleConfirmCancel} color="primary">
						Yes
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
