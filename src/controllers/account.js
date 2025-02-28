import prisma from "../db.js";
import NodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { hashPassword } from "../auth.js";

export const createAccount = async (req, res) => {
	try {
		const data = req.body.formData;
		const role = req.body.role;
		const hashedPassword = await hashPassword(data.password);

		const account = await prisma.account.create({
			data: {
				username: data.username,
				email: data.email,
				password: hashedPassword,
				mobileNumber: data.mobileNumber,
				role,
				wallet: {
					create: {},
				},
				ledgerAccount: {
					create: {
						name: data.name,
					},
				},
				user: role === "User" ? {
					create: {
						name: data.name,
						description: data.description || "",
						title: data.title,
					},
				} : undefined,
				company: role === "Company" ? {
					create: {
						name: data.name,
						description: data.description,
						website: data.website,
						founded: new Date(data.founded),
						type: data.type || "Public",
						hqLocation: data.hqLocation,
						industry: data.industry,
					},
				} : undefined,
			},
		});
		await sendVerifyEmail(data.email, account.id);

		res.status(200).json({ message: "created successfully" });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error creating" });
	}
};

function generateVerifyToken(accountId) {
	const jti = crypto.randomBytes(16).toString("hex");
	const token = jwt.sign({ sub: accountId }, process.env.JWT_SECRET, {
		expiresIn: "1h",
		jwtid: jti,
	});
	return { token, jti };
}

const sendVerifyEmail = async (email, accountId) => {
	const { token } = generateVerifyToken(accountId);
	const verificationLink = `${process.env.FRONTEND}/verifyAccount?token=${token}`;
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
		subject: "Verify Your Email",
		html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
	});
};

export const verifyAccount = async (req, res) => {
	const { token } = req.query;
	console.log(req.query);

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

		await prisma.account.update({
			where: { id: accountId },
			data: { emailVerified: true },
		});

		await prisma.blacklistedPasswordToken.create({
			data: {
				jti: jtiHash,
				expiresAt: new Date(decoded.exp * 1000),
			},
		});

		res.status(200).send("Email Verified.");
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			res.status(400).send("Token has expired.");
		} else {
			res.status(400).send("Invalid token.");
		}
	}
};
