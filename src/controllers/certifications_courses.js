import prisma from "../db.js";

export const createCertificationsCourses = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const certificationsCourses = await prisma.certifications_Courses.create({
			data: {
				title: req.body.title,
				institution: req.body.institution,
				completion_date: new Date(req.body.completion_date),
				focus_area: req.body.focus_area,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});
		res.status(200).json({ certificationsCourses });
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Error creating CertificationsCourses" });
	}
};

export const getAllCertificationsCourses = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				certifications_courses: true,
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res
			.status(200)
			.json({ certificationsCourses: user.certifications_courses });
	} catch (error) {
		res.status(400).json({ message: "Error getting CertificationsCourses" });
	}
};

export const getOneCertificationsCourses = async (req, res) => {
	try {
		const CertificationsCourses = await prisma.certifications_Courses.findFirst(
			{
				where: {
					id: req.query.certificationsCourseId,
				},
			},
		);
		res.status(200).json({ CertificationsCourses });
	} catch (error) {
		res.status(400).json({ message: "Error getting CertificationsCourses" });
	}
};

export const deleteCertificationsCourses = async (req, res) => {
	try {
		const deleted = await prisma.certifications_Courses.delete({
			where: {
				id: req.query.certificationsCourseId,
			},
		});
		res.status(200).json({ deleted });
	} catch (error) {
		res.status(400).json({ message: "Error deleting CertificationsCourses" });
	}
};
