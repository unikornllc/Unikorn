import prisma from "../db.js";

export const createActivity = async (req, res) => {
	try {
		const company = await prisma.company.findUnique({
			where: { id: req.body.companyId },
		});
		const activity = await prisma.activity.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				company: {
					connect: { id: req.body.companyId },
				},
			},
		});

		res.status(200).json({ data: activity });
	} catch (e) {
		res.status(400).send("Failed to create");
	}
};

export const getAllActivity = async (req, res) => {
	try {
		const company = await prisma.company.findUnique({
			where: { id: req.body.companyId },
		});
		const activity = await prisma.activity.findMany({
			where: {
				companyId: req.body.companyId,
			},
		});
		res.status(200).json({ data: activity });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneActivity = async (req, res) => {
	try {
		const activity = await prisma.activity.findMany({
			where: {
				id: req.body.activityId,
			},
		});
		res.status(200).json({ data: activity });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneActivity = async (req, res) => {
	try {
		const activity = await prisma.activity.delete({
			where: {
				id: req.body.activityId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400).send("Failed to delete");
	}
};
