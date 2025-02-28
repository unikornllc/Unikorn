import prisma from "../db.js";

export const createProductInformation = async (req, res) => {
	try {
		const company = await prisma.company.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				productInformation: true,
			},
		});
		const product_information = await prisma.productInformation.create({
			data: {
				product: req.body.product,
				market: req.body.market,
				partnerships: req.body.partnerships,
				company: {
					connect: { id: company.id },
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
		const product_information = await prisma.company.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				productInformation: true,
			},
		});
		res.status(200).json({ data: product_information });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneProductInformation = async (req, res) => {
	try {
		const product_information = await prisma.productInformation.findUnique({
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
		const product_information = await prisma.productInformation.delete({
			where: {
				id: req.body.productInformationId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400).send("Failed to delete");
	}
};
