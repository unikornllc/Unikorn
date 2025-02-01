import jwt from "jsonwebtoken";
import prisma from "../db.js";
import { verifyRefreshToken } from "./auth.js";

const StandardProfile = ["StandardView", "EditProfile", "Feed"];
const ProProfile = ["ProView", "Communicate", "EditProfile", "Feed"];
const HunterPrfile = ["HunterView", "Communicate", "EditProfile", "Feed"];
const HolderProfile = ["HolderView", "EditProfile", "Feed"];
const ChangePassword = ["ChangePassword"];

const basicAccessCookieOptions = {
	httpOnly: true,
	secure: true,
	maxAge: 24 * 60 * 60 * 1000,
	sameSite: "Lax",
};

const PasswordResetAccessCookie = {
	httpOnly: true,
	secure: true,
	maxAge: 15 * 60 * 1000,
	sameSite: "Lax",
};

// export const generateBasicAccess = async (req, res, next) => {
// 	try {
// 		if (req.bsidVerified) {
// 			console.log(req.bsidVerified);
// 			return res.status(200).json({ message: "Login Successful" });
// 		}
// 		const { email } = req.body;
// 		const user =
// 			(await prisma.user.findUnique({ where: { email } })) ||
// 			(await prisma.user.findUnique({ where: { username: email } }));
// 		const company = !user
// 			? (await prisma.company_Profile.findUnique({
// 					where: { username: email },
// 				})) || (await prisma.company_Profile.findUnique({ where: { email } }))
// 			: null;
// 		const account = company || user;
// 		const token = jwt.sign(
// 			{
// 				id: account.id,
// 				role: user ? "user" : "company",
// 				permissions: account.tier,
// 				authLevel: "Password",
// 			},
// 			process.env.JWT_SECRET,
// 			{
// 				expiresIn: "1d",
// 			},
// 		);
// 		res.cookie("BSID", token, BasicAccessCookie);
// 		return res.status(200).json({ message: "DONE" });
// 	} catch (error) {
// 		return res.status(500).json({ message: "Server Error" });
// 	}
// };

// export const generatePasswordResetToken = async (req, res, next) => {
// 	try {
// 		const refresh = req.cookies["SID"];
// 		if (!refresh) {
// 			return res.status(401).json({ message: "Session Expired, Please login" });
// 		}
// 		const session = await prisma.refreshTokenValid.findUnique({
// 			SID: refresh,
// 		});
// 		if (!session) {
// 			return res.status(401).json({ message: "Session Expired, Please login" });
// 		}
// 		if (Date.now() > session.expire) {
// 			return res.status(401).json({ message: "Session Expired, Please login" });
// 		}
// 		const user = await prisma.user.findUnique({ id: session.profileId });
// 		const company = await prisma.company_Profile.findUnique({
// 			id: session.profileId,
// 		});
// 		if (!user && !company) {
// 			return res.status(401).json({ message: "Session Expired, Please login" });
// 		}
// 		const permission = "Password";
// 		const token = jwt.sign(
// 			{
// 				id: session.profileId,
// 				role: session.role,
// 				permissions: permission,
// 				authLevel: "Password",
// 			},
// 			process.env.JWT_SECRET,
// 			{
// 				expiresIn: "15m",
// 			},
// 		);
// 		res.cookie("PSID", token, PasswordResetAccessCookie);
// 		return next();
// 	} catch (error) {
// 		return res.status(500).json({ message: "Server Error" });
// 	}
// };

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

		if (account.tier === undefined) {
			console.log("Account tier is undefined. Setting default tier.");
			account.tier = "default";
		}

		const token = jwt.sign(
			{
				id: account.id,
				role: account.role,
				permissions: account.tier,
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
		if (req.user) {
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
		let account;

		const user = await prisma.user.findUnique({ where: { id: profileId } });
		if (user) {
			account = { ...user, role: "User" };
		} else {
			const company = await prisma.company_Profile.findUnique({
				where: { id: profileId },
			});
			if (company) {
				account = { ...company, role: "Company" };
			} else {
				return res.status(401).json({ message: "Authentication required." });
			}
		}

		const token = jwt.sign(
			{
				id: account.id,
				role: account.role,
				permissions: account.tier,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);

		res.cookie("BSID", token, basicAccessCookieOptions);

		req.user = {
			id: account.id,
			role: account.role,
			permissions: account.tier,
		};

		return next();
	} catch (error) {
		console.error("Error in verifyRefreshTokenAndGenerateAccessToken:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};
