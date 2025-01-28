import prisma from "../db.js";

export const getActiveRaisingFund = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				raising_Funds: {
					where: {
						status: "Active",
					},
				},
			},
		});
		console.log(company);
		const remainingAmount =
			company.raising_Funds[0].remainingPortions *
			(company.raising_Funds[0].fundingAmount /
				company.raising_Funds[0].totalPortions);
		const fundedAmount =
			company.raising_Funds[0].fundingAmount - remainingAmount;
		const fundedPercentage =
			(fundedAmount / company.raising_Funds[0].fundingAmount) * 100;
		const remainingEquity =
			company.raising_Funds[0].remainingPortions *
			(company.raising_Funds[0].equityPercentage /
				company.raising_Funds[0].totalPortions);

		res.status(200).json({
			companyUsername: company.username,
			companyName: company.name,
			totalAmount: company.raising_Funds[0].fundingAmount,
			totalEquity: company.raising_Funds[0].equityPercentage,
			remainingAmount: remainingAmount,
			remainingEquity: remainingEquity,
			remainingPortions: company.raising_Funds[0].remainingPortions,

			portions: company.raising_Funds[0].totalPortions,
			portionAmount:
				company.raising_Funds[0].fundingAmount /
				company.raising_Funds[0].totalPortions,
			portionEquity:
				company.raising_Funds[0].equityPercentage /
				company.raising_Funds[0].totalPortions,
			fundedAmount: fundedAmount,
			fundedPercentage: fundedPercentage,
			totalPortions: company.raising_Funds[0].totalPortions,
		});
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getFundraiserData = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.decodedUser.id,
			},
			include: {
				Fundraisers: true,
			},
		});

		res.status(200).json({ Fundraisers: user.Fundraisers });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneFundingRound = async (req, res) => {
	try {
		const financial = await prisma.financial.findUnique({
			where: { id: req.body.financialId },
		});
		const fundingRound = await prisma.funding_Round.delete({
			where: {
				id: req.body.fundingRoundId,
			},
		});
		const updatedTotalFundingAmount =
			financial.total_funding_amount - req.body.funding_amount;
		await prisma.financial.update({
			where: { id: req.body.financialId },
			data: { total_funding_amount: updatedTotalFundingAmount },
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};
