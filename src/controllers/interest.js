import prisma from "../db.js";

export const createInterest = async (req, res) => {
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

		const interest = await prisma.interest.create({
			data: {
				name: req.body.name,
				user: { connect: { id: user.id } },
			},
		});
		res.status(200).json({
			interest: (({ userId, ...safe }) => safe)(interest),
		});
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
		res.status(200).json({
			interest: (({ userId, ...safe }) => safe)(interest),
		});
	} catch (e) {
		res.status(400).json({ message: "Error getting interest" });
	}
};
export const getAllInterest = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				interest: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			interest: user.interest.map(({ userId, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting interest" });
	}
};

export const deleteInterest = async (req, res) => {
	try {
		const deleted = await prisma.interest.delete({
			where: {
				userId: req.account.id,
				id: req.query.interestId,
			},
		});
		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Interest not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (e) {
		res.status(400).json({ message: "Error deleting interest" });
	}
};
