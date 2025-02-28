import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import prisma from "../db.js";
import { comparePasswords } from "../auth.js";
import NodeMailer from "nodemailer";
import { sendNewLoginNotification } from "./loginDevice.js";

const refreshCookieOptions = {
	httpOnly: true, // TODO: Change to true
	secure: true, // TODO: Change to true
	maxAge: 7 * 24 * 60 * 60 * 1000,
	sameSite: "Lax",
};

export const generateRefreshToken = async (req, res, next) => {
	try {
		if (req.sidVerified) {
			return next();
		}
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required." });
		}

		const account = await prisma.account.findUnique({
			where: { OR: [{ email: email }, { username: email }] },
			include: { company: true, user: true, loginDevices: true },
		});
		if (!account) {
			return res.status(401).json({ message: "Authentication required." });
		}

		const isValid = await comparePasswords(password, account.password);
		if (!isValid) {
			return res.status(403).json({ message: "Invalid email or password." });
		}
		if (!account.emailVerified) {
			return res.status(403).json({ message: "Verify Email" });
		}
		const token = crypto.randomBytes(128).toString("hex");
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const userAgent = req.get("User-Agent");
		const parser = new UAParser(userAgent);
		const { os, browser } = parser.getResult();

		const existingDevice = account.loginDevices?.some(
			(device) =>
				device.ip === ip ||
				device.os === os.name ||
				device.browser === browser.name,
		);
		if (!existingDevice) {
			await prisma.loginDevices.create({
				data: {
					accountId: account.id,
					ip,
					browser: browser.name,
					os: os.name,
				},
			});

			const transporter = NodeMailer.createTransport({
				service: "gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});
			const passwordResetLink = `${process.env.FRONTEND_URL}/resetpassword`;
			await transporter.sendMail({
				from: process.env.EMAIL_USER,
				to: account.email,
				subject: "New Login Device Detected",
				html: `
                    <div>
                        <p><strong>IP Address:</strong> ${ip}</p>
                        <p><strong>Browser:</strong> ${browser.name}</p>
                        <p><strong>Operating System:</strong> ${os.name}</p>
                        <p>If this was you, no action is needed.</p>
                        <p>If this wasn't you, please reset your password <a href="${passwordResetLink}">here</a>.</p>
                    </div>
                `,
			});
		}
		await prisma.refreshTokenValid.create({
			data: {
				sid: token,
				profileId: account.id,
				expire: expiresAt,
				ip,
				browser: browser.name,
				os: os.name,
				role: (String)(account.role),
			},
		});
		res.sidVerified = true;
		res.cookie("SID", token, refreshCookie);
		return next();
	} catch (error) {
		console.error("Error in generateRefreshToken:", error);
		res.status(500).json({ message: "Internal server error." });
	}
};

export const generateRefreshTokenIfNeeded = async (req, res, next) => {
	console.log(
		"In generateAccessTokenIfNeeded: req.accessTokenValid =",
		req.accessTokenValid,
	);

	if (req.refreshTokenValid) {
		return next();
	}

	try {
		const account = req.account;

		if (!account) {
			return res.status(401).json({ message: "Authentication required." });
		}

		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const userAgent = req.get("User-Agent");
		const parser = new UAParser(userAgent);
		const { os, browser } = parser.getResult();

		const loginDevices = await prisma.loginDevices.findMany({
			where: {
				accountId: account.id
			},
		});

		const existingDevice = loginDevices?.some(
			(device) =>
				device.ip === ip ||
				device.os === os.name ||
				device.browser === browser.name,
		);

		if (!existingDevice) {
			await prisma.loginDevices.create({
				data: {
					accountId: account.id,
					ip,
					browser: browser.name,
					os: os.name,
				},
			});

			sendNewLoginNotification(account.email, ip, os.name, browser.name);
		}

		const token = crypto.randomBytes(128).toString("hex");
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		await prisma.refreshTokenValid.create({
			data: {
				sid: token,
				profileId: account.id,
				expire: expiresAt,
				ip,
				browser: browser.name,
				os: os.name,
				role: account.role,
			},
		});

		res.cookie("SID", token, refreshCookieOptions);

		req.refreshTokenValid = true;
		return next();
	} catch (error) {
		console.error("Error in generateRefreshTokenIfNeeded:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};
