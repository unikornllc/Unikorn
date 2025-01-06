import prisma from "../db.js";

export const createCertificationsCourses = async (req, res) => {
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

		const certificationsCourses = await prisma.certifications_Courses.create({
			data: {
				title: req.body.title,
				institution: req.body.institution,
				completion_date: new Date(req.body.completion_date),
				focus_area: req.body.focus_area,
				user: {
					connect: { id: user.id },
				},
			},
		});
		res.status(200).json({
			certificationsCourses: (({ userId, ...safe }) => safe)(
				certificationsCourses,
			),
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ message: "Error creating CertificationsCourses" });
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
		res.status(200).json({
			CertificationsCourses: (({ userId, ...safe }) => safe)(
				CertificationsCourses,
			),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting CertificationsCourses" });
	}
};

export const getAllCertificationsCourses = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				certifications_courses: true,
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		res.status(200).json({
			certificationsCourses: user.certifications_courses.map(
				({ userId, ...rest }) => rest,
			),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting CertificationsCourses" });
	}
};

export const deleteCertificationsCourses = async (req, res) => {
	try {
		const deleted = await prisma.certifications_Courses.delete({
			where: {
				userId: req.decodedUser.id,
				id: req.query.certificationsCourseId,
			},
		});

		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Certification course not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (error) {
		res.status(400).json({ message: "Error deleting CertificationsCourses" });
	}
};
