import prisma from "../db.js";

export const createKeyEmployee = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: { id: req.body.companyId },
		});

		const newKeyEmployee = await prisma.key_Employees.create({
			data: {
				name: req.body.name,
				role: req.body.role,
				company: {
					connect: { id: req.body.companyId },
				},
			},
		});

		res.status(200).json({
			message: "Key employee created successfully",
			keyEmployee: newKeyEmployee,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error creating key employee" });
	}
};

export const getAllKeyEmployee = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: { id: req.body.companyId },
		});
		const keyEmployees = await prisma.key_Employees.findMany({
			where: {
				companyId: req.body.companyId,
			},
		});
		res.status(200).json({ data: keyEmployees });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const getOneKeyEmployee = async (req, res) => {
	try {
		const keyEmployee = await prisma.key_Employees.findUnique({
			where: {
				id: req.body.keyEmployeeId,
			},
		});

		if (!keyEmployee) {
			return res.status(404).json({ message: "Key employee not found" });
		}
		res.status(200).json(keyEmployee);
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error fetching key employee" });
	}
};

export const deleteKeyEmployee = async (req, res) => {
	try {
		const deletedKeyEmployee = await prisma.key_Employees.delete({
			where: {
				id: req.body.keyEmployeeId,
			},
		});

		res.status(200).json({
			message: "Key employee deleted successfully",
			keyEmployee: deletedKeyEmployee,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error deleting key employee" });
	}

};
