import jwt from "jsonwebtoken";
import prisma from "../db.js";

// const StandardProfile = ["StandardView", "EditProfile", "Feed"];
// const ProProfile = ["ProView", "Communicate", "EditProfile", "Feed"];
// const HunterPrfile = ["HunterView", "Communicate", "EditProfile", "Feed"];
// const HolderProfile = ["HolderView", "EditProfile", "Feed"];
// const ChangePassword = ["ChangePassword"];

const basicAccessCookieOptions = {
	httpOnly: true,
	secure: false,
	maxAge: 24 * 60 * 60 * 1000,
	sameSite: "Lax",
};

const PasswordResetAccessCookie = {
	httpOnly: true,
	secure: false,
	maxAge: 15 * 60 * 1000,
	sameSite: "Lax",
};

export const generateAccessTokenIfNeeded = (req, res, next) => {
	console.log(
		"In generateAccessTokenIfNeeded: req.accessTokenValid =",
		req.accessTokenValid,
	);

	if (req.accessTokenValid) {
		return next();
	}

	try {
		const account = req.account;

		if (!account) {
			console.log("No account found in generateAccessTokenIfNeeded");
			return res.status(401).json({ message: "Authentication required." });
		}

		console.log("In generateAccessTokenIfNeeded: account =", account);

		// if (account.tier === undefined) {
		// 	console.log("Account tier is undefined. Setting default tier.");
		// 	account.tier = "default";
		// }

		const token = jwt.sign(
			{
				id: account.id,
				role: account.role,
				permissions: account.user?.tier || account.company?.tier,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		res.cookie("BSID", token, basicAccessCookieOptions);

		console.log("Access token generated and cookie set");

		return next();
	} catch (error) {
		console.error("Error in generateAccessTokenIfNeeded:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};

export const verifyRefreshTokenAndGenerateAccessToken = async (
	req,
	res,
	next,
) => {
	try {
		if (req.account) {
			return next();
		}

		const ssid = req.cookies["SID"];
		if (!ssid) {
			return res.status(401).json({ message: "Authentication required." });
		}

		const session = await prisma.refreshTokenValid.findUnique({
			where: { sid: ssid },
		});

		if (!session) {
			return res.status(401).json({ message: "Authentication required." });
		}

		if (Date.now() > new Date(session.expire).getTime()) {
			await prisma.refreshTokenValid.delete({ where: { sid: ssid } });
			return res.status(401).json({ message: "Authentication required." });
		}

		const profileId = session.profileId;
		const account = await prisma.account.findUnique({
			where: { id: profileId },
			include: { company: true, user: true },
		});
		if (!account) {
			return res.status(401).json({ message: "Authentication required." });
		}

		const token = jwt.sign(
			{
				id: account.id,
				role: account.role,
				permissions: account.user?.tier || account.company?.tier,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		res.cookie("BSID", token, basicAccessCookieOptions);

		req.account = {
			id: account.id,
			role: account.role,
			permissions: account.user?.tier || account.company?.tier,
		};

		return next();
	} catch (error) {
		console.error("Error in verifyRefreshTokenAndGenerateAccessToken:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};
