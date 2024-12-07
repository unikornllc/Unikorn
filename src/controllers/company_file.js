import fileStorage from "../fileStorage.js";
import prisma from "../db.js";

export const uploadCompanyFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).send("No file uploaded");
		}

		const company = await prisma.company_Profile.findUnique({
			where: {
				id: req.body.companyId,
			},
		});

		if (!company) {
			return res.status(400).send("Company not found");
		}
		const savedPath = await fileStorage.saveFile(
			"company",
			req.body.companyId,
			req.body.fileName,
			req.file,
		);
		const [type, subtype] = file.mimetype.split("/");

		const file = await prisma.company_File.update({
			data: {
				fileName: req.body.fileName,
				filePath: savedPath,
				fileType: type,
				company: { connect: { id: req.body.companyId } },
			},
		});

		res.status(200).json({ data: file });
		// res.status(200).json({ data: fileRecord });
	} catch (error) {
		console.error(error);
		res.status(400).send("Failed to upload file");
	}
};

export const getCompanyFile = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: {
				id: req.body.companyId,
			},
		});

		if (!company) {
			return res.status(400).send("Company not found");
		}
		const file = await prisma.company_File.findUnique({
			where: {
				companyId: req.body.companyId,
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

export const deleteCompanyFile = async (req, res) => {
	try {
		const deleted = await prisma.company_File.delete({
			where: {
				companyId: req.body.companyId,
				fileName: req.body.fileName,
			},
		});
		if (!deleted) {
			return res.status(400).send("File not found");
		}
		await fileStorage.deleteFile(deleted.filePath);

		// await prisma.file.delete({
		// 	where: { id: parseInt(fileName) },
		// });

		res.status(200).send("File deleted successfully");
	} catch (error) {
		console.error(error);
		res.status(400).send("Failed to delete file");
	}
};
