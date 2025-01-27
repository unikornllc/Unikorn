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
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";
import { styled } from "@mui/system";

const FormBox = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(4),
}));

export function InvestmentForm({ fundingData }) {
	const [partsToInvest, setPartsToInvest] = useState(1);
	const [user, setUser] = useState({ walletBalance: 2000 });
	const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
	const [openErrorDialog, setOpenErrorDialog] = useState(false);

	const fetchUser = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/getCurrentUser`,
				{
					withCredentials: true,
				},
			);
			return response.data;
		} catch (err) {
			console.error("Error fetching user Certifications:", err);
		}
	};
	useEffect(() => {}, []);

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

	const totalInvestment = partsToInvest * fundingData.portionAmount;

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

	const handleConfirmInvestment = () => {
		setOpenConfirmDialog(false);

		fetch(`/api/companies/${companyUsername}/invest`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId: user.id, parts: partsToInvest }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Investment failed");
				}
				return response.json();
			})
			.then((data) => {
				alert("Investment successful!");
				setUser((prevUser) => ({
					...prevUser,
					walletBalance: prevUser.walletBalance - totalInvestment,
				}));
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("Investment failed.");
			});
	};

	const handleCloseConfirmDialog = () => {
		setOpenConfirmDialog(false);
	};

	const handleCloseErrorDialog = () => {
		setOpenErrorDialog(false);
	};

	return (
		<FormBox>
			<Typography variant="h6" gutterBottom>
				Invest in this Company
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
							<IconButton disabled>
								<PercentIcon />
							</IconButton>
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
				disabled={!user}
				sx={{
					marginTop: 2,
					transition: "transform 0.2s",
					"&:hover": {
						transform: "scale(1.05)",
					},
				}}
			>
				Invest Now
			</Button>

			<Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
				<DialogTitle>Confirm Investment</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to invest ${totalInvestment.toLocaleString()}{" "}
						for {equityToReceive}% equity?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseConfirmDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirmInvestment} color="primary">
						Confirm
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
		</FormBox>
	);
}
