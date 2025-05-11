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
		res.status(200).json({ fundingRound: fundingRound });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to create");
	}
};
export const updateFundingRound = async (req, res) => {
	try {
		const fundingRound = await prisma.fundingRound.findUnique({
			where: { id: req.body.fundingRoundId },
		});
		if (fundingRound.raisingFundsId) {
			return res.status(400).send("Funding round cannot be edited");
		}
		const updatedFundingRound = await prisma.fundingRound.update({
			where: { id: req.body.fundingRoundId },
			data: {
				type: req.body.type,
				fundingAmount: req.body.fundingAmount,
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
		res.status(200).json({ fundingRound: updatedFundingRound });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to update");
	}
};

export const getAllFundingRound = async (req, res) => {
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
		});
		for (let round of fundingRounds) {
			if (round.raisingFundsId) {
				round.external = false;
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
				id: req.body.fundingRoundId,
			},
		});
		res.status(200).json({ data: fundingRound });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneFundingRound = async (req, res) => {
	try {
		const fundingRound = await prisma.fundingRound.findUnique({
			where: { id: req.body.fundingRoundId },
		});
		if (fundingRound.raisingFundsId) {
			return res.status(400).send("Funding round cannot be deleted");
		}
		const deleted = await prisma.fundingRound.delete({
			where: {
				id: req.body.fundingRoundId,
				companyId: req.account.id,
			},
		});
		const updatedTotalFundingAmount =
			financial.totalFundingAmount - req.body.funding_amount;
		await prisma.financial.update({
			where: { id: fundingRound.financialId },
			data: { totalFundingAmount: { decrement: req.body.fundingAmount } },
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};
