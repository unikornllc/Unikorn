import prisma from "../db.js";
import NodeMailer from "nodemailer";
import jwt from "jsonwebtoken";
import { comparePasswords } from "../auth.js";
import { hashPassword } from "../auth.js";
import { createJWT } from "../auth.js";
import { generateUsername } from "unique-username-generator";

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
				wallet: {
					create: {
						amount: 0.0,
						onHold: 0.0,
					},
				},
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
		const { email, password } = req.body;

		// Find the user or company
		const user =
			(await prisma.user.findUnique({
				where: {
					email: email,
				},
			})) ||
			(await prisma.user.findUnique({
				where: {
					username: email,
				},
			}));

		const company = !user
			? (await prisma.company_Profile.findUnique({
				where: {
					username: email,
				},
			})) ||
			(await prisma.company_Profile.findUnique({
				where: {
					email: email,
				},
			}))
			: null;

		// If neither user nor company is found
		if (!user && !company) {
			return res
				.status(400)
				.json({ message: "Error signing in: Invalid credentials." });
		}

		// Validate password
		const account = user || company;
		const isValid = await comparePasswords(password, account.password);
		if (!isValid) {
			return res.status(401).json({ message: "Invalid password." });
		}

		// Create JWT token
		const token = createJWT({
			id: account.id,
			role: user ? "User" : "Company",
		});

		// Set cookies
		res.cookie("token", token, {
			httpOnly: false,
			secure: false,
			sameSite: "Lax",
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});

		res.cookie("userId", account.id, {
			httpOnly: false,
			secure: false,
			sameSite: "Lax",
			maxAge: 24 * 60 * 60 * 1000, // 1 day
		});

		// Successful login response
		res.status(200).json({ message: "Login successful" });
	} catch (error) {
		console.error("Error during sign-in:", error);
		res.status(500).json({ message: "An error occurred while signing in." });
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

const isPlainObject = (obj) => {
	if (Object.getPrototypeOf(obj) === null) {
		return true;
	}
	return Object.getPrototypeOf(obj) === Object.prototype;
};

const removeUserIds = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map(removeUserIds);
	} else if (obj !== null && typeof obj === "object") {
		if (!isPlainObject(obj)) {
			return obj;
		}
		const newObj = {};
		for (const key in obj) {
			if (key !== "userId") {
				newObj[key] = removeUserIds(obj[key]);
			}
		}
		return newObj;
	} else {
		return obj;
	}
};

