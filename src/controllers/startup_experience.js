import prisma from "../db.js";

export const getOneStartupExperience = async (req, res) => {
	try {
		const startupExperience = await prisma.startup_Experience.findUnique({
			where: {
				id: req.body.startupExperienceId,
			},
		});
		res.status(200).json({ data: startupExperience });
	} catch (e) {
		res.status(400);
	}
};

export const getAllStartupExperience = async (req, res) => {
	try {
		const startupExperience = await prisma.startup_Experience.findMany({
			where: {
				userId: req.body.userId,
			},
		});
		res.json({ data: startupExperience });
	} catch (e) {
		res.status(400);
	}
};
export const createStartupExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});
		if (!user) {
			return res.status(400).send("User not found");
		}
		const startupExperience = await prisma.startup_Experience.create({
			data: {
				startup_name: req.body.startup_name,
				role: req.body.role,
				description: req.body.description,
				user: { connect: { id: req.body.userId } },
			},
		});
		res.status(200).send("Created startup experience successfully");
	} catch (e) {
		res.status(400);
	}
};
export const deleteStartupExperience = async (req, res) => {
	try {
		const deleted = await prisma.startup_Experience.delete({
			where: {
				id: req.body.startupExperienceId,
			},
		});
		res.status(200).send("Deleted startup experience successfully");
	} catch (e) {
		res.status(400);
	}
};
