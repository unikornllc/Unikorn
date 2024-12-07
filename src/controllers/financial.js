import prisma from "../db.js";

export const createFinancial = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: { id: req.body.companyId },
		});
		const financial = await prisma.financial.create({
			data: {
				valuation: req.body.valuation,
				investors: req.body.investors,
				total_funding_amount: 0,
				company: {
					connect: { id: req.body.companyId },
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
		const company = await prisma.company_Profile.findUnique({
			where: { id: req.body.companyId },
		});
		const financial = await prisma.financial.findMany({
			where: {
				companyId: req.body.companyId,
			},
		});
		res.status(200).json({ data: financial });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneFinancial = async (req, res) => {
	try {
		const financial = await prisma.financial.findMany({
			where: {
				id: req.body.financialId,
			},
		});
		res.status(200).json({ data: financial });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneFinancial = async (req, res) => {
	try {
		const financial = await prisma.financial.delete({
			where: {
				id: req.body.financialId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400).send("Failed to delete");
	}
};
