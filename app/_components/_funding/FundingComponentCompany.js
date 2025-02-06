import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	CardMedia,
	Typography,
	Button,
	Grid,
	CircularProgress,
	Box,
	Tabs,
	Tab,
	Switch,
} from "@mui/material";
import { styled } from "@mui/system";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PercentIcon from "@mui/icons-material/Percent";

// const FundingCard = styled(Card)(({ theme }) => ({
// 	maxWidth: 800,
// 	margin: "auto",
// 	marginTop: theme.spacing(4),
// 	padding: theme.spacing(4),
// 	backgroundColor: theme.palette.background.paper,
// 	boxShadow: theme.shadows[5],
// 	borderRadius: "12px",
// }));
const FundingCard = styled(Card)(() => ({
	maxWidth: 600,
	margin: "auto",
	marginTop: 4,
	padding: 2,
	position: "relative",
	overflow: "visible",
}));
export function FundingComponentCompany({ companyUsername }) {
	const [fundingData, setFundingData] = useState(null);
	const [tabValue, setTabValue] = useState(0);
	const handleCancelFunds = async () => {
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/cancel`,
				{ fundingData },
				{
					withCredentials: true,
				},
			);
		} catch (error) {
			console.error("Error cancelling fundraising:", error);
		}
	};
	const fetchActiveFunding = async () => {
		try {
			await axios
				.get(`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/active`, {
					params: { username: companyUsername },
					withCredentials: true,
				})
				.then((response) => {
					setFundingData(response.data.activeFundraising);
					console.log(response);
				});
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

	if (!fundingData) {
		return;
	}
	return (
		<FundingCard>
			{/*<CardMedia
				component="img"
				height="200"
				image="/images/company-logo.jpg"
				alt={`${companyName} Logo`}
			/>*/}
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
								>{`${fundingData.fundedPercentage}%`}</Typography>
								<Typography variant="body2" color="textSecondary">
									Funded
								</Typography>
							</Box>
						</Box>
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography variant="body1" gutterBottom>
							<strong>Total Amount Required:</strong> $
							{fundingData.fundingAmount.toLocaleString()}
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Total Equity Offered:</strong>{" "}
							{fundingData.equityPercentage}%
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Remaining Equity:</strong> {fundingData.remainingEquity}%
						</Typography>
						<Typography variant="body1" gutterBottom>
							<strong>Portions Available:</strong>{" "}
							{fundingData.remainingPortions} out of {fundingData.totalPortions}
						</Typography>
					</Grid>
				</Grid>
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
					onClick={() => handleCancelFunds(true)}
				>
					Cancel
				</button>
			</CardContent>
		</FundingCard>
	);
}
