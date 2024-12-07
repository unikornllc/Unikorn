import prisma from "../db.js";

export const getOneFounder = async (req, res) => {
	try {
		const founder = await prisma.founder.findUnique({
			where: {
				id: req.body.founderId,
			},
		});
		res.status(200).json({ data: founder });
	} catch (e) {
		res.status(400);
	}
};

export const getAllFounder = async (req, res) => {
	try {
		const founder = await prisma.founder.findMany({
			where: {
				companyId: req.body.companyId,
			},
		});
		res.json({ data: founder });
	} catch (e) {
		res.status(400);
	}
};
export const createFounder = async (req, res) => {
	try {
		const company = await prisma.company_Profile.findUnique({
			where: {
				id: req.body.companyId,
			},
		});
		if (!company) {
			return res.status(400).send("User not found");
		}
		const founder = await prisma.founder.create({
			data: {
				name: req.body.name,
				role: req.body.role,
				crunch_base_link: req.body.crunch_base_link,
				company: { connect: { id: req.body.companyId } },
			},
		});
		res.status(200).json({ data: founder });
	} catch (e) {
		res.status(400).send("Failed to create founder");
	}
};
export const deleteFounder = async (req, res) => {
	try {
		const deleted = await prisma.founder.delete({
			where: {
				id: req.body.founderId,
			},
		});
		res.status(200).send("Deleted corporate experience successfully");
	} catch (e) {
		res.status(400);
	}
};
