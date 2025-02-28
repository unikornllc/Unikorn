import prisma from "../db.js";
import { UAParser } from "ua-parser-js";

export const logout = async (req, res) => {
	try {
		const sid = req.cookies["SID"];
		const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const userAgent = req.get("User-Agent") || "";
		const parser = new UAParser(userAgent);
		const { os, browser } = parser.getResult();

		const profile = await prisma.refreshTokenValid.findFirst({
			where: { sid },
		});
		
		await prisma.refreshTokenValid.deleteMany({
			where: {
				profileId: profile.profileId,
				ip,
				browser: browser.name,
				os: os.name,
			},
		});

		res.clearCookie("SID");
		res.clearCookie("BSID");
		res.clearCookie("connect.sid");
		
		res.status(200).json({ message: "Logout Successful" });
	} catch (error) {
		res.status(500).json({ message: "Server Error" });
	}
};
