import NodeMailer from "nodemailer";
import prisma from "../db.js";
import { hashPassword } from "../authentication/auth.js";

const sendPasswordResetEmail = async (email, token) => {
	const resetLink = `${process.env.FRONTEND}/reset-password?token=${token}`;
	const transporter = NodeMailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	await transporter.sendMail({
		from: process.env.EMAIL_USER,
		to: account.email,
		subject: "Password Reset",
		html: `Click <a href="${resetLink}">here</a> to reset your password.`,
	});
};

export const resetPasswordRequest = async (req, res) => {
	const { email } = req.body;

	const user = await prisma.user.findOne({ where: { email } });
	if (!user) {
		return res
			.status(200)
			.send(
				"If that email address is in our database, we will send you an email to reset your password.",
			);
	}
	const token = generateResetToken();
	user.resetPasswordToken = token;
	user.resetPasswordExpires = Date.now() + 3600000;
	await user.save();
	await sendPasswordResetEmail(user.email, token);

	res
		.status(200)
		.send(
			"If that email address is in our database, we will send you an email to reset your password.",
		);
};

export const resetasync = async (req, res) => {
	const { token, password } = req.body;

	const user = await prisma.user.findOne({
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() },
	});

	if (!user) {
		return res
			.status(400)
			.send("Password reset token is invalid or has expired.");
	}

	user.password = await hashPassword(password);
	user.resetPasswordToken = undefined;
	user.resetPasswordExpires = undefined;
	await user.save();

	// 3. Optionally, send a confirmation email

	res.status(200).send("Your password has been updated.");
};
