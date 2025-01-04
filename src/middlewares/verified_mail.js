import prisma from "../db.js";

export const verifiedUser = async (req, res, next) => {
	try {
		const { email } = req.body;
		const user =
			(await prisma.user.findUnique({
				where: {
					email: email,
				},
			})) ||
			(await prisma.user.findUnique({
				where: {
					username: email,
				},
			}));

		if (user && user.verified) {
			next();
		}
		const company = !user
			? (await prisma.company_Profile.findUnique({
					where: {
						username: email,
					},
				})) ||
				(await prisma.company_Profile.findUnique({
					where: {
						email: email,
					},
				}))
			: null;

		if (company && company.emailVerify) {
			console.log("hena");
			next();
		}
		// If neither user nor company is found
		if (!user && !company) {
			return res
				.status(400)
				.json({ message: "Error signing in: Invalid credentials." });
		}
	} catch (error) {
		console.error(error);
		return res.status(400).json({ error: "Internal Server Error" });
	}
};
