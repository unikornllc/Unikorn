import prisma from "../db.js";

export const createEducation = async (req, res) => {
	const degrees = ["NONE", "BA", "BSc", "MA", "MSc", "MBA", "PhD"];
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		const education = await prisma.education.create({
			data: {
				degree: req.body.degree,
				institution: req.body.institution,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});
		res.status(200).json({ education });
	} catch (e) {
		res.status(400).json({ message: "Error creating education" });
	}
};

export const getAllEducation = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				education: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ education: user.education });
	} catch (error) {
		res.status(400).json({ message: "Error getting education" });
	}
};

export const getOneEducation = async (req, res) => {
	try {
		const education = await prisma.education.findUnique({
			where: {
				id: req.query.educationId,
			},
		});
		res.status(200).json({ education });
	} catch (e) {
		res.status(400).json({ message: "Error getting education" });
	}
};

export const deleteOneEducation = async (req, res) => {
	try {
		const education = await prisma.education.delete({
			where: {
				id: req.query.educationId,
			},
		});
		res.status(200).json({ education });
	} catch (e) {
		res.status(400).json({ message: "Error deleting education" });
	}
};
