import prisma from "../db.js";

export const verifiedUser = async (req, res, next) => {
	try {
		let user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
		if (!user) {
			user = await prisma.user.findUnique({
				where: {
					username: req.body.email,
				},
			});
		}
		if (!user) {
			res.status(400).json({ message: "Wrong email or username" });
		}
		if (user.verified) {
			return next();
		}
		return res.status(400).json({ error: "User not verified" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
