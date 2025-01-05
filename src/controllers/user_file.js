import fileStorage from "../fileStorage.js";
import prisma from "../db.js";

export const uploadUserFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const user = await prisma.user.findUnique({
			where: { username: req.body.username },
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		if (user.id != req.decodedUser.id) {
			return res
				.status(401)
				.json({ message: "Unauthorized to edit user data." });
		}

		const savedPath = await fileStorage.saveFile(
			"user",
			user.id,
			req.body.fileName,
			req.file,
		);

		// let [type, subtype] = req.file.mimetype.split("/");
		// if (subtype == "plain") {
		// 	subtype = "txt";
		// }

		const file = await prisma.user_File.create({
			data: {
				fileName: req.body.fileName,
				filePath: savedPath,
				fileType: req.file.mimetype,
				user: { connect: { id: user.id } },
			},
		});

		res.status(200).json({
			file: (({ userId, ...safe }) => safe)(file),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to upload file" });
	}
};

export const getUserFile = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const file = await prisma.user_File.findUnique({
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
		const fileData = (({ userId, ...safe }) => safe)(file);
		console.log(fileData);
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
		const user = await prisma.user.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				user_file: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({
			file: user.user_file.map(({ userId, ...rest }) => rest),
		});
	} catch (error) {
		res.status(400).json({ message: "Error getting user files" });
	}
};

export const deleteUserFile = async (req, res) => {
	try {
		const deleted = await prisma.user_File.delete({
			where: {
				fileName_userId: {
					userId: req.decodedUser.id,
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
			deleted: (({ userId, ...safe }) => safe)(deleted),
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to delete file" });
	}
};
