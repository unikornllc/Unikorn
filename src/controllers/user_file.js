import fileStorage from "../fileStorage.js";
import prisma from "../db.js";

export const uploadUserFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "No file uploaded" });
		}

		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const savedPath = await fileStorage.saveFile(
			"user",
			req.body.userId,
			req.body.fileName,
			req.file,
		);
		let [type, subtype] = req.file.mimetype.split("/");
		if (subtype == "plain") {
			subtype = "txt";
		}
		console.log(type + "   " + subtype);
		const file = await prisma.user_File.create({
			data: {
				fileName: req.body.fileName,
				filePath: savedPath,
				fileType: subtype,
				user: { connect: { id: req.body.userId } },
			},
		});

		res.status(200).json({ file });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to upload file" });
	}
};

export const getUserFile = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
		});

		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const file = await prisma.user_File.findUnique({
			where: {
				fileName_userId: {
					userId: req.query.userId,
					fileName: req.query.fileName,
				},
			},
		});

		if (!file) {
			return res.status(200).json({ message: "File not found" });
		}
		const fileContent = await fileStorage.getFile(file.filePath);
		res
			.status(200)
			.json({ ...file, fileContent: fileContent.toString("base64") });
	} catch (error) {
		console.error(error);
		return res.status(400).json({ message: "Error getting file" });
	}
};

export const getAllUserFile = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.query.userId,
			},
			include: {
				user_file: true,
			},
		});
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.status(200).json({ file: user.user_file });
	} catch (error) {
		res.status(400).json({ message: "Error getting user files" });
	}
};

export const deleteUserFile = async (req, res) => {
	try {
		const deleted = await prisma.user_File.delete({
			where: {
				fileName_userId: {
					userId: req.query.userId,
					fileName: req.query.fileName,
				},
			},
		});
		if (!deleted) {
			return res.status(400).json({ message: "File not found" });
		}
		await fileStorage.deleteFile(deleted.filePath);
		res.status(200).json({ message: "File deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Failed to delete file" });
	}
};
