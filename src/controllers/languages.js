import prisma from "../db.js";

export const createLanguage = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const language = await prisma.language.create({
			data: {
				language: req.body.language,
				proficiency: req.body.proficiency,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});
		res.status(200).json({ language });
	} catch (error) {
		res.status(400).json({ message: "Error creating language" });
	}
};

export const getAllLanguage = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				language: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ language: user.language });
	} catch (error) {
		res.status(400).json({ message: "Error getting language" });
	}
};

export const getOneLanguage = async (req, res) => {
	try {
		const language = await prisma.language.findUnique({
			where: {
				id: req.body.languageId,
			},
		});
		res.status(200).json({ language });
	} catch (error) {
		res.status(400).json({ message: "Error getting language" });
	}
};

export const deleteLanguage = async (req, res) => {
	try {
		const deleted = await prisma.language.delete({
			where: {
				id: req.query.languageId,
			},
		});
		res.status(200).json({ deleted });
	} catch (error) {
		res.status(400).json({ message: "Error deleting language" });
	}
};
