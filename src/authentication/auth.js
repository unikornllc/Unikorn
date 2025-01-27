import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../db.js";
import { UAParser } from "ua-parser-js";
import { generateBasicAccess } from "./access.js";

export const comparePasswords = (password, hash) => {
	return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10);
};

export const verifyRefreshToken = async (req, res, next) => {
	try {
		const ssid = req.cookies["SID"];
		if (!ssid) {
			return next();
		}
		const sessions = await prisma.refreshTokenValid.findMany({
			where: { sid: ssid },
		});
		if (!sessions || sessions.length === 0) {
			return next();
		}
		const user = await prisma.user.findUnique({
			where: { id: sessions[0].profileId },
			include: { logindevices: true },
		});
		const company = !user
			? await prisma.company_Profile.findUnique({
					where: { id: sessions[0].profileId },
					include: { logindevices: true },
				})
			: null;
		if (!user && !company) {
			return res.status(401).json({ message: "Invalid credentials." });
		}
		const account = user || company;
		const linkedDevices = account.logindevices;

		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const userAgent = req.get("User-Agent");
		const parser = new UAParser(userAgent);
		const { os, browser } = parser.getResult();

		let sessionValid = false;
		for (const session of sessions) {
			if (Date.now() > session.expire) {
				await prisma.refreshTokenValid.delete({ where: { SID: session.sid } });
				continue;
			}
			for (const device of linkedDevices) {
				if (
					device.ip === ip &&
					device.os === os.name &&
					device.browser === browser.name
				) {
					sessionValid = true;
					break;
				}
			}
		}
		if (!sessionValid) {
			return next();
		}
		return res.status(200).redirect(`${process.env.FRONTEND}/userHome`);
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
};

export const verifyBasicAccessToken = async (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];
		if (!bsid) {
			generateBasicAccess;
		} else {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.decodedUser = decoded;
			return next();
		}
	} catch (error) {
		res.status(401).json({ message: "not valid token" });
	}
};

export const verifyPasswordResetToken = async (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];
		if (!bsid) {
			generateBasicAccess;
		} else {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.decodedUser = decoded;
			return next();
		}
	} catch (error) {
		res.status(401).json({ message: "not valid token" });
	}
};
