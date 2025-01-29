import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	CircularProgress,
	Box,
	Tabs,
	Tab,
	Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { InvestmentForm } from "./InvestmentForm";

const FundingCard = styled(Card)(() => ({
	maxWidth: 600,
	margin: "auto",
	marginTop: 4,
	padding: 2,
	position: "relative",
	overflow: "visible",
}));

export function FundingComponent({ companyUsername }) {
	const [fundingData, setFundingData] = useState(null);
	const [tabValue, setTabValue] = useState(0);
	const [mode, setMode] = useState("invest");

	const fetchActiveFunding = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/active`,
				{
					params: { username: companyUsername },
					withCredentials: true,
				},
			);
			setFundingData(response.data);
		} catch (err) {
			console.error("Error fetching:", err);
		}
	};

	useEffect(() => {
		fetchActiveFunding();
	}, [companyUsername]);

	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

	const handleModeChange = (newMode) => {
		setMode(newMode);
	};

	if (!fundingData) {
		return;
	}

	return (
		<FundingCard>
			<CardContent>
				<Typography variant="h5" component="div" gutterBottom>
					Investment Opportunity in {fundingData.companyName}
				</Typography>

				<Grid container spacing={4} alignItems="center">
					<Grid item xs={12} md={6}>
						<Box position="relative" display="inline-flex">
							<CircularProgress
								variant="determinate"
								value={fundingData.fundedPercentage}
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
								>{`${fundingData.fundedPercentage.toFixed(0)}%`}</Typography>
								<Typography variant="body2" color="textSecondary">
									Funded
								</Typography>
							</Box>
						</Box>
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography variant="body1" gutterBottom>
							<strong>Total Amount Required:</strong> $
							{fundingData.totalAmount.toLocaleString()}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Total Equity Offered:</strong> {fundingData.totalEquity}%
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Remaining Amount:</strong> $
							{fundingData.remainingAmount.toLocaleString()}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Remaining Equity:</strong> {fundingData.remainingEquity}%
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Portions Available:</strong>{" "}
							{fundingData.remainingPortions} out of {fundingData.totalPortions}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Price Per Portion:</strong> $
							{fundingData.pricePerPortion.toLocaleString()}
						</Typography>
					</Grid>
				</Grid>

				<Tabs
					value={tabValue}
					onChange={handleTabChange}
					centered
					sx={{ marginTop: 4 }}
				>
					<Tab label="Invest" />
					<Tab label="Company Info" />
					<Tab label="FAQs" />
				</Tabs>

				{tabValue === 0 && (
					<div>
						<Tabs
							value={mode}
							onChange={(event, newValue) => setMode(newValue)}
							indicatorColor="primary"
							textColor="primary"
							variant="fullWidth"
							sx={{ marginTop: 2 }}
						>
							<Tab value="invest" label="Invest at Fixed Price" />
							<Tab value="offer" label="Make an Offer" />
						</Tabs>
						<InvestmentForm mode={mode} fundingData={fundingData} />
					</div>
				)}
				{tabValue === 1 && (
					<Typography variant="body1" sx={{ marginTop: 2 }}>
						{fundingData.companyDescription}
					</Typography>
				)}
				{tabValue === 2 && (
					<Typography variant="body1" sx={{ marginTop: 2 }}>
						Here are some frequently asked questions...
					</Typography>
				)}
			</CardContent>
		</FundingCard>
	);
}
