import prisma from "../db.js";

export const createExpertise = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const expertise = await prisma.expertise.create({
			data: {
				field: req.body.field,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});

		res.status(200).json({ expertise });
	} catch (e) {
		res.status(400).json({ message: "Error creating expertise" });
	}
};
export const getAllExpertise = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				expertise: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ expertise: user.expertise });
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

export const getOneExpertise = async (req, res) => {
	try {
		const expertise = await prisma.expertise.findUnique({
			where: {
				id: req.query.expertiseId,
			},
		});
		res.status(200).json({ expertise });
	} catch (e) {
		res.status(400).json({ message: "Error getting expertise" });
	}
};

export const deleteOneExpertise = async (req, res) => {
	try {
		const deleted = await prisma.expertise.delete({
			where: {
				id: req.query.expertiseId,
			},
		});
		res.status(200).json({ deleted });
	} catch (e) {
		res.status(400).json({ message: "Error deleting expertise" });
	}
};
