import prisma from "../db.js";

export const createStartupExperience = async (req, res) => {
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
		const startupExperience = await prisma.startup_Experience.create({
			data: {
				startup_name: req.body.startup_name,
				role: req.body.role,
				description: req.body.description,
				user: { connect: { id: user.id } },
			},
		});
		res.status(200).json({
			startupExperience: (({ userId, ...safe }) => safe)(startupExperience),
		});
	} catch (e) {
		res.status(400).json({ message: "Error creating StartupExperience" });
	}
};

export const getOneStartupExperience = async (req, res) => {
	try {
		const startupExperience = await prisma.startup_Experience.findUnique({
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
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				startup_experience: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			startupExperience: user.startup_experience.map(
				({ userId, ...rest }) => rest,
			),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting StartupExperience" });
	}
};

export const deleteStartupExperience = async (req, res) => {
	try {
		const deleted = await prisma.startup_Experience.delete({
			where: {
				userId: req.decodedUser.id,
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
