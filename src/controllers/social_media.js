import prisma from "../db.js";

export const createSocialMedia = async (req, res) => {
	try {
		const userId = req.body.userId;
		const user = await prisma.user.findUnique({
			where: { id: userId },
		});
		const socialMedia = await prisma.social_Media.create({
			data: {
				platform: req.body.platform,
				url: req.body.url,
				user: {
					connect: { id: userId },
				},
			},
		});
		res.status(200).json({ data: socialMedia });
	} catch (error) {
		res.status(400);
	}
};

export const getAllSocialMedia = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
			include: {
				social_media: true,
			},
		});
		res.status(200).json({ data: user.social_media });
	} catch (error) {
		res.status(200);
	}
};

export const getOneSocialMedia = async (req, res) => {
	try {
		const socialMedia = await prisma.social_Media.findUnique({
			where: {
				id: req.body.socialMediaId,
			},
		});
		res.status(200).json({ data: socialMedia });
	} catch (error) {
		res.status(200);
	}
};

export const deleteSocialMedia = async (req, res) => {
	try {
		const deleted = await prisma.social_Media.delete({
			where: {
				id: req.body.socialMediaId,
			},
		});
		res.status(200).json({ data: deleted });
	} catch (error) {
		res.status(400);
	}
};
