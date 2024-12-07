import prisma from "../db.js";

export const createProductInformation = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: { id: req.body.companyId },
		});
		const product_information = await prisma.product_Information.create({
			data: {
				product: req.body.product,
				market: req.body.market,
				partnerships: req.body.partnerships,
				company: {
					connect: { id: req.body.companyId },
				},
			},
		});

		res.status(200).json({ data: product_information });
	} catch (e) {
		res.status(400).send("Failed to create");
	}
};

export const getAllProductInformation = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: { id: req.body.companyId },
		});
		const product_information = await prisma.product_Information.findMany({
			where: {
				companyId: req.body.companyId,
			},
		});
		res.status(200).json({ data: product_information });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneProductInformation = async (req, res) => {
	try {
		const product_information = await prisma.product_Information.findUnique({
			where: {
				id: req.body.productInformationId,
			},
		});
		res.status(200).json({ data: product_information });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneProductInformation = async (req, res) => {
	try {
		const product_information = await prisma.product_Information.delete({
			where: {
				id: req.body.productInformationId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400).send("Failed to delete");
	}
};
