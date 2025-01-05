import prisma from "../db.js";

export const createLanguage = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { username: req.body.username },
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		if (user.id != req.decodedUser.id) {
			return res
				.status(401)
				.json({ message: "Unauthorized to edit user data." });
		}
		const language = await prisma.language.create({
			data: {
				language: req.body.language,
				proficiency: req.body.proficiency,
				user: {
					connect: { id: user.id },
				},
			},
		});
		res.status(200).json({
			language: (({ userId, ...safe }) => safe)(language),
		});
	} catch (error) {
		res.status(400).json({ message: "Error creating language" });
	}
};

export const getOneLanguage = async (req, res) => {
	try {
		const language = await prisma.language.findUnique({
			where: {
				id: req.body.languageId,
			},
		});
		res.status(200).json({
			language: (({ userId, ...safe }) => safe)(language),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting language" });
	}
};

export const getAllLanguage = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				language: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			language: user.language.map(({ userId, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting language" });
	}
};

export const deleteLanguage = async (req, res) => {
	try {
		const deleted = await prisma.language.delete({
			where: {
				userId: req.decodedUser.id,
				id: req.query.languageId,
			},
		});
		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Language not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (error) {
		res.status(400).json({ message: "Error deleting language" });
	}
};
