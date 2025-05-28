import prisma from "../db.js";

export const createStartupExperience = async (req, res) => {
	try {
		if (!req.account?.id) {
			return res
				.status(401)
				.json({ message: "Unauthorized to edit user data." });
		}
		const startupExperience = await prisma.startupExperience.create({
			data: {
				startupName: req.body.startupName,
				role: req.body.role,
				description: req.body.description,
				user: { connect: { id: req.account.id } },
				startDate: req.body.startDate + "T00:00:00.000Z",
				endDate: req.body.endDate + "T00:00:00.000Z",
			},
		});
		res.status(200).json({
			startupExperience: (({ userId, ...safe }) => safe)(startupExperience),
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error creating StartupExperience" });
	}
};

export const getOneStartupExperience = async (req, res) => {
	try {
		const startupExperience = await prisma.startupExperience.findUnique({
			where: {
				id: req.query.startupExperienceId,
			},
		});
		res.status(200).json({
			startupExperience: (({ userId, ...safe }) => safe)(startupExperience),
		});
	} catch (e) {
		res.status(400).json({ message: "Error getting StartupExperience" });
	}
};

export const getAllStartupExperience = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				startupExperience: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			startupExperience: user.startupExperience.map(
				({ userId, ...rest }) => rest,
			),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting StartupExperience" });
	}
};

export const deleteStartupExperience = async (req, res) => {
	try {
		const deleted = await prisma.startupExperience.delete({
			where: {
				userId: req.account.id,
				id: req.query.startupExperienceId,
			},
		});
		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Startup Experience not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (e) {
		res.status(400).json({ message: "Error deleting StartupExperience" });
	}
};
