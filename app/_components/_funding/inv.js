import React, { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	InputAdornment,
	IconButton,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import { styled } from "@mui/system";

const FormBox = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(4),
}));

export function InvestmentForm({
	mode, // 'invest' or 'offer'
	companyUsername,
	partAmount,
	partEquity,
	remainingParts,
	remainingEquity,
}) {
	const [partsToInvest, setPartsToInvest] = useState(1);
	const [offeredPricePerPart, setOfferedPricePerPart] = useState(partAmount);
	const [user, setUser] = useState(null); // Fetch current user details

	// Fetch user data on component mount
	useEffect(() => {
		// Fetch current user details
		fetch("/api/users/current") // Adjust the API endpoint to match your backend
			.then((response) => response.json())
			.then((data) => {
				setUser(data); // Assume 'data' includes { id, walletBalance }
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
			});
	}, []);

	// Calculate the maximum number of parts the user can invest in
	const maxPartsByEquity = Math.floor(remainingEquity / partEquity);
	const maxPartsToInvest = Math.min(remainingParts, maxPartsByEquity);

	// Calculate the equity to receive
	const equityToReceive = (partsToInvest * partEquity).toFixed(2);

	// Calculate total investment amount
	const totalInvestment =
		mode === "invest"
			? partsToInvest * partAmount
			: partsToInvest * offeredPricePerPart;

	const handleInvestment = async () => {
		if (!user) {
			alert("User data is loading. Please wait.");
			return;
		}

		// Validate input
		if (partsToInvest < 1 || partsToInvest > maxPartsToInvest) {
			alert("Invalid number of parts.");
			return;
		}

		if (mode === "invest") {
			// Check if user has sufficient funds
			if (user.walletBalance < totalInvestment) {
				alert("You do not have enough funds in your wallet.");
				return;
			}

			const investmentData = {
				raisingFundsId: companyUsername, // Assuming companyUsername can identify the fundraising
				portions: partsToInvest,
			};
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_SERVER}/investments/fixedPrice`,
					investmentData,
					{
						withCredentials: true,
					},
				)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Investment failed.");
					}
					return response.json();
				})
				.then((data) => {
					alert("Investment successful!");
				})
				.catch((error) => {
					console.error("Error:", error);
					alert("Investment failed.");
				});
		} else if (mode === "offer") {
			if (offeredPricePerPart <= 0) {
				alert("Offered price per part must be greater than zero.");
				return;
			}

			const offerData = {
				raisingFundsId: companyUsername, // Assuming companyUsername can identify the fundraising
				portions: partsToInvest,
				offeredPricePerPortion: offeredPricePerPart,
			};

			// Send offer request to backend
			fetch("/api/invest/offer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// Include authentication token if required
				},
				body: JSON.stringify(offerData),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error("Offer submission failed.");
					}
					return response.json();
				})
				.then((data) => {
					alert("Investment offer submitted!");
					// Update UI or state as needed
				})
				.catch((error) => {
					console.error("Error:", error);
					alert("Offer submission failed.");
				});
		}
	};

	return (
		<FormBox>
			<Typography variant="h6" gutterBottom>
				{mode === "invest"
					? "Invest at Fixed Price"
					: "Make an Investment Offer"}
			</Typography>
			{/* Number of Parts Input */}
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
			{/* Offered Price Input (Only for Offer Mode) */}
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
								<IconButton disabled>$ {/* Dollar Sign */}</IconButton>
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
			{/* Display Total Investment and Equity */}
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
				{mode === "invest" ? "Invest Now" : "Submit Offer"}
			</Button>
		</FormBox>
	);
}
