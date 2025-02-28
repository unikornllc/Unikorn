import prisma from "../db.js";

export const createCertificationsCourses = async (req, res) => {
	try {
		if(req.account.role !== 'User') {
			return res.status(401).json({ message: "You are not authorized to create CertificationsCourses" });
		}
		const certificationsCourses = await prisma.certificationsCourses.create({
			data: {
				title: req.body.title,
				institution: req.body.institution,
				completionDate: new Date(req.body.completionDate),
				focusArea: req.body.focusArea,
				user: {
					connect: { id: req.account.id },
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
		const CertificationsCourses = await prisma.certificationsCourses.findFirst(
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
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				certificationsCourses: true,
			},
		});

		if (!account) {
			return res.status(400).json({ message: "User not found" });
		}

		res.status(200).json({
			certificationsCourses: account.user.certificationsCourses.map(
				({ userId, ...rest }) => rest,
			),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting CertificationsCourses" });
	}
};

export const deleteCertificationsCourses = async (req, res) => {
	try {
		const deleted = await prisma.certificationsCourses.delete({
			where: {
				userId: req.account.id,
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
