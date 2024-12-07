import prisma from "../db.js";

export const createFundingRound = async (req, res) => {
	try {
		const financial = await prisma.financial.findUnique({
			where: { id: req.body.financialId },
		});
		const fundingRound = await prisma.funding_Round.create({
			data: {
				type: req.body.type,
				funding_amount: req.body.funding_amount,
				round_date: new Date(req.body.round_date),
				lead_investors: req.body.lead_investors,
				financial: {
					connect: { id: req.body.financialId },
				},
			},
		});
		const updatedTotalFundingAmount =
			financial.total_funding_amount + req.body.funding_amount;
		await prisma.financial.update({
			where: { id: req.body.financialId },
			data: { total_funding_amount: updatedTotalFundingAmount },
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
		const fundingRound = await prisma.funding_Round.findMany({
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
		const fundingRound = await prisma.funding_Round.findMany({
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
