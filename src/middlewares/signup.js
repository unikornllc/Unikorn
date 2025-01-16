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
		const userEmail = await prisma.user.findFirst({
			where: {
				email: email,
			},
		});
		const companyEmail = await prisma.company_Profile.findFirst({
			where: {
				email: email,
			},
		});
		if (userEmail == null && companyEmail == null) {
			next();
		} else {
			res.status(400).json(req.body.formData);
		}
	} catch (e) {
		console.error(e);
	}
};

export const checkUsername = async (req, res, next) => {
	try {
		const username = req.body.formData.username;
		const userUsername = await prisma.user.findFirst({
			where: {
				username: username,
			},
		});
		const companyUsername = await prisma.company_Profile.findFirst({
			where: {
				username: username,
			},
		});
		if (userUsername == null && companyUsername == null) {
			next();
		} else {
			res.status(400).json(req.body.formData);
		}
	} catch (e) {
		console.error(e);
	}
};
