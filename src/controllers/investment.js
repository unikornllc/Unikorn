import prisma from "../db.js";

export const createInvestment = async (req, res) => {
	try {
		const investment = await prisma.investment.create({
			data: {
				companyName: req.body.companyName,
				amount: req.body.amount,
				equityPercentage: req.body.equityPercentage,
				date: new Date(req.body.date),
				account: {
					connect: { id: req.account.id },
				},
			},
		});
		res.status(200).json({ investment });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to create");
	}
};
export const updateInvestment = async (req, res) => {
	try {
		const investment = await prisma.investment.findUnique({
			where: { id: req.body.investmentId, accountId: req.account.id },
			include: { fundraiser: true },
		});
		if (!investment) {
			return res.status(400).send("Investment not found");
		}
		if (investment.fundraiser) {
			return res.status(400).send("Investment cannot be edited");
		}

		const updatedInvestment = await prisma.investment.update({
			where: { id: req.body.investmentId, accountId: req.account.id },
			data: {
				companyName: req.body.companyName,
				amount: req.body.amount,
				equityPercentage: req.body.equityPercentage,
				date: new Date(req.body.date),
			},
		});
		res.status(200).json({ investment: updatedInvestment });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to update");
	}
};

export const getOneInvestment = async (req, res) => {
	try {
		const investment = await prisma.investment.findMany({
			where: {
				id: req.query.investmentId,
			},
		});
		if (!investment) {
			return res.status(400).send("Investment not found");
		}
		res.status(200).json({ investment });
	} catch (e) {
		res.status(400).send("Failed to retrieve");
	}
};

export const deleteOneInvestment = async (req, res) => {
	try {
		const investment = await prisma.investment.findUnique({
			where: { id: req.query.investmentId, accountId: req.account.id },
			include: { fundraiser: true },
		});
		if (!investment) {
			return res.status(400).send("Investment not found");
		}
		if (investment.fundraiser) {
			return res.status(400).send("investment cannot be deleted");
		}

		await prisma.investment.delete({
			where: {
				id: req.query.investmentId,
				accountId: req.account.id,
			},
		});

		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};

export const getInvestments = async (req, res) => {
	try {
		const investments = await prisma.investment.findMany({
			where: {
				account: {
					username: req.query.username,
				},
			},
			select: {
				id: true,
				equityPercentage: true,
				amount: true,
				date: true,
				companyName: true,
				fundraiser: {
					raisingFunds: {
						select: {
							company: {
								select: {
									name: true,
									account: {
										select: {
											username: true,
										},
									},
								},
							},
						},
					},
				},
			},
		});
		res.status(200).json({ investments });
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to retrieve");
	}
};
