import prisma from "../db.js";

export const getOneCorporateExperience = async (req, res) => {
	try {
		const corporateExperience = await prisma.corporate_Experience.findUnique({
			where: {
				id: req.body.corporateExperienceId,
			},
		});
		res.status(200).json({ data: corporateExperience });
	} catch (e) {
		res.status(400);
	}
};

export const getAllCorporateExperience = async (req, res) => {
	try {
		const corporateExperience = await prisma.corporate_Experience.findMany({
			where: {
				userId: req.body.userId,
			},
		});
		res.json({ data: corporateExperience });
	} catch (e) {
		res.status(400);
	}
};
export const createCorporateExperience = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});
		if (!user) {
			return res.status(400).send("User not found");
		}
		const corporateExperience = await prisma.corporate_Experience.create({
			data: {
				job_title: req.body.job_title,
				company_name: req.body.company_name,
				start_date: req.body.start_date,
				end_date: req.body.end_date,
				responsibilities: req.body.responsibilities,
				user: { connect: { id: req.body.userId } },
			},
		});
		res.status(200).send("Created corporate experience successfully");
	} catch (e) {
		res.status(400);
	}
};
export const deleteCorporateExperience = async (req, res) => {
	try {
		const deleted = await prisma.corporate_Experience.delete({
			where: {
				id: req.body.corporateExperienceId,
			},
		});
		res.status(200).send("Deleted corporate experience successfully");
	} catch (e) {
		res.status(400);
	}
};
