import NodeMailer from "nodemailer";
import prisma from "../db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { hashPassword } from "./auth.js";

function generateResetToken(accountId) {
	const jti = crypto.randomBytes(16).toString("hex");
	const token = jwt.sign({ sub: accountId }, process.env.JWT_SECRET, {
		expiresIn: "1h",
		jwtid: jti,
	});
	return { token, jti };
}

const sendPasswordResetEmail = async (email) => {
	const { token } = generateResetToken(account.id);
	const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND}/reset-password?token=${token}`;
	const transporter = NodeMailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	await transporter.sendMail({
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Password Reset",
		html: `Click <a href="${resetLink}">here</a> to reset your password.`,
	});
};

export const resetPasswordRequest = async (req, res) => {
	const { email } = req.body;
	res
		.status(200)
		.send(
			"If that email address exists, you will receive a password reset email.",
		);

	const account = await prisma.account.findUnique({
		where: { email },
	});

	if (!account) {
		return;
	}

	await sendPasswordResetEmail(email);
};

export const resetPassword = async (req, res) => {
	const { token, password } = req.body;
	console.log(token);
	console.log(password);
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { sub: accountId, jti } = decoded;

		const jtiHash = crypto.createHash("sha256").update(jti).digest("hex");

		const blacklistedToken = await prisma.blacklistedPasswordToken.findUnique({
			where: { jti: jtiHash },
		});

		if (blacklistedToken) {
			return res.status(400).send("Token has been invalidated.");
		}

		const hashedPassword = await hashPassword(password);
		await prisma.account.update({
			where: { id: accountId },
			data: { password: hashedPassword },
		});

		await prisma.blacklistedPasswordToken.create({
			data: {
				jti: jtiHash,
				expiresAt: new Date(decoded.exp * 1000),
			},
		});

		res.status(200).send("Your password has been updated.");
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			res.status(400).send("Token has expired.");
		} else {
			res.status(400).send("Invalid token.");
		}
	}
};
