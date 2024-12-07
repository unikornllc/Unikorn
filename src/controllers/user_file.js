import fileStorage from "../fileStorage.js";
import prisma from "../db.js";

export const uploadUserFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send("No file uploaded");
		}

		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});

		if (!user) {
			return res.status(400).send("User not found");
		}
		const savedPath = await fileStorage.saveFile(
			"user",
			req.body.userId,
			req.body.fileName,
			req.file,
		);
		const [type, subtype] = file.mimetype.split("/");

		const file = await prisma.user_File.create({
			data: {
				fileName: req.body.fileName,
				filePath: savedPath,
				fileType: type,
				user: { connect: { id: req.body.userId } },
			},
		});

		res.status(200).json({ data: file });
		// res.status(200).json({ data: fileRecord });
	} catch (error) {
		console.error(error);
		res.status(400).send("Failed to upload file");
	}
};

export const getUserFile = async (req, res) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.body.userId,
			},
		});

		if (!user) {
			return res.status(400).send("User not found");
		}
		const file = await prisma.user_File.findUnique({
			where: {
				userId: req.body.userId,
				fileName: req.body.fileName,
			},
		});

		if (!file) {
			return res.status(400).send("File not found");
		}
		const fileContent = await fileStorage.getFile(file.filePath);
		console.log(fileType);
		res
			.status(200)
			.json({ data: { ...file, fileContent: fileContent.toString("base64") } });
	} catch (error) {
		console.error(error);

		return res.status(400).send(error.message);
	}
};

export const deleteUserFile = async (req, res) => {
	try {
		const deleted = await prisma.user_File.delete({
			where: {
				userId: req.body.userId,
				fileName: req.body.fileName,
			},
		});
		if (!deleted) {
			return res.status(400).send("File not found");
		}
		await fileStorage.deleteFile(deleted.filePath);
		res.status(200).send("File deleted successfully");
	} catch (error) {
		console.error(error);
		res.status(400).send("Failed to delete file");
	}
};
