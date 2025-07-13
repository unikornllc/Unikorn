import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	TextField,
	Button,
	Typography,
	InputAdornment,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Snackbar,
	CircularProgress,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import MuiAlert from "@mui/material/Alert";
import { styled } from "@mui/system";
import { useUnifiedPermissions } from "../../../_hooks/useUnifiedPermissions.js";
import { FeatureGuard, UpgradePrompt } from "../../_ui/UpgradePrompt.js";

const FormBox = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(4),
}));

export function InvestmentForm({ mode, fundingData }) {
	const [partsToInvest, setPartsToInvest] = useState(1);
	const [offeredPricePerPart, setOfferedPricePerPart] = useState(
		fundingData.pricePerPortion,
	);
	const [user, setUser] = useState({ walletBalance: "loading..." });
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openErrorDialog, setOpenErrorDialog] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");
	const { checkPermission, loading, error } = useUnifiedPermissions();
	const canInvest = checkPermission('INVESTING');

	const fetchWallet = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/getWallet`,
				{
					withCredentials: true,
				},
			);
			setUser({ walletBalance: response.data.amount });
		} catch (err) {
			console.error("Error fetching wallet:", err);
		}
	};

	useEffect(() => {
		fetchWallet();
	}, []);

	const maxPartsByEquity = Math.floor(
		fundingData.remainingEquity / fundingData.portionEquity,
	);
	const maxPartsToInvest = Math.min(
		fundingData.remainingPortions,
		maxPartsByEquity,
	);

	const equityToReceive = (partsToInvest * fundingData.portionEquity).toFixed(
		2,
	);

	const totalInvestment =
		mode === "invest"
			? partsToInvest * fundingData.pricePerPortion
			: partsToInvest * offeredPricePerPart;

	const handleInvestment = () => {
		if (!user) {
			alert("User data is loading. Please wait.");
			return;
		}

		if (partsToInvest < 1 || partsToInvest > maxPartsToInvest) {
			alert("Invalid number of parts.");
			return;
		}

		if (user.walletBalance < totalInvestment) {
			setOpenErrorDialog(true);
		} else {
			setOpenConfirmDialog(true);
		}
	};

	const handleConfirmInvestment = async () => {
		setOpenConfirmDialog(false);
		setIsSubmitting(true);
		try {
			if (mode === "invest") {
				await axios
					.post(
						`${process.env.NEXT_PUBLIC_SERVER}/api/investments/fixedPrice`,
						{
							raisingFundsId: fundingData.id,
							portions: partsToInvest,
						},
						{
							withCredentials: true,
						},
					)
					.then(() => {
						setSnackbarMessage("Investment successful!");
						setSnackbarSeverity("success");
						setUser((prevUser) => ({
							...prevUser,
							walletBalance: prevUser.walletBalance - totalInvestment,
						}));
					});
			} else if (mode === "offer") {
				await axios
					.post(
						`${process.env.NEXT_PUBLIC_SERVER}/api/investments/negotiatePrice`,
						{
							walletBalance: user.walletBalance,
							raisingFundsId: fundingData.id,
							portions: partsToInvest,
							offeredPricePerPortion: offeredPricePerPart,
						},
						{
							withCredentials: true,
						},
					)
					.then(() => {
						setSnackbarMessage("Investment offer submitted!");
						setSnackbarSeverity("success");
					});
			}
			setSnackbarOpen(true);
		} catch (error) {
			console.error("Error:", error);
			setSnackbarMessage("Transaction failed. Please try again.");
			setSnackbarSeverity("error");
			setSnackbarOpen(true); // Show error Snackbar
		} finally {
			setIsSubmitting(false); // Stop loading indicator
		}
	};

	const handleCloseConfirmDialog = () => {
		setOpenConfirmDialog(false);
	};

	const handleCloseErrorDialog = () => {
		setOpenErrorDialog(false);
	};

	const handleUpgrade = () => {
		// Redirect to upgrade page or show upgrade modal
		window.location.href = "/settings?upgrade=true";
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<p className="text-red-600 mb-4">Error loading permissions</p>
					<button 
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	return (
		<FeatureGuard 
			feature="INVESTING" 
			permissions={{ canInvest }}
			fallback={
				<div className="flex items-center justify-center py-8">
					<UpgradePrompt 
						feature="INVESTING" 
						onUpgrade={handleUpgrade}
					/>
				</div>
			}
		>
			<FormBox>
				<Typography variant="h6" gutterBottom>
					{mode === "invest"
						? "Invest at Fixed Price"
						: "Make an Investment Offer"}
				</Typography>
				<TextField
					label="Number of Parts to Invest"
					type="number"
					InputProps={{
						inputProps: {
							min: 1,
							max: maxPartsToInvest,
						},
						startAdornment: (
							<InputAdornment position="start">
								<IconButton disabled></IconButton>
							</InputAdornment>
						),
					}}
					value={partsToInvest}
					onChange={(e) => {
						const value = parseInt(e.target.value);
						if (value > maxPartsToInvest) {
							setPartsToInvest(maxPartsToInvest);
						} else if (value < 1 || isNaN(value)) {
							setPartsToInvest(1);
						} else {
							setPartsToInvest(value);
						}
					}}
					variant="outlined"
					fullWidth
					margin="normal"
				/>
				{mode === "offer" && (
					<TextField
						label="Offered Price Per Part"
						type="number"
						InputProps={{
							inputProps: {
								min: 1,
							},
							startAdornment: (
								<InputAdornment position="start">
									<IconButton disabled>
										<AttachMoneyIcon />
									</IconButton>
								</InputAdornment>
							),
						}}
						value={offeredPricePerPart}
						onChange={(e) => {
							const value = parseFloat(e.target.value);
							if (value < 1 || isNaN(value)) {
								setOfferedPricePerPart(1);
							} else {
								setOfferedPricePerPart(value);
							}
						}}
						variant="outlined"
						fullWidth
						margin="normal"
					/>
				)}
				<Typography variant="body1" gutterBottom>
					Total Investment: ${totalInvestment.toLocaleString()}
				</Typography>
				<Typography variant="body1" gutterBottom>
					Equity to Receive: {equityToReceive}%
				</Typography>
				{user && (
					<Typography variant="body1" gutterBottom>
						Your Wallet Balance: ${user.walletBalance.toLocaleString()}
					</Typography>
				)}
				<Button
					variant="contained"
					color="primary"
					onClick={handleInvestment}
					size="large"
					disabled={!user || isSubmitting}
					sx={{
						marginTop: 2,
						transition: "transform 0.2s",
						"&:hover": {
							transform: "scale(1.05)",
						},
					}}
				>
					{isSubmitting ? (
						<CircularProgress size={24} color="inherit" />
					) : mode === "invest" ? (
						"Invest Now"
					) : (
						"Submit Offer"
					)}
				</Button>

				<Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
					<DialogTitle>
						{mode === "invest"
							? "Confirm Investment"
							: "Confirm Investment Offer"}
					</DialogTitle>
					<DialogContent>
						<Typography>
							{mode === "invest"
								? `Are you sure you want to invest $${totalInvestment.toLocaleString()} for ${equityToReceive}% equity?`
								: `Are you sure you want to offer $${offeredPricePerPart.toLocaleString()} per part for ${partsToInvest} parts? Total offer amount: $${totalInvestment.toLocaleString()}`}
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleCloseConfirmDialog}
							color="primary"
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmInvestment}
							color="primary"
							disabled={isSubmitting}
						>
							{isSubmitting ? <CircularProgress size={24} /> : "Confirm"}
						</Button>
					</DialogActions>
				</Dialog>

				<Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
					<DialogTitle>Insufficient Funds</DialogTitle>
					<DialogContent>
						<Typography>
							You do not have enough funds in your wallet to make this investment.
						</Typography>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleCloseErrorDialog} color="primary">
							OK
						</Button>
					</DialogActions>
				</Dialog>
				<Snackbar
					open={snackbarOpen}
					autoHideDuration={6000}
					onClose={() => setSnackbarOpen(false)}
					anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				>
					<MuiAlert
						elevation={6}
						variant="filled"
						onClose={() => setSnackbarOpen(false)}
						severity={snackbarSeverity}
					>
						{snackbarMessage}
					</MuiAlert>
				</Snackbar>
			</FormBox>
		</FeatureGuard>
	);
}
