import prisma from "../db.js";

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
		const company = await prisma.company.findUnique({
			where: {
				username: req.query.username,
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
			...(include
				? {
						include: Object.fromEntries(
							Object.entries(include).map(([key, value]) => [
								key,
								value === "true",
							]),
						),
					}
				: {}),
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

		const company = await prisma.company.findUnique({
			where: {
				account: {
					username,
				},
			},
			...(include
				? {
						include: Object.fromEntries(
							Object.entries(include).map(([key, value]) => [
								key,
								value === "true",
							]),
						),
					}
				: {}),
		});

		if (!company) {
			return res.status(400).json({ message: "Company not found" });
		}
		const isCurrentCompany = company.id === req.account.id;

		const safeCompany = (({ id, ...rest }) => rest)(
			company,
		);

		const cleanedCompany = removeKeys(company, [
			"companyId",
		]);

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
			"board_members",
			"advisors",
			"activities",
			"founders",
			"key_employees",
			"product_information",
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

		if (fieldName === "founders") {
			updateData = {
				founders: {
					upsert: fieldValue.map((founder) => ({
						where: { id: founder.id || "" },
						create: {
							name: founder.name,
							role: founder.role,
							crunchBaseLink: founder.crunch_base_link,
						},
						update: {
							name: founder.name,
							role: founder.role,
							crunchBaseLink: founder.crunch_base_link,
						},
					})),
				},
			};
		} else if (fieldName === "activities") {
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
		} else if (fieldName === "key_employees") {
			updateData = {
				keyEmployees: {
					upsert: fieldValue.map((key_employee) => ({
						where: { id: key_employee.id || "" },
						create: {
							name: key_employee.name,
							role: key_employee.role,
						},
						update: {
							name: key_employee.name,
							role: key_employee.role,
						},
					})),
				},
			};
		} else if (fieldName === "product_information") {
			updateData = {
				productInformation: {
					upsert: fieldValue.map((product_information) => ({
						where: { id: product_information.id || "" },
						create: {
							product: product_information.product,
							market: product_information.market,
							partnerships: product_information.partnerships,
						},
						update: {
							product: product_information.product,
							market: product_information.market,
							partnerships: product_information.partnerships,
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

export const getCompanyTier = async (req, res) => {
	try {
		if (req.account.role == "User") {
			const user = await prisma.user.findUnique({
				where: {
					id: req.account.id,
				},
				select: {
					tier: true,
				},
			});
			res.status(200).json({ tier: user.tier });
		} else {
			const company = await prisma.company.findUnique({
				where: {
					id: req.account.id,
				},
				select: {
					tier: true,
				},
			});
			res.status(200).json({ tier: company.tier });
		}
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching company tier" });
	}
};
