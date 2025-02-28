import prisma from "../db.js";

export const createFinancial = async (req, res) => {
	try {
		const company = await prisma.company.findUnique({
			where: {
				account: {
					username: req.body.username,
				},
			},
		});
		const financial = await prisma.financial.create({
			data: {
				valuation: req.body.valuation,
				investors: req.body.investors,
				total_funding_amount: 0,
				company: {
					connect: { id: company.id },
				},
			},
		});

		res.status(200).json({ data: financial });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to create");
	}
};

export const getAllFinancial = async (req, res) => {
	try {
		const financial = await prisma.company.findUnique({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				financials: true,
			},
		});
		res.status(200).json({ data: financial });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};
