import prisma from "../db.js";

export const createCorporateExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const corporateExperience = await prisma.corporate_Experience.create({
			data: {
				job_title: req.body.job_title,
				company_name: req.body.company_name,
				start_date: new Date(req.body.start_date),
				end_date: new Date(req.body.end_date),
				responsibilities: req.body.responsibilities,
				user: { connect: { id: req.body.userId } },
			},
		});
		res.status(200).json({ corporateExperience });
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
		res.status(200).json({ corporateExperience });
	} catch (e) {
		res.status(400).json({ message: "Error geting CorporateExperience" });
	}
};

export const getAllCorporateExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				corporate_experience: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ corporateExperience: user.corporate_experience });
	} catch (error) {
		res.status(400).json({ message: "Error getting CorporateExperience" });
	}
};

export const deleteCorporateExperience = async (req, res) => {
	try {
		const deleted = await prisma.corporate_Experience.delete({
			where: {
				id: req.query.corporateExperienceId,
			},
		});
		res.status(200).json({ deleted });
	} catch (e) {
		res.status(400).json({ message: "Error deleting CorporateExperience" });
	}
};
