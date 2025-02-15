import prisma from "../db.js";
import { hashPassword } from "../auth.js";

export const createCompany = async (req, res) => {
	try {
		const companyData = req.body.formData;
		console.log(companyData);
		const hashedPassword = await hashPassword(companyData.password);
		const newCompany = await prisma.company_Profile.create({
			data: {
				name: companyData.name,
				username: companyData.username,
				email: companyData.email,
				password: hashedPassword,
				description: companyData.description,
				website: companyData.website,
				founded: new Date(companyData.founded),
				type: companyData.type || "Public",
				hqlocation: companyData.hqlocation,
				industry: companyData.industry,
				hunter: companyData.hunter || false,
				board_members: companyData.board_members || [],
				advisors: companyData.advisors || [],
				founders: companyData.founders || [],
				wallet: {
					create: {
						amount: 0.0,
						onHold: 0.0,
					},
				},
			},
		});
		res.status(200).json({
			message: "Company created successfully",
			company: newCompany,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error creating company" });
	}
};

export const getAllCompanies = async (req, res) => {
	try {
		const companies = await prisma.company_Profile.findMany();
		res.status(200).json(companies);
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error fetching companies" });
	}
};

export const deleteAllCompanies = async (req, res) => {
	try {
		await prisma.company_Profile.deleteMany();
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
		await prisma.key_Employees.deleteMany({
			where: { companyId: req.body.companyId },
		});
		const deletedCompany = await prisma.company_Profile.delete({
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
		const company = await prisma.company_Profile.findUnique({
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
		const company = await prisma.company_Profile.findUnique({
			where: {
				id: req.decodedUser.id,
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
const isPlainObject = (obj) => {
	if (Object.getPrototypeOf(obj) === null) {
		return true;
	}
	return Object.getPrototypeOf(obj) === Object.prototype;
};

function removeKeys(data, keysToRemove = ["id"]) {
	if (Array.isArray(data)) {
		return data.map((item) => removeKeys(item, keysToRemove));
	} else if (data !== null && typeof data === "object") {
		// Check if the object is a Date instance and return it directly
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

		const company = await prisma.company_Profile.findUnique({
			where: {
				username,
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
		const isCurrentCompany = company.id === req.decodedUser.id;

		const safeCompany = (({ verified, id, password, ...rest }) => rest)(
			company,
		);

		if (!isCurrentCompany) {
			delete safeCompany.email;
		}

		const cleanedCompany = removeKeys(safeCompany, [
			"id",
			"password",
			"verified",
			"companyId",
			"emailVerify,",
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
		const id = req.decodedUser.id;
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

		const company = await prisma.company_Profile.findUnique({
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
							crunch_base_link: founder.crunch_base_link,
						},
						update: {
							name: founder.name,
							role: founder.role,
							crunch_base_link: founder.crunch_base_link,
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
				key_employees: {
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
				product_information: {
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

		const updatedCompany = await prisma.company_Profile.update({
			where: { id },
			data: updateData,
		});

		res.json({ company: updatedCompany });
	} catch (error) {
		console.error("Error updating company profile:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const isFollowingCompany = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: {
				username: req.query.username,
			},
			select: {
				id: true,
			},
		});
		const isFollowing = await prisma.userFollowsCompany.findFirst({
			where: {
				companyId: company.id,
				userId: req.decodedUser.id,
			},
		});

		isFollowing
			? res.status(200).json({ isFollowing: true })
			: res.status(200).json({ isFollowing: false });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching Profile" });
	}
};

export const followCompany = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: {
				username: req.body.username,
			},
			select: {
				id: true,
			},
		});
		await prisma.userFollowsCompany.create({
			data: {
				companyId: company.id,
				userId: req.decodedUser.id,
			},
		});
		res.status(200).json({ message: "Company followed successfully" });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error following company" });
	}
};

export const unfollowCompany = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: {
				username: req.body.username,
			},
			select: {
				id: true,
			},
		});
		await prisma.userFollowsCompany.deleteMany({
			where: {
				companyId: company.id,
				userId: req.decodedUser.id,
			},
		});
		res.status(200).json({ message: "Company unfollowed successfully" });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error unfollowing company" });
	}
};

export const getFollowingCompanies = async (req, res) => {
	try {
		const followingCompanies = await prisma.userFollowsCompany.findMany({
			where: {
				userId: req.decodedUser.id,
			},
			select: {
				company: true,
			},
		});
		res.status(200).json(followingCompanies.map((c) => c.company.username));
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching following companies" });
	}
};

export const getCompanyTier = async (req, res) => {
	try {
		if (req.decodedUser.role == "User") {
			const user = await prisma.user.findUnique({
				where: {
					id: req.decodedUser.id,
				},
				select: {
					tier: true,
				},
			});
			res.status(200).json({ tier: user.tier });
		} else {
			const company = await prisma.company_Profile.findUnique({
				where: {
					id: req.decodedUser.id,
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
