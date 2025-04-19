import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../db.js";

export const comparePasswords = (password, hash) => {
	return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10);
};

export const verifyBasicAccessToken = async (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];
		if (!bsid) {
			return next();
		} else {
			const decoded = jwt.verify(bsid, process.env.JWT_SECRET);
			req.account = decoded;
			req.bsidVerified = true;
			return next();
		}
	} catch (error) {
		res.status(401).json({ message: "not valid token" });
	}
};

export const verifyPasswordResetToken = async (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];
		if (!bsid) {
			generateBasicAccess;
		} else {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.account = decoded;
			return next();
		}
	} catch (error) {
		res.status(401).json({ message: "not valid token" });
	}
};

export const verifyRefreshToken = async (req, res, next) => {
	try {
		const ssid = req.cookies["SID"];
		if (!ssid) {
			req.refreshTokenValid = false;
			return next();
		}

		const session = await prisma.refreshTokenValid.findUnique({
			where: { sid: ssid },
		});

		if (!session) {
			req.refreshTokenValid = false;
			return next();
		}

		if (Date.now() > new Date(session.expire).getTime()) {
			await prisma.refreshTokenValid.delete({ where: { sid: ssid } });
			req.refreshTokenValid = false;
			return next();
		}

		const profileId = session.profileId;

		const account = await prisma.account.findUnique({
			where: { id: profileId },
			include: { company: true, user: true, loginDevices: true },
		});
		if (!account) {
			return res.status(401).json({ message: "Authentication required." });
		}

		req.account = account;
		req.refreshTokenValid = true;

		console.log("In verifyRefreshToken: req.account =", req.account);

		return next();
	} catch (error) {
		console.error("Error in verifyRefreshToken:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};
export const verifyCredentialsIfNoRefreshToken = async (req, res, next) => {
	if (req.refreshTokenValid) {
		return next();
	}

	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required." });
		}

		const isEmail = email.includes("@");

		const account = await prisma.account.findUnique({
			where: isEmail ? { email } : { username: email },
			include: {
				company: true,
				user: true,
				loginDevices: true,
			},
		});

		if (!account) {
			return res.status(401).json({ message: "Invalid credentials." });
		}

		const isValidPassword = await comparePasswords(password, account.password);
		if (!isValidPassword) {
			return res.status(403).json({ message: "Invalid email or password." });
		}

		if (!account.emailVerified) {
			return res.status(403).json({ message: "Verify your email first." });
		}

		req.account = account;

		return next();
	} catch (error) {
		console.error("Error in verifyCredentialsIfNoRefreshToken:", error);
		return res.status(500).json({ message: "Server Error" });
	}
};

export const verifyAccessToken = (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];

		if (!bsid) {
			console.log("No BSID cookie found");
			req.accessTokenValid = false;
			return next();
		}

		const decoded = jwt.verify(bsid, process.env.JWT_SECRET);

		if (req.account && decoded.id !== req.account.id) {
			console.log("BSID token does not match account ID");
			req.accessTokenValid = false;
			return next();
		}

		console.log("BSID token is valid");
		req.accessTokenValid = true;
		return next();
	} catch (error) {
		console.log("Error verifying BSID token:", error.message);
		req.accessTokenValid = false;
		return next();
	}
};

export const verifyAccessTokenRoute = (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];
		if (!bsid) {
			return next();
		}
		const decoded = jwt.verify(bsid, process.env.JWT_SECRET);
		req.account = decoded;
		console.log(account);
		return next();
	} catch (error) {
		return next();
	}
};
