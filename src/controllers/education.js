import prisma from "../db.js";

export const createEducation = async (req, res) => {
	const degrees = ["NONE", "BA", "BSc", "MA", "MSc", "MBA", "PhD"];
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.body.username,
				},
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		if (user.id != req.account.id) {
			return res
				.status(401)
				.json({ message: "Unauthorized to edit user data." });
		}

		const education = await prisma.education.create({
			data: {
				degree: req.body.degree,
				institution: req.body.institution,
				user: {
					connect: { id: user.id },
				},
			},
		});
		res.status(200).json({
			education: (({ userId, ...safe }) => safe)(education),
		});
	} catch (e) {
		res.status(400).json({ message: "Error creating education" });
	}
};

export const getOneEducation = async (req, res) => {
	try {
		const education = await prisma.education.findUnique({
			where: {
				id: req.query.educationId,
			},
		});
		res.status(200).json({
			education: (({ userId, ...safe }) => safe)(education),
		});
	} catch (e) {
		res.status(400).json({ message: "Error getting education" });
	}
};

export const getAllEducation = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				education: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			education: user.education.map(({ userId, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting education" });
	}
};

export const deleteOneEducation = async (req, res) => {
	try {
		const deleted = await prisma.education.delete({
			where: {
				userId: req.account.id,
				id: req.query.educationId,
			},
		});
		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Education not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (e) {
		res.status(400).json({ message: "Error deleting education" });
	}
};
