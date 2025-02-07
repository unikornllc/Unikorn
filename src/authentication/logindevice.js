import NodeMailer from "nodemailer";
import prisma from "../db.js";
import { UAParser } from "ua-parser-js";

export async function sendNewLoginNotification(email, ip, os, browser) {
	const transporter = NodeMailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const passwordResetLink = `${process.env.FRONTEND}/password-reset-request`;

	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: "New Login Device Detected",
			html: `
				<div>
					<p><strong>IP Address:</strong> ${ip}</p>
					<p><strong>Browser:</strong> ${browser}</p>
					<p><strong>Operating System:</strong> ${os}</p>
					<p>If this was you, no action is needed.</p>
					<p>If this wasn't you, please reset your password <a href="${passwordResetLink}">here</a>.</p>
				</div>
			`,
		});
		console.log(`New login email sent to ${email}`);
	} catch (error) {
		console.error("Failed to send email:", error);
	}
}

export const handleNewDevice = async (req, res, next) => {
	try {
		if (!req.account) {
			return next();
		}

		const account = req.account;
		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const userAgent = req.get("User-Agent") || "";
		const parser = new UAParser(userAgent);
		const { os, browser } = parser.getResult();

		const existingDevice = await prisma.loginDevices.findFirst({
			where: {
				OR: [
					{ userId: account.role === "User" ? account.id : undefined },
					{ companyId: account.role === "Company" ? account.id : undefined },
				],
				ip,
				browser: browser.name,
				os: os.name,
			},
		});

		if (!existingDevice) {
			await prisma.loginDevices.create({
				data: {
					userId: account.role === "User" ? account.id : null,
					companyId: account.role === "Company" ? account.id : null,
					ip,
					browser: browser.name,
					os: os.name,
				},
			});

			await sendNewLoginNotification(account.email, ip, os.name, browser.name);
		}

		return next();
	} catch (error) {
		console.error("Error in handleNewDevice:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};
