import prisma from "../db.js";

export const createInterest = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});
		if (!user) {
			return res.status(400).send("User not found");
		}
		const interest = await prisma.interest.create({
			data: {
				name: req.body.name,
				user: { connect: { id: req.body.userId } },
			},
		});
		res.status(200).json({ interest });
	} catch (e) {
		res.status(400).json({ message: "Error creating interest" });
	}
};

export const getOneInterest = async (req, res) => {
	try {
		const interest = await prisma.interest.findUnique({
			where: {
				id: req.query.interestId,
			},
		});
		res.status(200).json({ interest });
	} catch (e) {
		res.status(400).json({ message: "Error getting interest" });
	}
};
export const getAllInterest = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				interest: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ interest: user.interest });
	} catch (error) {
		res.status(400).json({ message: "Error getting interest" });
	}
};

export const deleteInterest = async (req, res) => {
	try {
		const deleted = await prisma.interest.delete({
			where: {
				id: req.query.interestId,
			},
		});
		res.status(200).json({ deleted });
	} catch (e) {
		res.status(400).json({ message: "Error deleting interest" });
	}
};
