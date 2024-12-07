import prisma from "../db.js";

export const createExpertise = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		const expertise = await prisma.expertise.create({
			data: {
				field: req.body.field,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});

		res.status(200).json({ data: expertise });
	} catch (e) {
		res.status(400).send("Failed to create");
	}
};

export const getAllExpertise = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		const expertise = await prisma.expertise.findMany({
			where: {
				userId: req.body.userId,
			},
		});
		res.status(200).json({ data: expertise });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneExpertise = async (req, res) => {
	try {
		const expertise = await prisma.expertise.findUnique({
			where: {
				id: req.body.expertiseId,
			},
		});
		res.status(200).json({ data: expertise });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneExpertise = async (req, res) => {
	try {
		const expertise = await prisma.expertise.delete({
			where: {
				id: req.body.expertiseId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400).send("Failed to delete");
	}
};
