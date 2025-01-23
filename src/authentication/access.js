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
	const refresh = req.cookies["SID"];
	if (!refresh) {
		res.status(401).json({ message: "Session Expired, Please login" });
	}
	const session = await prisma.refreshTokenValid.findUnique({
		SID: refresh,
	});
	if (!session) {
		res.status(401).json({ message: "Session Expired, Please login" });
	}
	if (Date.now() > session.expire) {
		await prisma.refreshTokenValid.delete({ SID: ssid });
		res.status(401).json({ message: "Session Expired, Please login" });
	}
	const user = await prisma.user.findUnique({ id: session.profileId });
	const company = await prisma.company_File.findUnique({
		id: session.profileId,
	});
	if (!user && !company) {
		res.status(401).json({ message: "Session Expired, Please login" });
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
	next();
};

export const generatePasswordResetToken = async (req, res, next) => {
	const refresh = req.cookies["SID"];
	if (!refresh) {
		res.status(401).json({ message: "Session Expired, Please login" });
	}
	const session = await prisma.refreshTokenValid.findUnique({
		SID: refresh,
	});
	if (!session) {
		res.status(401).json({ message: "Session Expired, Please login" });
	}
	if (Date.now() > session.expire) {
		res.status(401).json({ message: "Session Expired, Please login" });
	}
	const user = await prisma.user.findUnique({ id: session.profileId });
	const company = await prisma.company_File.findUnique({
		id: session.profileId,
	});
	if (!user && !company) {
		res.status(401).json({ message: "Session Expired, Please login" });
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
	next();
};
