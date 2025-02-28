import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = (password, hash) => {
	return bcrypt.compare(password, hash);
};

export const hashPassword = (password) => {
	return bcrypt.hash(password, 10);
};

export const createJWT = (user) => {
	const token = jwt.sign(
		{
			id: user.id,
			role: user.role,
		},
		process.env.JWT_SECRET,
	);
	return token;
};

export const protect = (req, res, next) => {
	try {
		const token = req.cookies["token"];
		if (!token) {
			res.status(401);
			res.json({ message: "not valid token" });
			return;
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.account = decoded;
		next();
	} catch (e) {
		console.error(e);
		res.status(401);
		res.json({ message: "not valid token" });
		return;
	}
};
