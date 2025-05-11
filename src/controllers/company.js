import prisma from "../db.js";

const sanitizeData = (model, data) => {
	switch (model) {
		case "activities":
			return {
				title: data.title,
				description: data.description,
			};

		case "productInformation":
			return {
				product: data.product,
				market: data.market,
				partnerships: data.partnerships,
			};
		case "personnel":
			return {
				name: data.name,
				role: data.role,
				crunchBaseLink: data.crunchBaseLink,
				user: data.userId ? { connect: { id: data.userId } } : undefined,
			};
		default:
			throw new Error("Invalid model type");
	}
};

export const deleteCompanyProduct = async (req, res) => {
	try {
		const { id } = req.body;
		const deletedProduct = await prisma.productInformation.delete({
			where: {
				id,
			},
		});
		if (!deletedProduct) {
			return res.status(401).json({
				message: "Not authorized to delete this product or product not found.",
			});
		}
		res.status(200).json({
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting company product:", error);
		res.status(400).json({ message: "Error deleting company product." });
	}
};
export const updateCompanyItem = async (req, res) => {
	try {
		const { model, id, data } = req.body;

		if (!model || !id || !data) {
			return res.status(400).json({
				message: "Model type, item ID and update data are required.",
			});
		}
		const existingItem = await prisma[
			model.charAt(0).toUpperCase() + model.slice(1)
		].findUnique({
			where: { id },
			select: { companyId: true },
		});

		if (existingItem && existingItem.companyId !== req.account.id) {
			return res.status(401).json({
				message: "Not authorized to update this item.",
			});
		}
		const updatedItem = await prisma[
			model.charAt(0).toUpperCase() + model.slice(1)
		].upsert({
			where: { id },
			create: {
				...sanitizeData(model, data),
				company: { connect: { id: req.account.id } },
			},
			update: {
				...sanitizeData(model, data),
			},
		});
		// console.log(updatedItem)
		if (!updatedItem) {
			return res.status(401).json({
				message: "Not authorized to update this item or item not found.",
			});
		}

		res.status(200).json({
			[model]: updatedItem,
		});
	} catch (error) {
		console.error(`Error updating ${req.body.model}:`, error);
		res.status(400).json({ message: `Error updating ${req.body.model}.` });
	}
};

export const updatePersonnel = async (req, res) => {
	try {
		const person = req.body.formData;
		let userId = null;

		if (person.username && person.username !== "") {
			const account = await prisma.account.findUnique({
				where: { id: person.user.id },
				include: { user: true },
			});

			if (account && account.user) {
				userId = account.user.id;
			}
		}
		const upsertedPersonnel = await prisma.personnel.upsert({
			where: { id: person.id || "" },
			create: {
				name: person.name,
				role: person.role,
				crunchBaseLink: person.crunchBaseLink,
				user: userId ? { connect: { id: userId } } : undefined,
				company: { connect: { id: req.account.id } },
			},
			update: {
				name: person.name,
				role: person.role,
				crunchBaseLink: person.crunchBaseLink,
				user: userId ? { connect: { id: userId } } : undefined,
			},
		});

		res.status(200).json({ personnel: upsertedPersonnel });
	} catch (error) {
		console.error("Error updating personnel:", error);
		res.status(400).json({ message: "Error updating personnel" });
	}
};

export const deletePersonnel = async (req, res) => {
	try {
		const deleted = await prisma.personnel.delete({
			where: {
				companyId: req.account.id,
				id: req.body.personnelId,
			},
		});
		console.log(deleted);
		if (deleted.count === 0) {
			return res.status(401).json({
				message:
					"Personnel not found or you don't have permission to delete it.",
			});
		}
		console.log("deleted personnel", deleted);
		res.status(200).json({ message: "Personnel deleted successfully" });
	} catch (e) {
		console.error("Error deleting personnel:", e);
		res.status(400).json({ message: "Error deleting personnel" });
	}
};
export const updateCompanyOverview = async (req, res) => {
	try {
		const { ...updateData } = req.body;

		const updatedCompany = await prisma.company.update({
			where: {
				id: req.account.id,
			},
			data: updateData,
		});
		res.status(200).json({
			user: (({ id, ...safe }) => safe)(updatedCompany),
		});
	} catch (error) {
		console.error("Error updating company:", error);
		res.status(400).json({ message: "Error updating company." });
	}
};

export const getCompanyOverview = async (req, res) => {
	try {
		const company = await prisma.company.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				founded: true,
				name: true,
				website: true,
				description: true,
				type: true,
				industry: true,
				hqLocation: true,
				activities: true,
				companySize: true,
				//add range of employees here
			},
		});
		if (!company) {
			return res.status(400).json({ message: "Company not found." });
		} else {
			res.status(200).json({ company: company });
		}
	} catch (error) {
		console.error("Error fetching company overview:", error);
		res.status(400).json({ message: "Error fetching company overview." });
	}
};

