import prisma from "../db.js";

export const createFundingRound = async (req, res) => {
	try {
		const financial = await prisma.financial.findUnique({
			where: { id: req.body.financialId },
		});
		const fundingRound = await prisma.fundingRound.create({
			data: {
				type: req.body.type,
				fundingAmount: req.body.funding_amount,
				roundDate: new Date(req.body.round_date),
				leadInvestors: req.body.lead_investors,
				financial: {
					connect: { id: req.body.financialId },
				},
			},
		});
		
		const updatedTotalFundingAmount =
			financial.totalFundingAmount + req.body.funding_amount;
		await prisma.financial.update({
			where: { id: req.body.financialId },
			data: { totalFundingAmount: updatedTotalFundingAmount },
		});

		res.status(200).json({ data: fundingRound });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to create");
	}
};

export const getAllFundingRound = async (req, res) => {
	try {
		const financial = await prisma.financial.findUnique({
			where: { id: req.body.financialId },
		});
		const fundingRound = await prisma.fundingRound.findMany({
			where: {
				financialId: req.body.financialId,
			},
		});
		res.status(200).json({ data: fundingRound });
	} catch (e) {
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
		const financial = await prisma.financial.findUnique({
			where: { id: req.body.financialId },
		});
		const fundingRound = await prisma.fundingRound.delete({
			where: {
				id: req.body.fundingRoundId,
			},
		});
		const updatedTotalFundingAmount =
			financial.totalFundingAmount - req.body.funding_amount;
		await prisma.financial.update({
			where: { id: req.body.financialId },
			data: { totalFundingAmount: updatedTotalFundingAmount },
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};
