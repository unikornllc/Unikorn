import prisma from "../db.js";

export const createExpertise = async (req, res) => {
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

		const expertise = await prisma.expertise.create({
			data: {
				field: req.body.field,
				user: {
					connect: { id: user.id },
				},
			},
		});
		res.status(200).json({
			expertise: (({ userId, ...safe }) => safe)(expertise),
		});
	} catch (e) {
		res.status(400).json({ message: "Error creating expertise" });
	}
};

export const getOneExpertise = async (req, res) => {
	try {
		const expertise = await prisma.expertise.findUnique({
			where: {
				id: req.query.expertiseId,
			},
		});
		res.status(200).json({
			expertise: (({ userId, ...safe }) => safe)(expertise),
		});
	} catch (e) {
		res.status(400).json({ message: "Error getting expertise" });
	}
};

export const getAllExpertise = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				expertise: true,
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		res.status(200).json({
			expertise: user.expertise.map(({ userId, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting expertise" });
	}
};

// export const getAllExpertise = async (req, res) => {
// 	try {
// 		const user = await prisma.user.findUnique({
// 			where: { id: req.query.userId },
// 		});
// 		if (!user) {
// 			return res.status(400).json({ message: "User not found" });
// 		}
// 		const expertise = await prisma.expertise.findMany({
// 			where: {
// 				userId: req.query.userId,
// 			},
// 		});
// 		res.status(200).json({ expertise });
// 	} catch (e) {
// 		res.status(400).json({ message: "Error getting expertise" });
// 	}
// };

export const deleteOneExpertise = async (req, res) => {
	try {
		const deleted = await prisma.expertise.delete({
			where: {
				userId: req.account.id,
				id: req.query.expertiseId,
			},
		});

		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Expertise not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (e) {
		res.status(400).json({ message: "Error deleting expertise" });
	}
};
