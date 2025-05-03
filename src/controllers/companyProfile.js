import prisma from "../db.js";

export const updateCompanyProfile = async (req, res) => {
	try {
		const id = req.account.id;
		const { fieldName, fieldValue } = req.body;

		if (!id) {
			return res
				.status(400)
				.json({ message: "Username is required to update the profile." });
		}

		const allowedFields = [
			"name",
			"email",
			"username",
			"description",
			"website",
			"founded",
			"hqlocation",
			"hunter",
			"industry",
			"type",
			// "boardMembers",
			// "advisors",
			"activities",
			// "founders",
			// "keyEmployees",
			// "personnel",
			"productInformation",
			"financials",
		];

		if (!allowedFields.includes(fieldName)) {
			return res.status(400).json({ error: "Invalid field name" });
		}

		const company = await prisma.company.findUnique({
			where: { id },
		});
		if (!company) {
			return res.status(404).json({ error: "Company not found" });
		}

		let updateData = {};

		if (fieldName === "activities") {
			updateData = {
				activities: {
					upsert: fieldValue.map((activity) => ({
						where: { id: activity.id || "" },
						create: {
							title: activity.title,
							description: activity.description,
						},
						update: {
							title: activity.title,
							description: activity.description,
						},
					})),
				},
			};
			// } else if (fieldName === "keyEmployees") {
			// 	updateData = {
			// 		keyEmployees: {
			// 			upsert: fieldValue.map((key_employee) => ({
			// 				where: { id: key_employee.id || "" },
			// 				create: {
			// 					name: key_employee.name,
			// 					role: key_employee.role,
			// 				},
			// 				update: {
			// 					name: key_employee.name,
			// 					role: key_employee.role,
			// 				},
			// 			})),
			// 		},
			// 	};
		} else if (fieldName === "productInformation") {
			updateData = {
				productInformation: {
					upsert: fieldValue.map((productInformation) => ({
						where: { id: productInformation.id || "" },
						create: {
							product: productInformation.product,
							market: productInformation.market,
							partnerships: productInformation.partnerships,
						},
						update: {
							product: productInformation.product,
							market: productInformation.market,
							partnerships: productInformation.partnerships,
						},
					})),
				},
			};
		} else {
			updateData[fieldName] = fieldValue;
		}

		const updatedCompany = await prisma.company.update({
			where: { id },
			data: updateData,
		});

		res.json({ company: updatedCompany });
	} catch (error) {
		console.error("Error updating company profile:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getAllCompanies = async (req, res) => {
	try {
		const companies = await prisma.company.findMany();
		res.status(200).json(companies);
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error fetching companies" });
	}
};

export const deleteAllCompanies = async (req, res) => {
	try {
		await prisma.company.deleteMany();
		res.status(200).json({ message: "All companies deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error deleting companies" });
	}
};

export const deleteCompany = async (req, res) => {
	try {
		await prisma.founder.deleteMany({
			where: { companyId: req.body.companyId },
		});
		await prisma.keyEmployees.deleteMany({
			where: { companyId: req.body.companyId },
		});
		const deletedCompany = await prisma.company.delete({
			where: { id: req.body.companyId },
		});
		res.status(200).json({
			message: "Company deleted successfully",
			company: deletedCompany,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error deleting company" });
	}
};

export const isCurrentCompany = async (req, res) => {
	try {
		let isCurrentCompany = false;
		const company = await prisma.company.findFirst({
			where: {
				account: {
					username: req.query.username,
				},
			},
		});
		if (req.cookies.userId && company.id && req.cookies.userId == company.id) {
			isCurrentCompany = true;
		}
		res.status(200).json({ company, isCurrentCompany });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error fetching company" });
	}
};

export const getCurrentCompany = async (req, res) => {
	try {
		const { include } = req.query;
		const company = await prisma.company.findUnique({
			where: {
				id: req.account.id,
			},
			include: {
				account: {
					select: { username: true },
				},
				...(include
					? {
							...Object.fromEntries(
								Object.entries(include).map(([key, value]) => [
									key,
									value === "true",
								]),
							),
						}
					: {}),
			},
		});
		const safe = (({ verified, id, password, ...rest }) => rest)(company);
		res.status(200).json({ company: safe });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching user" });
	}
};

function removeKeys(data, keysToRemove = ["id"]) {
	if (Array.isArray(data)) {
		return data.map((item) => removeKeys(item, keysToRemove));
	} else if (data !== null && typeof data === "object") {
		if (data instanceof Date) {
			return data;
		}

		const result = {};
		for (const key in data) {
			if (
				!keysToRemove.includes(key) &&
				Object.prototype.hasOwnProperty.call(data, key)
			) {
				result[key] = removeKeys(data[key], keysToRemove);
			}
		}
		return result;
	} else {
		return data;
	}
}

export const getOneCompanyProfile = async (req, res) => {
	try {
		const { username, include } = req.query;

		if (!username) {
			return res
				.status(400)
				.json({ message: "Provide a correct a username to login." });
		}

		const company = await prisma.company.findFirst({
			where: {
				account: {
					username,
				},
			},
			include: {
				account: {
					select: { username: true },
				},
				...(include
					? {
							...Object.fromEntries(
								Object.entries(include).map(([key, value]) => [
									key,
									value === "true",
								]),
							),
						}
					: {}),
			},
		});

		if (!company) {
			return res.status(400).json({ message: "Company not found" });
		}
		const isCurrentCompany = company.id === req.account.id;

		const safeCompany = (({ id, ...rest }) => rest)(company);

		const cleanedCompany = removeKeys(company, ["companyId"]);

		//console.log(cleanedCompany);

		res.status(200).json({
			isCurrentCompany,
			company: cleanedCompany,
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching Profile" });
	}
};
