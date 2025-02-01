import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../db.js";

export const comparePasswords = (password, hash) => {
	return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10);
};

// export const verifyRefreshToken = async (req, res, next) => {
// 	try {
// 		const ssid = req.cookies["SID"];
// 		if (!ssid) {
// 			return next();
// 		}
// 		const sessions = await prisma.refreshTokenValid.findMany({
// 			where: { sid: ssid },
// 		});
// 		if (!sessions || sessions.length === 0) {
// 			return next();
// 		}
// 		const user = await prisma.user.findUnique({
// 			where: { id: sessions[0].profileId },
// 			include: { logindevices: true },
// 		});
// 		const company = !user
// 			? await prisma.company_Profile.findUnique({
// 					where: { id: sessions[0].profileId },
// 					include: { logindevices: true },
// 				})
// 			: null;
// 		if (!user && !company) {
// 			return res.status(401).json({ message: "Invalid credentials." });
// 		}
// 		const account = user || company;
// 		const linkedDevices = account.logindevices;

// 		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
// 		const userAgent = req.get("User-Agent");
// 		const parser = new UAParser(userAgent);
// 		const { os, browser } = parser.getResult();

// 		let sessionValid = false;
// 		for (const session of sessions) {
// 			if (Date.now() > session.expire) {
// 				await prisma.refreshTokenValid.delete({ where: { SID: session.sid } });
// 				continue;
// 			}
// 			for (const device of linkedDevices) {
// 				if (
// 					device.ip === ip &&
// 					device.os === os.name &&
// 					device.browser === browser.name
// 				) {
// 					sessionValid = true;
// 					break;
// 				}
// 			}
// 		}
// 		if (!sessionValid) {
// 			return next();
// 		}
// 		res.sidVerified = true;
// 		return next();
// 	} catch (error) {
// 		res.status(500).json({ message: "Server Error" });
// 	}
// };

export const verifyBasicAccessToken = async (req, res, next) => {
	try {
		const bsid = req.cookies["BSID"];
		if (!bsid) {
			return next();
		} else {
			const decoded = jwt.verify(bsid, process.env.JWT_SECRET);
			req.decodedUser = decoded;
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
			req.decodedUser = decoded;
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
		let account;

		const user = await prisma.user.findUnique({
			where: { id: profileId },
			include: { logindevices: true },
		});

		if (user) {
			account = { ...user, role: "User" };
		} else {
			const company = await prisma.company_Profile.findUnique({
				where: { id: profileId },
				include: { logindevices: true },
			});
			if (company) {
				account = { ...company, role: "Company" };
			} else {
				req.refreshTokenValid = false;
				return next();
			}
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

		let account;

		const user = await prisma.user.findFirst({
			where: {
				OR: [{ email }, { username: email }],
			},
			include: { logindevices: true },
		});

		if (user) {
			account = { ...user, role: "User" };
		} else {
			const company = await prisma.company_Profile.findFirst({
				where: {
					OR: [{ email }, { username: email }],
				},
				include: { logindevices: true },
			});
			if (company) {
				account = { ...company, role: "Company" };
			} else {
				return res.status(401).json({ message: "Invalid credentials." });
			}
		}

		const isValidPassword = await comparePasswords(password, account.password);
		if (!isValidPassword) {
			return res.status(403).json({ message: "Invalid email or password." });
		}

		if (!account.verified) {
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

		req.decodedUser = decoded;

		return next();
	} catch (error) {
		return next();
	}
};
