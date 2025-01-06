import prisma from "../db.js";
import { hashPassword } from "./auth.js";

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

const isPlainObject = (obj) => {
	if (Object.getPrototypeOf(obj) === null) {
		return true;
	}
	return Object.getPrototypeOf(obj) === Object.prototype;
};

const removeCompanyIds = (obj) => {
	if (Array.isArray(obj)) {
		return obj.map(removeCompanyIds);
	} else if (obj !== null && typeof obj === "object") {
		if (!isPlainObject(obj)) {
			return obj;
		}
		const newObj = {};
		for (const key in obj) {
			if (key !== "userId") {
				newObj[key] = removeCompanyIds(obj[key]);
			}
		}
		return newObj;
	} else {
		return obj;
	}
};

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

		const cleanedCompany = removeCompanyIds(safeCompany);

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

		const updateData = {};
		updateData[fieldName] = fieldValue;

		const updatedCompany = await prisma.company_Profile.update({
			where: { id },
			data: updateData,
		});

		// Optionally, fetch the updated company data with associations if needed
		// const updatedCompany = await Company.findOne({
		// 	where: { id: company.id },
		// 	// Include any associations if necessary
		// include: [{ model: Founder }, { model: BoardMember }, ...],
		//});

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
