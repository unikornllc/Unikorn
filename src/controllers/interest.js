import prisma from "../db.js";

export const getOneInterest = async (req, res) => {
	try {
		const interest = await prisma.interest.findUnique({
			where: {
				id: req.body.interestId,
			},
		});
		res.status(200).json({ data: interest });
	} catch (e) {
		res.status(400);
	}
};

export const getAllInterest = async (req, res) => {
	try {
		const interests = await prisma.interest.findMany({
			where: {
				userId: req.body.userId,
			},
		});
		res.json({ data: interests });
	} catch (e) {
		res.status(400);
	}
};
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
		res.status(200).send("Created interest successfully");
	} catch (e) {
		res.status(400);
	}
};
export const deleteInterest = async (req, res) => {
	try {
		const deleted = await prisma.interest.delete({
			where: {
				id: req.body.interestId,
			},
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		res.status(400);
	}
};