export const getOneUser = async (req, res) => {
	try {
		const { username, include } = req.query;

		if (!username) {
			return res
				.status(400)
				.json({ message: "Username is required to update the user." });
		}

		const user = await prisma.user.findUnique({
			where: {
				username,
			},
			...(include
				? {
					include: Object.fromEntries(
						Object.entries(include).map(([key, value]) => [
							key,
							value === "true",
						]),
					),
				}
				: {}),
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const isCurrentUser = user.id === req.decodedUser.id;

		const safeUser = (({ verified, id, password, ...rest }) => rest)(user);

		if (!isCurrentUser) {
			delete safeUser.email;
		}

		const cleanedUser = removeUserIds(safeUser);

		res.status(200).json({
			isCurrentUser,
			user: cleanedUser,
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching user" });
	}
};

export const getCurrentUser = async (req, res) => {
	try {
		const { include } = req.query;
		const user = await prisma.user.findUnique({
			where: {
				id: req.decodedUser.id,
			},
			...(include
				? {
					include: Object.fromEntries(
						Object.entries(include).map(([key, value]) => [
							key,
							value === "true",
						]),
					),
				}
				: {}),
		});
		const safeUser = (({ verified, id, password, ...rest }) => rest)(user);
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
		if (req.decodedUser.id && user.id && req.decodedUser.id == user.id) {
			isCurrentUser = true;
		}
		res.status(200).json({ user, isCurrentUser });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching user" });
	}
};

export const suggestUsername = async (req, res) => {
	try {
		const { email, name } = req.query;

		if (!email || !name) {
			return res.status(400).json({ message: "Email and name are required." });
		}
		const usernameSuggestions = await suggestUsernamePassport(email, name);
		res.status(200).json({ usernameSuggestions: usernameSuggestions });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Internal Server Error" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { username, ...updateData } = req.body;

		if (!username) {
			return res
				.status(400)
				.json({ message: "Username is required to update the user." });
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: req.decodedUser.id,
				username: username,
			},
			data: updateData,
		});
		res.status(200).json({
			user: (({ verified, id, password, email, ...safe }) => safe)(updatedUser),
		});
	} catch (error) {
		// console.error("Error updating user:", error);
		res.status(400).json({ message: "Error updating user." });
	}
};

export const updateUserItem = async (req, res) => {
	try {
		const { model, id, data } = req.body;

		if (!model || !id || !data) {
			return res.status(400).json({
				message: "Model type, item ID and update data are required."
			});
		}
		const updatedItem = await prisma[capitalizeFirstLetter(model)].update({
			where: { id, user: { id: req.decodedUser.id } },
			data: sanitizeData(model, data),
		});
		// console.log(updatedItem)
		if (!updatedItem) {
			return res.status(401).json({
				message: "Not authorized to update this item or item not found."
			});
		}

		res.status(200).json({
			[model]: updatedItem,
		});

	} catch (error) {
		console.error(`Error updating ${req.body.model}:`, error);
		res.status(400).json({ message: `Error updating ${req.body.model}.` });
	}
};

const capitalizeFirstLetter = (string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

const sanitizeData = (model, data) => {
	switch (model) {
		case 'expertise':
			return {
				field: data.field,
			};

		case 'education':
			return {
				degree: data.degree,
				institution: data.institution,
			};

		case 'interest':
			return {
				name: data.name,
			};

		case 'corporate_Experience':
			return {
				job_title: data.job_title,
				company_name: data.company_name,
				start_date: new Date(data.start_date),
				end_date: data.end_date ? new Date(data.end_date) : null,
				responsibilities: data.responsibilities,
			};

		case 'startup_Experience':
			return {
				startup_name: data.startup_name,
				role: data.role,
				description: data.description,
			};

		case 'certifications_Courses':
			return {
				title: data.title,
				institution: data.institution,
				completion_date: new Date(data.completion_date),
				focus_area: data.focus_area,
			};

			case 'interest':
				return {
					name: data.name,
				};

		case 'language':
			return {
				language: data.language,
				proficiency: data.proficiency,
			};

		case 'social_Media':
			return {
				platform: data.platform,
				url: data.url,
			};

		default:
			throw new Error('Invalid model type');
	}
};

export async function suggestUsernamePassport(email, name) {
	const MIN_USERNAME_LENGTH = 5;
	const MAX_USERNAME_LENGTH = 16;

	const ensureMinLength = (username) => {
		if (username.length >= MIN_USERNAME_LENGTH) {
			return username;
		}
		let extendedUsername = username;
		const potentialAdditions = [firstName, lastName, emailNamePart, initials]
			.filter((part) => part && !extendedUsername.includes(part))
			.map((part) =>
				part.substring(0, MIN_USERNAME_LENGTH - extendedUsername.length),
			);

		for (const part of potentialAdditions) {
			extendedUsername += part;
			if (extendedUsername.length >= MIN_USERNAME_LENGTH) {
				break;
			}
		}

		if (extendedUsername.length < MIN_USERNAME_LENGTH) {
			const numbersNeeded = MIN_USERNAME_LENGTH - extendedUsername.length;
			const randomNumber = Math.floor(
				Math.random() * Math.pow(10, numbersNeeded),
			);
			extendedUsername += randomNumber.toString().padStart(numbersNeeded, "0");
		}
		return extendedUsername.substring(0, MAX_USERNAME_LENGTH);
	};

	const emailNamePart = email
		.split("@")[0]
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "");
	const names = name.trim().split(" ").filter(Boolean);
	const firstName = names[0]
		? names[0].toLowerCase().replace(/[^a-z]/g, "")
		: "";
	const lastName =
		names.length > 1
			? names[names.length - 1].toLowerCase().replace(/[^a-z]/g, "")
			: "";
	const initials = (firstName.charAt(0) || "") + (lastName.charAt(0) || "");

	const trimmedEmailPart = emailNamePart.substring(0, MAX_USERNAME_LENGTH);
	const trimmedFirstName = firstName.substring(0, MAX_USERNAME_LENGTH);
	const trimmedLastName = lastName.substring(0, MAX_USERNAME_LENGTH);

	const baseUsernames = [
		`${trimmedFirstName}.${trimmedLastName}`,
		`${trimmedFirstName}${trimmedLastName}`,
		`${initials}${trimmedLastName}`,
		`${trimmedLastName}${initials}`,
		`${trimmedEmailPart}`,
	].map((username) => ensureMinLength(username));

	const generateUniqueUsername = async (base) => {
		let username = base.substring(0, MAX_USERNAME_LENGTH);
		let suffix = 0;
		username = username.replace(/\.$/, "");

		let isUnique = false;
		do {
			let potentialUsername = username;
			if (suffix > 0) {
				potentialUsername = `${username}${suffix}`;
				potentialUsername = potentialUsername.substring(0, MAX_USERNAME_LENGTH);
			}
			potentialUsername = ensureMinLength(potentialUsername);

			const userExists = await prisma.user.findUnique({
				where: { username: potentialUsername },
			});
			const companyExists = await prisma.company_Profile.findUnique({
				where: { username: potentialUsername },
			});
			if (!userExists && !companyExists) {
				isUnique = true;
				username = potentialUsername;
			} else {
				suffix++;
			}
		} while (!isUnique && suffix < 1000);

		return username;
	};

	const usernameSuggestions = [];

	for (const base of baseUsernames) {
		const username = await generateUniqueUsername(base);
		if (
			usernameSuggestions.length < 3 &&
			!usernameSuggestions.includes(username)
		) {
			usernameSuggestions.push(username);
		}
		if (usernameSuggestions.length >= 3) {
			break;
		}
	}
	while (usernameSuggestions.length < 3) {
		const randomUsername = generateUsername("", 2, 0);
		//console.log(randomUsername);
		let trimmedRandomUsername = randomUsername
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.substring(0, MAX_USERNAME_LENGTH);
		trimmedRandomUsername = ensureMinLength(trimmedRandomUsername);

		const userExists = await prisma.user.findUnique({
			where: { username: trimmedRandomUsername },
		});
		const companyExists = await prisma.company_Profile.findUnique({
			where: { username: trimmedRandomUsername },
		});

		if (
			!userExists &&
			!companyExists &&
			!usernameSuggestions.includes(trimmedRandomUsername)
		) {
			usernameSuggestions.push(trimmedRandomUsername);
		}
	}
	return usernameSuggestions;
}



export const deleteUser = async (req, res) => {
	try {
		const id = req.query.userId;
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

// export const suggestUsername = async (req, res) => {
// 	try {
// 		const baseusername = req.query.email.split("@")[0].toLowerCase();
// 		const basename = req.query.name.split(" ");
// 		const basenameI = basename[0].toLowerCase();
// 		const basenameF = basename[basename.length - 1].toLowerCase();
// 		let username1 = baseusername + (Math.floor(Math.random() * 900) + 100);
// 		let username2 =
// 			basenameI + basenameF + (Math.floor(Math.random() * 900) + 100);
// 		let username3 =
// 			basenameF + "_" + basenameI + (Math.floor(Math.random() * 900) + 100);
// 		let count;
// 		while (await prisma.user.findUnique({ where: { username: username1 } })) {
// 			count = Math.floor(Math.random() * 900) + 100;
// 			username1 = baseusername + count;
// 		}
// 		while (await prisma.user.findUnique({ where: { username: username2 } })) {
// 			count = Math.floor(Math.random() * 900) + 100;
// 			username2 = basenameI + basenameF + count;
// 		}
// 		while (await prisma.user.findUnique({ where: { username: username3 } })) {
// 			count = Math.floor(Math.random() * 900) + 100;
// 			username3 = basenameF + "_" + basenameI + count;
// 		}
// 		res.status(200).json({ username: [username1, username2, username3] });
// 	} catch (e) {
// 		console.error(e);
// 	}
// };


export const getTier = async (req, res) => {
	try {
		if (req.decodedUser.role === "User") {
			const user = await prisma.user.findUnique({
				where: {
					id: req.decodedUser.id,
				},
				select: {
					tier: true,
				},
			});
			res.status(200).json({ tier: user.tier });
		} else {
			const company = await prisma.company_Profile.findUnique({
				where: {
					id: req.decodedUser.id,
				},
				select: {
					tier: true,
				},
			});
			res.status(200).json({ tier: company.tier });
		}
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching tier" });
	}
};

export const updateTier = async (req, res) => {
	try {
		const updatedTier = await prisma.user.update({
			where: {
				id: req.decodedUser.id,
			},
			data: {
				tier: req.body.tier,
			},
		});
		res.status(200).json({ message: "Tier updated successfully" });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error updating tier" });
	}
};
