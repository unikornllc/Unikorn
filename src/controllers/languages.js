import prisma from "../db.js";

export const createLanguage = async (req, res) => {
	try {
		const userId = req.body.userId;
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});
		const language = await prisma.language.create({
			data: {
				language: req.body.language,
				proficiency: req.body.proficiency,
				user: {
					connect: { id: userId },
				},
			},
		});
		res.status(200).json({ data: language });
	} catch (error) {
		res.status(400);
	}
};

export const getAllLanguage = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.id,
			},
			include: {
				language: true,
			},
		});
		res.status(200).json({ data: user.language });
	} catch (error) {
		res.status(200);
	}
};

export const getOneLanguage = async (req, res) => {
	try {
		const Language = await prisma.language.findUnique({
			where: {
				id: req.body.languageId,
			},
		});
		res.status(200).json({ data: Language });
	} catch (error) {
		res.status(200);
	}
};

export const deleteLanguage = async (req, res) => {
	try {
		const deleted = await prisma.language.delete({
			where: {
				id: req.body.languageId,
			},
		});
		res.status(200).json({ data: deleted });
	} catch (error) {
		res.status(400);
	}
};
