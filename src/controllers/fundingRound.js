import prisma from "../db.js";

export const createFundingRound = async (req, res) => {
	try {
		const company = await prisma.company.findUnique({
			where: { id: req.account.id },
			include: {
				financials: true,
			},
		});
		let financial = company.financials;
		if (!financial) {
			financial = await prisma.financial.create({
				data: {
					valuation: 0,
					investors: [],
					totalFundingAmount: 0,
					company: {
						connect: { id: company.id },
					},
				},
			});
		}
		const fundingRound = await prisma.fundingRound.create({
			data: {
				type: req.body.type,
				fundingAmount: req.body.fundingAmount,
				equityPercentage: req.body.equityPercentage,
				roundDate: new Date(req.body.roundDate),
				leadInvestors: req.body.leadInvestors,
				financial: {
					connect: { id: financial.id },
				},
			},
		});

		await prisma.financial.update({
			where: { id: financial.id },
			data: { totalFundingAmount: { increment: req.body.fundingAmount } },
		});
		fundingRound.external = true;
		res.status(200).json({ fundingRound });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to create");
	}
};
export const updateFundingRound = async (req, res) => {
	try {
		const fundingRound = await prisma.fundingRound.findUnique({
			where: { id: req.body.fundingRoundId },
			include: { raisingFunds: true, financial: true },
		});
		if (!fundingRound) {
			return res.status(400).json({ message: "Funding round not found" });
		}
		if (fundingRound.raisingFunds) {
			return res
				.status(400)
				.json({ message: "Funding round cannot be edited" });
		}
		const isAuthorized = req.account.id === fundingRound.financial.companyId;
		if (!isAuthorized) {
			return res.status(403).json({ message: "Unauthorized Update" });
		}
		const updatedFundingRound = await prisma.fundingRound.update({
			where: { id: req.body.fundingRoundId },
			data: {
				type: req.body.type,
				fundingAmount: req.body.fundingAmount,
				equityPercentage: req.body.equityPercentage,
				roundDate: new Date(req.body.roundDate),
				leadInvestors: req.body.leadInvestors,
			},
		});
		const amountDiff = req.body.fundingAmount - fundingRound.fundingAmount;
		if (req.body.fundingAmount) {
			await prisma.financial.update({
				where: { id: fundingRound.financialId },
				data: { totalFundingAmount: { increment: amountDiff } },
			});
		}
		updatedFundingRound.external = true;
		res.status(200).json({ fundingRound: updatedFundingRound });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to update");
	}
};

export const getCompanyFinancialInfo = async (req, res) => {
	try {
		const company = await prisma.company.findFirst({
			where: { account: { username: req.query.username } },
			include: {
				financials: true,
			},
		});
		let financials = company.financials;
		if (!financials) {
			return res.status(200).json({ fundingRounds: [] });
		}

		const fundingRounds = await prisma.fundingRound.findMany({
			where: {
				financialId: financials.id,
			},
			include: {
				raisingFunds: {
					select: {
						id: true,
						status: true,
						fundraisers: {
							include: {
								investorUser: {
									select: {
										name: true,
									},
								},
								investorCompany: {
									select: {
										name: true,
									},
								},
							},
						},
					},
				},
			},
		});
		for (let round of fundingRounds) {
			if (round.raisingFunds) {
				round.external = false;
				round.internalInvestors = round.raisingFunds.fundraisers.map(
					(fundraiser) => {
						if (fundraiser.investorUser) {
							return {
								name: fundraiser.investorUser.name,
								amount: fundraiser.fundingAmount,
							};
						} else if (fundraiser.investorCompany) {
							return {
								name: fundraiser.investorCompany.name,
								amount: fundraiser.fundingAmount,
							};
						}
					},
				);
			} else {
				round.external = true;
			}
		}
		financials.fundingRounds = fundingRounds;
		res.status(200).json({ financials });
	} catch (e) {
		console.error(e);
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneFundingRound = async (req, res) => {
	try {
		const fundingRound = await prisma.fundingRound.findMany({
			where: {
				id: req.query.fundingRoundId,
			},
		});
		if (!fundingRound) {
			return res.status(400).send("Funding round not found");
		}
		res.status(200).json({ fundingRound });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneFundingRound = async (req, res) => {
	try {
		const fundingRound = await prisma.fundingRound.findUnique({
			where: { id: req.query.fundingRoundId },
			include: { raisingFunds: true, financial: true },
		});
		if (!fundingRound) {
			return res.status(400).send("Funding round not found");
		}
		if (fundingRound.raisingFunds) {
			return res.status(400).send("Funding round cannot be deleted");
		}

		const isAuthorized = req.account.id === fundingRound.financial.companyId;

		if (!isAuthorized) {
			return res.status(403).send("Unauthorized Deletion");
		}
		await prisma.fundingRound.delete({
			where: {
				id: req.query.fundingRoundId,
			},
		});
		await prisma.financial.update({
			where: { id: fundingRound.financialId },
			data: { totalFundingAmount: { decrement: fundingRound.fundingAmount } },
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};

export const getUserInvestments = async (req, res) => {
	try {
		const investments = await prisma.fundraiser.findMany({
			where: {
				investorUser: {
					account: {
						username: req.query.username,
					},
				},
			},
			select: {
				id: true,
				equityPercentage: true,
				fundingAmount: true,
				date: true,
				status: true,
				raisingFunds: {
					select: {
						company: {
							select: {
								name: true,
								account: {
									select: {
										username: true,
									},
								},
							},
						},
					},
				},
			},
		});
		res.status(200).json({ investments });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to retrieve");
	}
};
