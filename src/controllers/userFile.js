import fileStorage from "../fileStorage.js";
import prisma from "../db.js";

export const uploadUserFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const savedPath = await fileStorage.saveFile(
			"user",
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

		const file = await prisma.userFile.upsert({
			where: {
				fileName_userId: {
					fileName: req.body.fileName,
					userId: req.account.id,
				},
			},
			create: {
				fileName: req.body.fileName,
				filePath: savedPath,
				fileType: req.file.mimetype,
				user: {
					connect: { id: req.account.id },
				},
			},
			update: {
				filePath: savedPath,
				fileType: req.file.mimetype,
			},
		});

		res.status(200).json({
			file: (({ userId, filePath, ...safe }) => safe)(file),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to upload file" });
	}
};

export const getUserFile = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const file = await prisma.userFile.findUnique({
			where: {
				fileName_userId: {
					userId: user.id,
					fileName: req.query.fileName,
				},
			},
		});

		if (!file) {
			return res.status(200).json({ message: "File not found" });
		}
		const fileContent = await fileStorage.getFile(file.filePath);
		if (!fileContent) {
			return res.status(400).json({ message: "File content not found" });
		}
		const fileData = (({ userId, filePath, ...safe }) => safe)(file);
		res.status(200).json({
			...fileData,
			fileContent: fileContent.toString("base64"),
		});
	} catch (error) {
		console.error(error);
		return res.status(400).json({ message: "Error getting file" });
	}
};

export const getAllUserFile = async (req, res) => {
	try {
		const user = await prisma.user.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
			include: {
				userFile: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			file: user.userFile.map(({ userId, filePath, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting user files" });
	}
};

export const deleteUserFile = async (req, res) => {
	try {
		const deleted = await prisma.userFile.delete({
			where: {
				fileName_userId: {
					userId: req.account.id,
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
			deleted: (({ userId, filePath, ...safe }) => safe)(deleted),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to delete file" });
	}
};
