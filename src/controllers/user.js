import prisma from "../db.js";
import NodeMailer from "nodemailer";
import jwt from "jsonwebtoken";

import { comparePasswords } from "./auth.js";
import { hashPassword } from "./auth.js";
import { createJWT } from "./auth.js";

export const createUser = async (req, res) => {
	try {
		const userData = req.body.formData;
		const hashedPassword = await hashPassword(userData.password);
		const newUser = await prisma.user.create({
			data: {
				name: userData.name,
				email: userData.email,
				password: hashedPassword,
				description: userData.description || "",
				title: userData.title,
			},
		});

		const email = userData.email;
		const token = jwt.sign({ email }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.cookie("token", token, {
			httpOnly: false,
			secure: false,
			maxAge: 24 * 60 * 60 * 1000,
			sameSite: "lax",
		});

		res.cookie("userId", newUser.id, {
			httpOnly: false,
			secure: false,
			maxAge: 24 * 60 * 60 * 1000,
			sameSite: "strict",
		});

		const transporter = NodeMailer.createTransport({
			service: "gmail",
			auth: {
				user: "unikorn2025@gmail.com",
				pass: "sihs kadv vsdb yeqn",
			},
		});

		const verificationLink = `${process.env.FRONTEND}/verifyUser`;
		await transporter.sendMail({
			from: "unikorn2025@gmail.com",
			to: email,
			subject: "Verify Your Email",
			html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
		});

		res.status(200).json({
			message: "User created successfully",
			user: newUser,
		});
	} catch (error) {
		console.error("Error creating user:", error);

		res.status(400).json({
			message: "Error creating user",
			error: error.message,
		});
	}
};

export const verifyUser = async (req, res) => {
	const token = req.cookies["token"];
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await prisma.user.findUnique({
			where: {
				email: decoded.email,
			},
		});
		if (!user) {
			return res.status(400).json({ error: "Invalid token" });
		}
		await prisma.user.update({
			where: {
				email: decoded.email,
			},
			data: {
				verified: true,
			},
		});
		res.status(200).send("Account successfully verified! You can now log in.");
	} catch (error) {
		console.log(error);
		res.status(400).json({ error: "Invalid or expired token" });
	}
};

export const signIn = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});

		const isValid = await comparePasswords(req.body.password, user.password);

		if (!isValid) {
			res.status(401);
			res.json({ message: "nope" });
			return;
		}

		const token = createJWT(user);

		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.cookie("userId", user.id, {
			httpOnly: true,
			secure: true,
			sameSite: "Strict",
			maxAge: 24 * 60 * 60 * 1000,
		});
		//console.log(res);
		res.status(200).json({ message: "Login successful" });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error signing in" });
	}
};

export const getAllUser = async (req, res) => {
	try {
		const user = await prisma.user.findMany();
		res.status(200).json(user);
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching users" });
	}
};

export const getOneUser = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});
		res.status(200).json({ data: user });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching users" });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const id = req.body.userId;
		await prisma.social_Media.deleteMany({ where: { userId: id } });
		await prisma.interest.deleteMany({ where: { userId: id } });
		await prisma.corporate_Experience.deleteMany({ where: { userId: id } });
		await prisma.expertise.deleteMany({ where: { userId: id } });
		await prisma.education.deleteMany({ where: { userId: id } });
		await prisma.language.deleteMany({ where: { userId: id } });
		await prisma.startup_Experience.deleteMany({ where: { userId: id } });
		await prisma.certifications_Courses.deleteMany({ where: { userId: id } });
		const user = await prisma.user.delete({ where: { id: id } });
		res.status(200).json(user);
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error deleting user" });
	}
};
