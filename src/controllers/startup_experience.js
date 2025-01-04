import prisma from "../db.js";

export const createStartupExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const startupExperience = await prisma.startup_Experience.create({
			data: {
				startup_name: req.body.startup_name,
				role: req.body.role,
				description: req.body.description,
				user: { connect: { id: req.body.userId } },
			},
		});
		res.status(200).json({ startupExperience });
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
		res.status(200).json({ startupExperience });
	} catch (e) {
		res.status(400).json({ message: "Error getting StartupExperience" });
	}
};

export const getAllStartupExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				startup_experience: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ startupExperience: user.startup_experience });
	} catch (error) {
		res.status(400).json({ message: "Error getting StartupExperience" });
	}
};

export const deleteStartupExperience = async (req, res) => {
	try {
		const deleted = await prisma.startup_Experience.delete({
			where: {
				id: req.query.startupExperienceId,
			},
		});
		res.status(200).json({ deleted });
	} catch (e) {
		res.status(400).json({ message: "Error deleting StartupExperience" });
	}
};
