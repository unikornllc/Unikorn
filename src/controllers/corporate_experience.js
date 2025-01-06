import prisma from "../db.js";

export const createCorporateExperience = async (req, res) => {
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
		const corporateExperience = await prisma.corporate_Experience.create({
			data: {
				job_title: req.body.job_title,
				company_name: req.body.company_name,
				start_date: new Date(req.body.start_date),
				end_date: new Date(req.body.end_date),
				responsibilities: req.body.responsibilities,
				user: { connect: { id: user.id } },
			},
		});
		res.status(200).json({
			corporateExperience: (({ userId, ...safe }) => safe)(corporateExperience),
		});
	} catch (e) {
		res.status(400).json({ message: "Error creating CorporateExperience" });
	}
};

export const getOneCorporateExperience = async (req, res) => {
	try {
		const corporateExperience = await prisma.corporate_Experience.findUnique({
			where: {
				id: req.query.corporateExperienceId,
			},
		});
		res.status(200).json({
			corporateExperience: (({ userId, ...safe }) => safe)(corporateExperience),
		});
	} catch (e) {
		res.status(400).json({ message: "Error geting CorporateExperience" });
	}
};

export const getAllCorporateExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				corporate_experience: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			corporateExperience: user.corporate_experience.map(
				({ userId, ...rest }) => rest,
			),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting CorporateExperience" });
	}
};

export const deleteCorporateExperience = async (req, res) => {
	try {
		const deleted = await prisma.corporate_Experience.delete({
			where: {
				userId: req.decodedUser.id,
				id: req.query.corporateExperienceId,
			},
		});

		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Corporate Experience not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (e) {
		res.status(400).json({ message: "Error deleting Corporate Experience" });
	}
};
