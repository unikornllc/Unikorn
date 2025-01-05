import prisma from "../db.js";

export const createSocialMedia = async (req, res) => {
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
		const socialMedia = await prisma.social_Media.create({
			data: {
				platform: req.body.platform,
				url: req.body.url,
				user: {
					connect: { id: user.id },
				},
			},
		});
		res.status(200).json({
			socialMedia: (({ userId, ...safe }) => safe)(socialMedia),
		});
	} catch (error) {
		res.status(400).json({ message: "Error creating socialMedia" });
	}
};

export const getOneSocialMedia = async (req, res) => {
	try {
		const socialMedia = await prisma.social_Media.findUnique({
			where: {
				id: req.query.socialMediaId,
			},
		});
		res.status(200).json({
			socialMedia: (({ userId, ...safe }) => safe)(socialMedia),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting socialMedia" });
	}
};

export const getAllSocialMedia = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				social_media: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			socialMedia: user.social_media.map(({ userId, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting socialMedia" });
	}
};

export const deleteSocialMedia = async (req, res) => {
	try {
		const deleted = await prisma.social_Media.delete({
			where: {
				userId: req.decodedUser.id,
				id: req.query.socialMediaId,
			},
		});
		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"SocialMedia not found or you don't have permission to delete it.",
			});
		}
		res.status(200).json({
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (error) {
		res.status(400).json({ message: "Error deleting socialMedia" });
	}
};