export const getCompanyPersonnel = async (req, res) => {
	try {
		const personnel = await prisma.account.findUnique({
			where: {
				username: req.query.username,
			},
			select: {
				company: {
					select: {
						personnel: {
							select: {
								id: true,
								name: true,
								role: true,
								crunchBaseLink: true,
								user: true,
								userId: true,
							},
						},
					},
				},
			},
		});
		if (!personnel) {
			return res.status(400).json({ message: "Personnel not found." });
		}
		return res.status(200).json({ personnel: personnel.company.personnel });
	} catch (error) {
		console.error("Error fetching company personnel:", error);
		res.status(400).json({ message: "Error fetching company personnel." });
	}
};

export const addCompanyActivity = async (req, res) => {
	try {
		const { title, description, companyId } = req.body;
		const activity = await prisma.activity.create({
			data: {
				title,
				description,
				companyId,
			},
		});
		res.status(200).json({ message: "Activity added successfully" });
	} catch (error) {
		console.error("Error adding activity:", error);
		res.status(400).json({ message: "Error adding activity." });
	}
};

export const getProductInfo = async (req, res) => {
	try {
		const productInfo = await prisma.company.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				productInformation: true,
			},
		});
		if (!productInfo) {
			return res.status(400).json({ message: "Product info not found." });
		} else {
			res.status(200).json({ productInfo: productInfo });
		}
	} catch (error) {
		console.error("Error fetching product info:", error);
		res.status(400).json({ message: "Error fetching product info." });
	}
};

// export const updateProductInfo = async (req, res) => {
// 	try {
// 		const { id, product, market, partnerships, companyId } = req.body;
// 		const productInfo = await prisma.productInformation.upsert({
// 			where: { id },
// 			create: {
// 				product,
// 				market,
// 				partnerships,
// 				company: { connect: { id: companyId } },
// 			},
// 			update: {
// 				product,
// 				market,
// 				partnerships,
// 			},
// 		});
// 		if (!productInfo) {
// 			return res.status(401).json({
// 				message: "Not authorized to update this item or item not found.",
// 			});
// 		}
// 		res.status(200).json({
// 			message: "Product information updated successfully",
// 		});
// 	} catch (error) {
// 		console.error("Error updating product info:", error);
// 		res.status(400).json({ message: "Error updating product info." });
// 	}
// };

// export const addProductInfo = async (req, res) => {
//     try {
//         const { product, market, partnerships, companyId } = req.body;
//         const productInfo = await prisma.productInformation.create({
//             data: {
//                 product,
//                 market,
//                 partnerships,
//                 company: { connect: { id: companyId } },
//             },
//         });
//         res.status(200).json({ message: "Product information added successfully" });
//     } catch (error) {
//         console.error("Error adding product info:", error);
//         res.status(400).json({ message: "Error adding product info." });
//     }
// };
// //export const updateFinancialInfo = async (req, res) => {}
