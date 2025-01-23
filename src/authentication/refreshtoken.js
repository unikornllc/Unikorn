import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import prisma from "../db.js";
import { comparePasswords } from "../auth.js";
import NodeMailer from "nodemailer";

const refreshCookie = {
	httpOnly: true, // TODO: Change to true
	secure: true, // TODO: Change to true
	maxAge: 7 * 24 * 60 * 60 * 1000,
	sameSite: "Lax",
};

export const generateRefreshToken = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required." });
		}
		const user =
			(await prisma.user.findUnique({ where: { email } })) ||
			(await prisma.user.findUnique({ where: { username: email } }));
		const company = !user
			? (await prisma.company_Profile.findUnique({
					where: { username: email },
				})) || (await prisma.company_Profile.findUnique({ where: { email } }))
			: null;
		if (!user && !company) {
			return res.status(401).json({ message: "Invalid credentials." });
		}
		const account = user || company;
		const isValid = await comparePasswords(password, account.password);
		if (!isValid) {
			return res.status(403).json({ message: "Invalid email or password." });
		}
		let token = crypto.randomBytes(128).toString("hex");
		const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const userAgent = req.get("User-Agent");
		const parser = new UAParser(userAgent);
		const { os, browser } = parser.getResult();

		const existingDevice = account.loginDevices?.some(
			(device) =>
				device.ip === ip &&
				device.os === os.name &&
				device.browser === browser.name,
		);
		if (!existingDevice) {
			await prisma.loginDevices.create({
				data: {
					userId: user ? account.id : null,
					companyId: company ? account.id : null,
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
				role: user ? "User" : "Company",
			},
		});
		res.cookie("SID", token, refreshCookie);
		res.status(200).json({ message: "Login successful." });
	} catch (error) {
		console.error("Error in generateRefreshToken:", error);
		res.status(500).json({ message: "Internal server error." });
	}
};
