import prisma from "../db.js";

export const verifiedUser = async (req, res, next) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
		if (user.verified) {
			return next();
		}

		// If user is not verified, terminate the request
		return res.status(400).json({ error: "User not verified" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
};
