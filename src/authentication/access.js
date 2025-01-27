import jwt from "jsonwebtoken";
import prisma from "../db.js";

const StandardProfile = ["StandardView", "EditProfile", "Feed"];
const ProProfile = ["ProView", "Communicate", "EditProfile", "Feed"];
const HunterPrfile = ["HunterView", "Communicate", "EditProfile", "Feed"];
const HolderProfile = ["HolderView", "EditProfile", "Feed"];
const ChangePassword = ["ChangePassword"];

const BasicAccessCookie = {
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

export const generateBasicAccess = async (req, res, next) => {
	try {
		const refresh = req.cookies["SID"];
		if (!refresh) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		const session = await prisma.refreshTokenValid.findUnique({
			SID: refresh,
		});
		if (!session) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		if (Date.now() > session.expire) {
			await prisma.refreshTokenValid.delete({ SID: ssid });
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		const user = await prisma.user.findUnique({ id: session.profileId });
		const company = await prisma.company_File.findUnique({
			id: session.profileId,
		});
		if (!user && !company) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		let permission;
		if (user) {
			permission = user.tier == "Standard" ? "Standard" : "Pro";
		} else {
			permission = company.hunter ? "Hunter" : "Holder";
		}
		const token = jwt.sign(
			{
				id: session.profileId,
				role: session.role,
				permissions: permission,
				authLevel: "Password",
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "1d",
			},
		);
		res.cookie("BSID", token, BasicAccessCookie);
		return next();
	} catch (error) {
		return res.status(500).json({ message: "Server Error" });
	}
};

export const generatePasswordResetToken = async (req, res, next) => {
	try {
		const refresh = req.cookies["SID"];
		if (!refresh) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		const session = await prisma.refreshTokenValid.findUnique({
			SID: refresh,
		});
		if (!session) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		if (Date.now() > session.expire) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		const user = await prisma.user.findUnique({ id: session.profileId });
		const company = await prisma.company_Profile.findUnique({
			id: session.profileId,
		});
		if (!user && !company) {
			return res.status(401).json({ message: "Session Expired, Please login" });
		}
		const permission = "Password";
		const token = jwt.sign(
			{
				id: session.profileId,
				role: session.role,
				permissions: permission,
				authLevel: "Password",
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "15m",
			},
		);
		res.cookie("PSID", token, PasswordResetAccessCookie);
		return next();
	} catch (error) {
		return res.status(500).json({ message: "Server Error" });
	}
};
