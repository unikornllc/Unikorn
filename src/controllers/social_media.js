import prisma from "../db.js";

export const createSocialMedia = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: req.body.userId },
		});
		if (!user) {
			return res.status(400).send("User not found");
		}
		const socialMedia = await prisma.social_Media.create({
			data: {
				platform: req.body.platform,
				url: req.body.url,
				user: {
					connect: { id: req.body.userId },
				},
			},
		});
		res.status(200).json({ socialMedia });
	} catch (error) {
		res.status(400).json({ message: "Error creating socialMedia" });
	}
};

export const getAllSocialMedia = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				social_media: true,
			},
		});
		res.status(200).json({ socialMedia: user.social_media });
	} catch (error) {
		res.status(400).json({ message: "Error getting socialMedia" });
	}
};

export const getOneSocialMedia = async (req, res) => {
	try {
		const socialMedia = await prisma.social_Media.findUnique({
			where: {
				id: req.query.socialMediaId,
			},
		});
		res.status(200).json({ socialMedia });
	} catch (error) {
		res.status(400).json({ message: "Error getting socialMedia" });
	}
};

export const deleteSocialMedia = async (req, res) => {
	try {
		const deleted = await prisma.social_Media.delete({
			where: {
				id: req.query.socialMediaId,
			},
		});
		res.status(200).json({ deleted });
	} catch (error) {
		res.status(400).json({ message: "Error deleting socialMedia" });
	}
};
