import fileStorage from "../fileStorage.js";
import prisma from "../db.js";
import path from "path";

export const uploadProfilePicture = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No profile picture uploaded" });
		}
		let fileName = req.body.fileName;

		let [type, subtype] = req.file.mimetype.split("/");

		if (subtype != "jpg" && subtype != "png" && subtype != "jpeg") {
			return res.status(400).json({ message: "Incorrect image Format" });
		}

		const savedPath = await fileStorage.saveFile(
			req.account.role.toLowerCase(),
			path.join(req.account.id, "profile"),
			fileName,
			req.file,
		);
		const file = await prisma.file.upsert({
			where: {
				fileName_accountId: {
					fileName,
					accountId: req.account.id,
				},
			},
			create: {
				fileName,
				filePath: savedPath,
				fileType: req.file.mimetype,
				account: { connect: { id: req.account.id } },
			},
			update: {
				filePath: savedPath,
				fileType: req.file.mimetype,
			},
		});

		res.status(200).json({
			file: (({ accountId, filePath, ...safe }) => safe)(file),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to upload profile picture" });
	}
};

export const uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}
		if (
			req.body.fileName == "cover_picture" ||
			req.body.fileName == "profile_picture"
		) {
			return res.status(400).json({ message: "Invalid file name" });
		}
		const savedPath = await fileStorage.saveFile(
			req.account.role.toLowerCase(),
			req.account.id,
			req.body.fileName,
			req.file,
		);

		// let [type, subtype] = req.file.mimetype.split("/");
		// if (subtype == "plain") {
		// 	subtype = "txt";
		// }

		// const file = await prisma.user_File.create({
		// 	data: {
		// 		fileName: req.body.fileName,
		// 		filePath: savedPath,
		// 		fileType: req.file.mimetype,
		// 		user: { connect: { id: req.account.id } },
		// 	},
		// });

		const file = await prisma.file.upsert({
			where: {
				fileName_accountId: {
					fileName: req.body.fileName,
					accountId: req.account.id,
				},
			},
			create: {
				fileName: req.body.fileName,
				filePath: savedPath,
				fileType: req.file.mimetype,
				account: {
					connect: { id: req.account.id },
				},
			},
			update: {
				filePath: savedPath,
				fileType: req.file.mimetype,
			},
		});

		res.status(200).json({
			file: (({ accountId, filePath, ...safe }) => safe)(file),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to upload file" });
	}
};

export const getFile = async (req, res) => {
	try {
		const account = await prisma.account.findUnique({
			where: { username: req.query.username },
			include: {
				file: {
					where: { fileName: req.query.fileName },
				},
			},
		});

		if (!account) {
			return res.status(400).json({ message: "Account not found" });
		}
		const file = account.file[0] ? account.file[0] : null;

		if (!file) {
			return res.status(200).json({ message: "File not found" });
		}
		const fileContent = await fileStorage.getFile(file.filePath);
		if (!fileContent) {
			return res.status(400).json({ message: "File content not found" });
		}
		const fileData = (({ accountId, filePath, ...safe }) => safe)(file);
		res.status(200).json({
			...fileData,
			fileContent: fileContent.toString("base64"),
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ message: "Error getting file" });
	}
};

export const getAllFiles = async (req, res) => {
	try {
		const account = await prisma.account.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				file: true,
			},
		});
		if (!account) {
			return res.status(400).json({ message: "Account not found" });
		}
		res.status(200).json({
			file: account.file.map(({ accountId, filePath, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting account files" });
	}
};

export const deleteFile = async (req, res) => {
	try {
		const deleted = await prisma.file.delete({
			where: {
				fileName_accountId: {
					accountId: req.account.id,
					fileName: req.query.fileName,
				},
			},
		});

		if (deleted.count === 0) {
			return res.status(401).json({
				message: "File not found or you don't have permission to delete it.",
			});
		}

		await fileStorage.deleteFile(deleted.filePath);

		res.status(200).json({
			deleted: (({ accountId, filePath, ...safe }) => safe)(deleted),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to delete file" });
	}
};
