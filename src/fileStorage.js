import fs from "fs";
import path from "path";

const UPLOADS_DIR = path.join(path.resolve(), "fileStorage");

if (!fs.existsSync(UPLOADS_DIR)) {
	fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const fileStorage = {
	saveFile: async (mainDirectory, subDirectory, fileName, file) => {
		const directory = path.join(
			UPLOADS_DIR,
			mainDirectory.toString(),
			subDirectory.toString(),
		);
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}

		let [type, subtype] = file.mimetype.split("/");

		if (subtype == "plain") {
			subtype = "txt";
		}

		const filePath = path.join(directory, fileName + "." + subtype);
		await fs.promises.writeFile(filePath, file.buffer);

		return filePath;
	},

	getFile: async (filePath) => {
		const fileContent = await fs.promises.readFile(filePath);
		return fileContent;
	},

	deleteFile: async (filePath) => {
		if (fs.existsSync(filePath)) {
			await fs.promises.unlink(filePath);
		}
	},
};

export default fileStorage;

// export const saveFile = async (fileBuffer, fileName, directoryName) => {
// 	const directory = path.join(UPLOADS_DIR, directoryName.toString());
// 	if (!fs.existsSync(directory)) {
// 		fs.mkdirSync(directory, { recursive: true });
// 	}

// 	const filePath = path.join(directory, fileName);
// 	await fs.promises.writeFile(filePath, fileBuffer);

// 	return filePath;
// };

// export const getFilePath = async (fileBuffer, fileName, directoryName) => {
// 	const filePath = path.join(UPLOADS_DIR, directoryName.toString(), fileName);
// 	if (!fs.existsSync(filePath)) {
// 		throw new Error("File not found");
// 	}
// 	return filePath;
// };

// export const deleteFile = async (fileBuffer, fileName, directoryName) => {
// 	const filePath = path.join(UPLOADS_DIR, directoryName.toString(), fileName);
// 	if (fs.existsSync(filePath)) {
// 		await fs.promises.unlink(filePath);
// 	}
// };
