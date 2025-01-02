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
				username: userData.username,
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
		let user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
		if (!user) {
			user = await prisma.user.findUnique({
				where: {
					username: req.body.email,
				},
			});
		}
		if (!user) {
			res.status(400).json({ message: "Error signing in" });
		}

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
				username: req.query.username,
			},
		});
		const { verified, id, password, email, ...safeUser } = user;
		res.status(200).json({ user: safeUser });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching user" });
	}
};
export const getCurrentUser = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.cookies.userId,
			},
		});
		const { verified, id, password, email, ...safeUser } = user;
		res.status(200).json({ user: safeUser });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching user" });
	}
};
export const isCurrentUser = async (req, res) => {
	try {
		let isCurrentUser = false;
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
		});
		if (req.cookies.userId && user.id && req.cookies.userId == user.id) {
			isCurrentUser = true;
		}
		res.status(200).json({ user, isCurrentUser });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching user" });
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

export const checkUsername = async (req, res) => {
	try {
		const username = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
		});
		if (username) {
			res.status(200).json({ exists: true });
		} else {
			res.status(200).json({ exists: false });
		}
	} catch (e) {
		console.error(e);
	}
};

export const checkEmail = async (req, res) => {
	try {
		const email = await prisma.user.findFirst({
			where: {
				email: req.query.email,
			},
		});
		if (email) {
			res.status(200).json({ exists: true });
		} else {
			res.status(200).json({ exists: false });
		}
	} catch (e) {
		console.error(e);
	}
};

export const suggestUsername = async (req, res) => {
	try {
		const baseusername = req.query.email.split("@")[0].toLowerCase();
		const basename = req.query.name.split(" ");
		const basenameI = basename[0].toLowerCase();
		const basenameF = basename[basename.length - 1].toLowerCase();
		let username1 = baseusername + (Math.floor(Math.random() * 900) + 100);
		let username2 =
			basenameI + basenameF + (Math.floor(Math.random() * 900) + 100);
		let username3 =
			basenameF + "_" + basenameI + (Math.floor(Math.random() * 900) + 100);
		let count;
		while (await prisma.user.findUnique({ where: { username: username1 } })) {
			count = Math.floor(Math.random() * 900) + 100;
			username1 = baseusername + count;
		}
		while (await prisma.user.findUnique({ where: { username: username2 } })) {
			count = Math.floor(Math.random() * 900) + 100;
			username2 = basenameI + basenameF + count;
		}
		while (await prisma.user.findUnique({ where: { username: username3 } })) {
			count = Math.floor(Math.random() * 900) + 100;
			username3 = basenameF + "_" + basenameI + count;
		}
		res.status(200).json({ username: [username1, username2, username3] });
	} catch (e) {
		console.error(e);
	}
};
