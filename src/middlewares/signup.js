import prisma from "../db.js";
export const confirmPassword = async (req, res, next) => {
	try {
		if (!req.body.formData.password || !req.body.formData.confirmPassword) {
			res.status(400).json({ message: "Enter Password lil bro." });
		} else if (
			req.body.formData.password.length < 5 ||
			!/[!@#$%^&*(),.?":{}|<>]/.test(req.body.formData.password)
		) {
			res.status(400).json({
				message:
					"Password must be at least 5 characters long and contain at least one special character.",
			});
		} else if (
			req.body.formData.password == req.body.formData.confirmPassword
		) {
			next();
		} else {
			res.status(400).json({ message: "Passwords do not match." });
		}
	} catch (e) {
		res.status(400);
	}
};

export const checkEmail = async (req, res, next) => {
	try {
		//console.log(req.body.formData);
		const email = req.body.formData.email;
		const accountEmail = await prisma.account.findFirst({
			where: {
				email: email,
			},
		});
		if (accountEmail == null) {
			next();
		} else {
			res.status(400).json({ message: "Email is already registered" });
		}
	} catch (e) {
		console.error(e);
	}
};

export const checkUsername = async (req, res, next) => {
	try {
		const MIN_USERNAME_LENGTH = 4;
		const MAX_USERNAME_LENGTH = 20;
		const username = req.body.formData.username;

		console.log(username);
		if (!username || username.length < MIN_USERNAME_LENGTH) {
			return res.status(400).json({
				message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
			});
		}
		if (username.length > MAX_USERNAME_LENGTH) {
			return res.status(400).json({
				message: `Username must be at most ${MAX_USERNAME_LENGTH} characters long.`,
			});
		}

		const existingUsername = await prisma.account.findFirst({
			where: {
				username: username,
			},
		});

		if (!existingUsername) {
			next();
		} else {
			return res.status(400).json({ message: "Username is already taken." });
		}
	} catch (e) {
		console.error("Database Error:", e);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const checkUsernameAPI = async (req, res, next) => {
	try {
		const MIN_USERNAME_LENGTH = 4;
		const MAX_USERNAME_LENGTH = 20;
		const { username } = req.query;

		console.log(username);
		if (!username || username.length < MIN_USERNAME_LENGTH) {
			return res.status(200).json({
				valid: false,
				message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long.`,
			});
		}
		if (username.length > MAX_USERNAME_LENGTH) {
			return res.status(200).json({
				valid: false,
				message: `Username must be at most ${MAX_USERNAME_LENGTH} characters long.`,
			});
		}

		const existingUsername = await prisma.account.findFirst({
			where: {
				username: username,
			},
		});
		console.log(existingUsername);
		if (!existingUsername) {
			return res
				.status(200)
				.json({ valid: true, message: "Username is available." });
		} else {
			return res
				.status(200)
				.json({ valid: false, message: "Username is already taken." });
		}
	} catch (e) {
		console.error("Database Error:", e);
		return res.status(500).json({ message: "Internal server error" });
	}
};
