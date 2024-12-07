import prisma from "../db.js";

export const createEducation = async (req, res) => {
	const degrees = ["NONE", "BA", "BSc", "MA", "MSc", "MBA", "PhD"];
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		const education = await prisma.education.create({
			data: {
				degree: req.body.degree,
				institution: req.body.institution,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});
		res.status(200).json({ data: education });
	} catch (e) {
		res.status(400).send("Failed to create");
	}
};

export const getAllEducation = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		const education = await prisma.education.findMany({
			where: {
				userId: req.body.userId,
			},
		});
		res.status(200).json({ data: education });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneEducation = async (req, res) => {
	try {
		const education = await prisma.education.findUnique({
			where: {
				id: req.body.educationId,
			},
		});
		res.status(200).json({ data: education });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneEducation = async (req, res) => {
	try {
		const education = await prisma.education.delete({
			where: {
				id: req.body.educationId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400).send("Failed to delete");
	}
};
