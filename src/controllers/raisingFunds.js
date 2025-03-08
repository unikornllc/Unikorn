import prisma from "../db.js";
import axios from "axios";

export const getAllRaisingFunds = async (req, res) => {
	try {
		const raisingFunds = await prisma.raisingFunds.findMany({
			include: {
				company: true,
				fundraisers: true,
				investmentOffers: true,
			},
		});
		res.status(200).json(raisingFunds);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getRaisingFundsById = async (req, res) => {
	try {
		const { raisingFundsId } = req.query;
		const raisingFunds = await prisma.raisingFunds.findUnique({
			where: { raisingFundsId },
			include: {
				company: true,
				fundraisers: true,
				investmentOffers: true,
			},
		});
		if (!raisingFunds) {
			return res.status(400).json({ error: "Funding Round not found" });
		}
		res.status(200).json(raisingFunds);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const getActiveRaisingFunds = async (req, res) => {
	try {
		const fundraisings = await prisma.raisingFunds.findMany({
			where: { status: "Active" },
			include: {
				company: true,
			},
		});
		if (!fundraisings) {
			return res.status(200).json({ message: "No active fundraising found" });
		}
		fundraisings.forEach((fundraising) => {
			const fundedPortions =
				fundraising.totalPortions - fundraising.remainingPortions;
			const fundedPercentage = (
				(fundedPortions / fundraising.totalPortions) *
				100
			).toFixed(1);
			const remainingEquity = (
				fundraising.remainingPortions *
				(fundraising.equityPercentage / fundraising.totalPortions)
			).toFixed(1);
			fundraising.remainingEquity = remainingEquity;
			fundraising.fundedPortions = fundedPortions;
			fundraising.fundedPercentage = fundedPercentage;
		});
		res.status(200).json({ fundraisings });
	} catch (e) {
		res.status(400).json({ message: "Failed to retrieve" });
	}
};

export const getCompanyActiveRaisingFund = async (req, res) => {
	try {
		let param;
		if (req.query.username) {
			param = {
				account: {
					username: req.query.username,
				},
			};
		} else {
			if (req.account.role != "Company") {
				return res.status(401).json({ message: "Unauthorized action" });
			}
			param = { id: req.account.id };
		}
		const fundraising = await prisma.raisingFunds.findFirst({
			where: { status: "Active", company: param },
			include: {
				company: true,
			},
		});
		if (!fundraising) {
			return res.status(200).json({ message: "No active fundraising found" });
		}
		const fundedPortions =
			fundraising.totalPortions - fundraising.remainingPortions;
		const fundedPercentage = (
			(fundedPortions / fundraising.totalPortions) *
			100
		).toFixed(1);
		const remainingEquity = (
			fundraising.remainingPortions *
			(fundraising.equityPercentage / fundraising.totalPortions)
		).toFixed(1);

		res.status(200).json({
			activeFundraising: {
				id: fundraising.id,
				companyUsername: req.query.username,
				companyName: fundraising.company.name,
				portionAmount: fundraising.fundingAmount / fundraising.totalPortions,
				portionEquity: fundraising.equityPercentage / fundraising.totalPortions,
				fundedPortions,
				fundedPercentage,
				remainingEquity,
				...fundraising,
			},
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Failed to retrieve" });
	}
};

export const getCompanyPendingRaisingFund = async (req, res) => {
	try {
		if (req.account.role != "Company") {
			return res.status(401).json({ message: "Unauthorized action" });
		}

		const fundraising = await prisma.raisingFunds.findFirst({
			where: { status: "Pending", company: { id: req.account.id } },
			include: {
				company: {
					select: { name: true, account: { select: { username: true } } },
				},
			},
		});

		if (!fundraising) {
			return res.status(200).json({ message: "No pending fundraising found" });
		}
		res.status(200).json({
			pendingFundraising: {
				companyUsername: fundraising.company.account.username,
				companyName: fundraising.company.name,
				...fundraising,
			},
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Failed to retrieve" });
	}
};

export const getCompanyPastRaisingFunds = async (req, res) => {
	try {
		if (req.account.role != "Company") {
			return res.status(401).json({ message: "Unauthorized action" });
		}

		const pastFundraisings = await prisma.raisingFunds.findMany({
			where: {
				status: {
					notIn: ["Pending", "Active"],
				},
				company: { id: req.account.id },
			},
			include: {
				company: true,
			},
		});

		if (!pastFundraisings || pastFundraisings.length == 0) {
			return res.status(200).json({ message: "No past fundraising found" });
		}
		res.status(200).json({ pastFundraisings });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Failed to retrieve" });
	}
};

export const getRaisingFundFundraisers = async (req, res) => {
	try {
		console.log();
		const { raisingFundsId } = req.query;
		if (!raisingFundsId) {
			return res.status(400).json({ message: "Missing required fields" });
		}
		if (req.account.role != "Company") {
			return res.status(401).json({ message: "Unauthorized action" });
		}
		const fundraisers = await prisma.fundraiser.findMany({
			where: {
				raisingFundsId,
				raisingFunds: {
					companyId: req.account.id,
				},
			},
			include: {
				investorUser: true,
				investorCompany: true,
			},
		});

		if (!fundraisers || fundraisers.length == 0) {
			return res.status(200).json({ message: "No fundraisers found" });
		}
		res.status(200).json({ fundraisers });
	} catch (error) {
		console.error("Error fetching fundraisers:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const cancelInvestment = async (req, res) => {
	const { fundraiserId } = req.body;

	const investorType = req.account.role;
	const investorId = req.account.id;

	try {
		const fundraiser = await prisma.fundraiser.findUnique({
			where: { id: fundraiserId },
			include: { raisingFunds: true },
		});

		if (!fundraiser) {
			return res.status(404).json({ message: "Investment offer not found" });
		}

		if (
			fundraiser.investorType != investorType ||
			(investorType == "User" && fundraiser.investorUserId != investorId) ||
			(investorType == "Company" && fundraiser.investorCompanyId != investorId)
		) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (fundraiser.raisingFunds.status != "Active") {
			return res.status(400).json({ message: "Cannot cancel this Investment" });
		}
		await prisma.$transaction(async (prisma) => {
			const fundraising = await prisma.raisingFunds.findUnique({
				where: { id: fundraiser.raisingFundsId },
			});
			if (fundraising.status != "Active") {
				return res
					.status(400)
					.json({ message: "Cannot cancel this Investment" });
			}
			const dataToUpdate = {
				fundingAmount:
					Math.abs(
						fundraising.pricePerPortion * fundraiser.portions -
						fundraiser.pricePerPortion * fundraiser.portions,
					) + fundraising.fundingAmount,
				remainingPortions: fundraising.remainingPortions + fundraiser.portions,
			};

			await prisma.wallet.update({
				where: { accountId: investorId },
				data: {
					amount: { increment: fundraiser.fundingAmount * 0.95 },
					onHold: { decrement: fundraiser.fundingAmount },
				},
			});

			await prisma.fundraiser.delete({
				where: { id: fundraiserId },
			});

			await prisma.raisingFunds.update({
				where: { id: fundraiser.raisingFundsId },
				data: dataToUpdate,
			});
		});
		res.status(200).json({ message: "Investment cancelled successfully" });
	} catch (error) {
		console.error("Error cancelling investment:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};
export const investAtFixedPrice = async (req, res) => {
	const { raisingFundsId, portions } = req.body;
	const investorType = req.account.role;
	const investorId = req.account.id;
	const walletBalance = await prisma.wallet.findUnique({
		where: { accountId: investorId },
	}).amount;

	if (!raisingFundsId || !portions) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const fundraising = await prisma.raisingFunds.findUnique({
			where: { id: raisingFundsId },
		});

		if (!fundraising) {
			return res
				.status(404)
				.json({ message: "Fundraising campaign not found" });
		}

		if (fundraising.status != "Active") {
			return res
				.status(400)
				.json({ message: "Fundraising campaign is not active" });
		}

		if (portions > fundraising.remainingPortions) {
			return res.status(400).json({ message: "Not enough portions available" });
		}

		const fundingAmount = fundraising.pricePerPortion * portions;

		if (fundingAmount > walletBalance) {
			return res.status(400).json({ message: "Insufficient funds" });
		}

		const additionalEquity =
			(fundraising.equityPercentage / fundraising.totalPortions) * portions;
		await prisma.$transaction(async (prisma) => {
			const existingFundraiser = await prisma.fundraiser.findFirst({
				where: {
					raisingFundsId,
					...(investorType == "User"
						? { investorUserId: investorId }
						: { investorCompanyId: investorId }),
				},
			});
			if (existingFundraiser) {
				await prisma.fundraiser.update({
					where: { id: existingFundraiser.id },
					data: {
						portions: { increment: portions },
						fundingAmount: { increment: fundingAmount },
						equityPercentage: { increment: additionalEquity },
						pricePerPortion:
							(existingFundraiser.fundingAmount + fundingAmount) /
							(existingFundraiser.portions + portions),
					},
				});
			} else {
				await prisma.fundraiser.create({
					data: {
						investorType,
						raisingFunds: { connect: { id: raisingFundsId } },
						equityPercentage: additionalEquity,
						fundingAmount,
						portions,
						pricePerPortion: fundraising.pricePerPortion,
						date: new Date(),
						status: "Pending",
						envelopeId: "",
						...(investorType == "User"
							? { investorUser: { connect: { id: investorId } } }
							: { investorCompany: { connect: { id: investorId } } }),
					},
				});
			}
			const newRaisingFunds = await prisma.raisingFunds.update({
				where: { id: raisingFundsId },
				data: { remainingPortions: { decrement: portions } },
			});

			await prisma.investmentOffer.updateMany({
				where: {
					raisingFundsId: newRaisingFunds.id,
					status: "Pending",
					portions: {
						gt: newRaisingFunds.remainingPortions,
					},
				},
				data: {
					status: "Rejected",
				},
			});
			//this here only holds the money till they all sign the contracts
			await prisma.wallet.update({
				where: { accountId: investorId },
				data: {
					amount: { decrement: fundingAmount },
					onHold: { increment: fundingAmount },
				},
			});
			// if (newRaisingFunds.remainingPortions == 0) {
			// 	await prisma.raisingFunds.update({
			// 		where: { id: raisingFundsId },
			// 		data: {
			// 			status: "Completed",
			// 		},
			// 	});
			// } else if (newRaisingFunds.remainingPortions < 0) {
			// 	throw new Error("Invalid remaining portions");
			// }
		});
		const updatedFundraising = await prisma.raisingFunds.findUnique({
			where: { id: raisingFundsId },
			include: {
				fundraisers: { include: { investorUser: true, investorCompany: true } },
			},
		});

		const totalRaised = updatedFundraising.fundraisers.reduce(
			(sum, fundraiser) => sum + fundraiser.fundingAmount,
			0,
		);

		const isComplete =
			totalRaised >= updatedFundraising.fundingAmount ||
			updatedFundraising.remainingPortions === 0;

		if (isComplete) {
			await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/docusigninvestor`, {
				raisingFundsId: raisingFundsId,
			});
		}

		res.status(200).json({ message: "Investment successful" });
	} catch (error) {
		console.error("Error making investment:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const makeInvestmentOffer = async (req, res) => {
	const { raisingFundsId, portions, offeredPricePerPortion } = req.body;
	const investorType = req.account.role;
	const investorId = req.account.id;

	if (!raisingFundsId || !portions || !offeredPricePerPortion) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const walletBalance = await prisma.wallet.findUnique({
			where: { accountId: investorId },
		}).amount;

		const fundraising = await prisma.raisingFunds.findUnique({
			where: { id: raisingFundsId },
		});

		if (!fundraising) {
			return res
				.status(400)
				.json({ message: "Fundraising campaign not found" });
		}

		if (fundraising.status != "Active") {
			return res
				.status(400)
				.json({ message: "Fundraising campaign is not active" });
		}

		if (portions > fundraising.remainingPortions) {
			return res.status(400).json({ message: "Not enough portions available" });
		}

		const totalOfferedPrice = offeredPricePerPortion * portions;

		if (totalOfferedPrice > walletBalance) {
			return res.status(400).json({ message: "Insufficient funds" });
		}

		const offerData = {
			investorType,
			raisingFunds: {
				connect: { id: raisingFundsId },
			},
			portions,
			offeredPricePerPortion,
			totalOfferedPrice,
			date: new Date(),
			status: "Pending",
		};

		if (investorType == "User") {
			offerData.investorUser = {
				connect: { id: investorId },
			};
		} else if (investorType == "Company") {
			offerData.investorCompany = {
				connect: { id: investorId },
			};
		}
		await prisma.wallet.update({
			where: { accountId: investorId },
			data: {
				amount: { decrement: totalOfferedPrice },
				onHold: { increment: totalOfferedPrice },
			},
		});
		await prisma.investmentOffer.create({ data: offerData });

		res.status(200).json({ message: "Investment offer submitted" });
	} catch (error) {
		console.error("Error making investment offer:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const getMyInvestments = async (req, res) => {
	const investorType = req.account.role;
	const investorId = req.account.id;

	try {
		const investments = await prisma.fundraiser.findMany({
			where: {
				investorType,
				...(investorType == "User"
					? { investorUserId: investorId }
					: { investorCompanyId: investorId }),
			},
			include: {
				raisingFunds: {
					include: {
						company: true,
					},
				},
			},
		});

		res.json({ investments });
	} catch (error) {
		console.error("Error fetching investments:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// export const getMyFundraiserData = async (req, res) => {
// 	try {
// 		if (req.account.role == "User") {
// 			const user = await prisma.user.findUnique({
// 				where: {
// 					id: req.account.id,
// 				},
// 				include: {
// 					fundraiser: true,
// 				},
// 			});
// 			res.status(200).json({ fundraiser: user.fundraiser });
// 		} else {
// 			const company = await prisma.company.findUnique({
// 				where: {
// 					username: req.account.id,
// 				},
// 				include: {
// 					fundraiser: true,
// 				},
// 			});
// 			res.status(200).json({ fundraiser: company.fundraiser });
// 		}
// 	} catch (e) {
// 		res.status(400).send("Failed to retrieve");
// 	}
// };

export const getMyInvestmentOffers = async (req, res) => {
	const investorType = req.account.role;
	const investorId = req.account.id;

	try {
		const offers = await prisma.investmentOffer.findMany({
			where: {
				investorType,
				...(investorType == "User"
					? { investorUserId: investorId }
					: { investorCompanyId: investorId }),
				raisingFunds: {
					status: "Active",
				},
			},
			include: {
				raisingFunds: {
					include: {
						company: true,
					},
				},
			},
		});

		res.status(200).json({ offers });
	} catch (error) {
		console.error("Error fetching investment offers:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const getFundingInvestmentOffers = async (req, res) => {
	if (req.account.role != "Company") {
		return res
			.status(401)
			.json({ message: "Only companies can view investment offers" });
	}

	try {
		const offers = await prisma.investmentOffer.findMany({
			where: {
				raisingFunds: {
					companyId: req.account.id,
					status: "Active",
				},
			},
			include: {
				raisingFunds: true,
				investorUser: true,
				investorCompany: true,
			},
		});

		res.status(200).json({ offers });
	} catch (error) {
		console.error("Error fetching investment offers:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};
export const acceptInvestmentOffer = async (req, res) => {
	if (req.account.role != "Company") {
		return res
			.status(401)
			.json({ message: "Only companies can accept investment offers" });
	}

	const { offerId } = req.body;

	try {
		const offer = await prisma.investmentOffer.findUnique({
			where: { id: offerId },
			include: { raisingFunds: true },
		});

		if (!offer) {
			return res.status(404).json({ message: "Offer not found" });
		}

		if (offer.raisingFunds.companyId != req.account.id) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (offer.status != "Pending") {
			return res.status(400).json({ message: "Cannot accept this offer" });
		}

		if (offer.portions > offer.raisingFunds.remainingPortions) {
			return res.status(400).json({ message: "Not enough portions available" });
		}

		const additionalEquity =
			(offer.raisingFunds.equityPercentage / offer.raisingFunds.totalPortions) *
			offer.portions;

		await prisma.$transaction(async (prisma) => {
			await prisma.investmentOffer.update({
				where: { id: offerId },
				data: { status: "Accepted" },
			});
			const existingFundraiser = await prisma.fundraiser.findFirst({
				where: {
					raisingFundsId: offer.raisingFundsId,
					...(offer.investorType == "User"
						? { investorUserId: offer.investorUserId }
						: { investorCompanyId: offer.investorCompanyId }),
				},
			});
			if (existingFundraiser) {
				await prisma.fundraiser.update({
					where: { id: existingFundraiser.id },
					data: {
						portions: { increment: offer.portions },
						fundingAmount: { increment: offer.totalOfferedPrice },
						equityPercentage: { increment: additionalEquity },
						pricePerPortion:
							(existingFundraiser.fundingAmount + offer.totalOfferedPrice) /
							(existingFundraiser.portions + offer.portions),
					},
				});
			} else {
				await prisma.fundraiser.create({
					data: {
						investorType: offer.investorType,
						raisingFunds: { connect: { id: offer.raisingFundsId } },
						equityPercentage: additionalEquity,
						fundingAmount: offer.totalOfferedPrice,
						portions: offer.portions,
						pricePerPortion: offer.offeredPricePerPortion,
						date: new Date(),
						status: "Pending",
						envelopeId: "",
						...(offer.investorType == "User"
							? { investorUser: { connect: { id: offer.investorUserId } } }
							: {
								investorCompany: { connect: { id: offer.investorCompanyId } },
							}),
					},
				});
			}

			const newRaisingFunds = await prisma.raisingFunds.update({
				where: { id: offer.raisingFundsId },
				data: {
					remainingPortions: { decrement: offer.portions },
					fundingAmount: {
						decrement:
							offer.raisingFunds.pricePerPortion * offer.portions -
							offer.totalOfferedPrice,
					},
				},
			});
			await prisma.investmentOffer.updateMany({
				where: {
					raisingFundsId: newRaisingFunds.id,
					status: "Pending",
					portions: {
						gt: newRaisingFunds.remainingPortions,
					},
				},
				data: {
					status: "Rejected",
				},
			});

			await prisma.wallet.update({
				where: { accountId: offer.investorUserId },
				data: {
					amount: { decrement: offer.totalOfferedPrice },
					onHold: { increment: offer.totalOfferedPrice },
				},
			});

			if (newRaisingFunds.remainingPortions == 0) {
				await prisma.raisingFunds.update({
					where: { id: offer.raisingFundsId },
					data: {
						status: "Completed",
					},
				});
			} else if (newRaisingFunds.remainingPortions < 0) {
				throw new Error("Invalid remaining portions");
			}
		});

		res.status(200).json({ message: "Offer accepted and investment recorded" });
	} catch (error) {
		console.error("Error accepting investment offer:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const rejectInvestmentOffer = async (req, res) => {
	if (req.account.role != "Company") {
		return res
			.status(401)
			.json({ message: "Only companies can view investment offers" });
	}

	const { offerId } = req.body;

	try {
		const offer = await prisma.investmentOffer.findUnique({
			where: { id: offerId },
			include: { raisingFunds: true },
		});

		if (!offer) {
			return res.status(404).json({ message: "Offer not found" });
		}

		if (offer.raisingFunds.companyId != req.account.id) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (offer.status != "Pending") {
			return res.status(400).json({ message: "Cannot reject this offer" });
		}

		await prisma.wallet.update({
			where: { accountId: offer.investorUserId },
			data: {
				amount: { increment: offer.totalOfferedPrice },
				onHold: { decrement: offer.totalOfferedPrice },
			},
		});

		await prisma.investmentOffer.update({
			where: { id: offerId },
			data: { status: "Rejected" },
		});

		res.status(200).json({ message: "Offer rejected" });
	} catch (error) {
		console.error("Error rejecting investment offer:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const cancelInvestmentOffer = async (req, res) => {
	const { offerId } = req.body;

	const investorType = req.account.role;
	const investorId = req.account.id;

	try {
		const offer = await prisma.investmentOffer.findUnique({
			where: { id: offerId },
		});

		if (!offer) {
			return res.status(404).json({ message: "Investment offer not found" });
		}

		if (
			offer.investorType != investorType ||
			(investorType == "User" && offer.investorUserId != investorId) ||
			(investorType == "Company" && offer.investorCompanyId != investorId)
		) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (offer.status != "Pending") {
			return res.status(400).json({ message: "Cannot cancel this offer" });
		}

		await prisma.investmentOffer.delete({
			where: { id: offerId },
		});

		res
			.status(200)
			.json({ message: "Investment offer cancelled successfully" });
	} catch (error) {
		console.error("Error cancelling investment offer:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const cancelRaisingFunds = async (req, res) => {
	const companyId = req.account.id;
	const userRole = req.account.role;
	const id = req.body.raisingFundsId;
	try {
		if (userRole != "Company") {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		const raisingFunds = await prisma.raisingFunds.findUnique({
			where: {
				id: id,
				companyId: companyId,
			},
			include: {
				investmentOffers: true,
				fundraisers: true,
			},
		});

		if (!raisingFunds) {
			return res.status(404).json({ message: "Raising funds not found" });
		}

		if (raisingFunds.status !== "Active" && raisingFunds.status !== "Pending") {
			return res
				.status(400)
				.json({ message: "Cannot cancel this raising fund" });
		}

		await prisma.$transaction(async (prisma) => {
			await prisma.investmentOffer.deleteMany({
				where: { raisingFundsId: id },
			});

			await prisma.fundraiser.deleteMany({
				where: { raisingFundsId: id },
			});
			if (raisingFunds.length == 0) {
				return res
					.status(404)
					.json({ message: "No active raising funds found" });
			}

			await prisma.raisingFunds.update({
				where: { id: id },
				data: { status: "Failed" },
			});
		});

		res.status(200).json({
			message: "Raising funds and related investments cancelled successfully",
		});
	} catch (error) {
		console.error("Error cancelling raising funds:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteOneFundingRound = async (req, res) => {
	try {
		const financial = await prisma.financial.findUnique({
			where: { id: req.body.financialId },
		});
		const fundingRound = await prisma.fundingRound.delete({
			where: {
				id: req.body.fundingRoundId,
			},
		});
		const updatedTotalFundingAmount =
			financial.totalFundingAmount - req.body.funding_amount;
		await prisma.financial.update({
			where: { id: req.body.financialId },
			data: { totalFundingAmount: updatedTotalFundingAmount },
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};
