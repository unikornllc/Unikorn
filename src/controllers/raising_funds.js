import prisma from "../db.js";

export const getActiveRaisingFunds = async (req, res) => {
	try {
		const fundraisings = await prisma.raising_Funds.findMany({
			where: { status: "Active" },
			include: {
				company: true,
			},
		});
		if (!fundraisings) {
			res.status(200).json({ message: "No active fundraising found" });
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
		res.status(200).json(fundraisings);
	} catch (e) {
		res.status(400).json({ message: "Failed to retrieve" });
	}
};

export const getCompanyActiveRaisingFund = async (req, res) => {
	try {
		let param;
		if (req.query.username) {
			param = { username: req.query.username };
		} else {
			if (req.decodedUser.role != "Company") {
				return res.status(401).json({ message: "Unauthorized action" });
			}
			param = { id: req.decodedUser.id };
		}
		const fundraising = await prisma.raising_Funds.findFirst({
			where: { status: "Active", company: param },
			include: {
				company: true,
			},
		});
		if (!fundraising) {
			res.status(200).json({ message: "No active fundraising found" });
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
			raisingFundsId: fundraising.id,
			companyUsername: fundraising.company.username,
			companyName: fundraising.company.name,
			totalAmount: fundraising.fundingAmount,
			totalEquity: fundraising.equityPercentage,
			remainingEquity: remainingEquity,
			remainingPortions: fundraising.remainingPortions,
			pricePerPortion: fundraising.pricePerPortion,
			portions: fundraising.totalPortions,
			portionAmount: fundraising.fundingAmount / fundraising.totalPortions,
			portionEquity: fundraising.equityPercentage / fundraising.totalPortions,
			fundedPortions,
			fundedPercentage,
			totalPortions: fundraising.totalPortions,
		});
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Failed to retrieve" });
	}
};
export const cancelInvestment = async (req, res) => {
	const { fundraiserId } = req.body;

	const investorType = req.decodedUser.role;
	const investorId = req.decodedUser.id;

	try {
		const fundraiser = await prisma.fundraiser.findUnique({
			where: { id: fundraiserId },
			include: { raisingFunds: true },
		});

		if (!fundraiser) {
			return res.status(404).json({ message: "Investment offer not found" });
		}

		if (fundraiser.investorType != investorType) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (investorType == "User" && fundraiser.investorUserId != investorId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (
			investorType == "Company" &&
			fundraiser.investorCompanyId != investorId
		) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (fundraiser.raisingFunds.status != "Active") {
			return res.status(400).json({ message: "Cannot cancel this Investment" });
		}
		await prisma.$transaction(async (prisma) => {
			const fundraising = await prisma.raising_Funds.findUnique({
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

			await prisma.fundraiser.delete({
				where: { id: fundraiserId },
			});

			await prisma.raising_Funds.update({
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
	const { raisingFundsId, portions, walletBalance } = req.body;
	const investorType = req.decodedUser.role;
	const investorId = req.decodedUser.id;

	if (!raisingFundsId || !portions || !walletBalance) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const fundraising = await prisma.raising_Funds.findUnique({
			where: { id: raisingFundsId },
		});

		if (!fundraising) {
			return res
				.status(404)
				.json({ message: "Fundraising campaign not found" });
		}

		if (fundraising.status !== "Active") {
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

		const equityPercentage =
			(fundraising.equityPercentage / fundraising.totalPortions) * portions;

		await prisma.$transaction(async (prisma) => {
			const fundraiserData = {
				investorType,
				raisingFunds: {
					connect: { id: raisingFundsId },
				},
				equityPercentage,
				fundingAmount,
				portions,
				pricePerPortion: fundraising.pricePerPortion,
				date: new Date(),
				status: "Pending",
				envelopeId: "",
			};
			console.log(fundraiserData);

			if (investorType == "User") {
				fundraiserData.investorUser = {
					connect: { id: investorId },
				};
			} else if (investorType == "Company") {
				fundraiserData.investorCompany = {
					connect: { id: investorId },
				};
			}

			await prisma.fundraiser.create({ data: fundraiserData });

			await prisma.raising_Funds.update({
				where: { id: raisingFundsId },
				data: {
					remainingPortions: fundraising.remainingPortions - portions,
				},
			});
		});

		res.status(200).json({ message: "Investment successful" });
	} catch (error) {
		console.error("Error making investment:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const makeInvestmentOffer = async (req, res) => {
	const { raisingFundsId, portions, offeredPricePerPortion, walletBalance } =
		req.body;
	const investorType = req.decodedUser.role;

	const investorId = req.decodedUser.id;
	console.log(investorType);
	if (!raisingFundsId || !portions || !offeredPricePerPortion) {
		return res.status(400).json({ message: "Missing required fields" });
	}

	try {
		const fundraising = await prisma.raising_Funds.findUnique({
			where: { id: raisingFundsId },
		});

		if (!fundraising) {
			return res
				.status(400)
				.json({ message: "Fundraising campaign not found" });
		}

		if (fundraising.status !== "Active") {
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

		await prisma.investmentOffer.create({ data: offerData });

		res.status(200).json({ message: "Investment offer submitted" });
	} catch (error) {
		console.error("Error making investment offer:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const getMyInvestments = async (req, res) => {
	const investorType = req.decodedUser.role;
	const investorId = req.decodedUser.id;

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

		res.json(investments);
	} catch (error) {
		console.error("Error fetching investments:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// export const getMyFundraiserData = async (req, res) => {
// 	try {
// 		if (req.decodedUser.role == "User") {
// 			const user = await prisma.user.findUnique({
// 				where: {
// 					id: req.decodedUser.id,
// 				},
// 				include: {
// 					fundraiser: true,
// 				},
// 			});
// 			res.status(200).json({ fundraiser: user.fundraiser });
// 		} else {
// 			const company = await prisma.company_Profile.findUnique({
// 				where: {
// 					username: req.decodedUser.id,
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
	const investorType = req.decodedUser.role;
	const investorId = req.decodedUser.id;

	try {
		const offers = await prisma.investmentOffer.findMany({
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

		res.status(200).json(offers);
	} catch (error) {
		console.error("Error fetching investment offers:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const getFundingInvestmentOffers = async (req, res) => {
	if (req.decodedUser.role != "Company") {
		return res
			.status(401)
			.json({ message: "Only companies can view investment offers" });
	}

	try {
		const offers = await prisma.investmentOffer.findMany({
			where: {
				raisingFunds: {
					companyId: req.decodedUser.id,
				},
			},
			include: {
				raisingFunds: true,
				investorUser: true,
				investorCompany: true,
			},
		});

		res.status(200).json(offers);
	} catch (error) {
		console.error("Error fetching investment offers:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};
export const acceptInvestmentOffer = async (req, res) => {
	if (req.decodedUser.role != "Company") {
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

		if (offer.raisingFunds.companyId != req.decodedUser.id) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (offer.status != "Pending") {
			return res.status(400).json({ message: "Cannot accept this offer" });
		}

		if (offer.portions > offer.raisingFunds.remainingPortions) {
			return res.status(400).json({ message: "Not enough portions available" });
		}

		await prisma.$transaction(async (prisma) => {
			await prisma.investmentOffer.update({
				where: { id: offerId },
				data: { status: "Accepted" },
			});

			const fundraiserData = {
				investorType: offer.investorType,
				raisingFunds: {
					connect: { id: offer.raisingFundsId },
				},
				// investmentOffer: {
				// 	connect: { id: offer.id },
				// },
				equityPercentage:
					(offer.raisingFunds.equityPercentage /
						offer.raisingFunds.totalPortions) *
					offer.portions,
				fundingAmount: offer.totalOfferedPrice,
				portions: offer.portions,
				pricePerPortion: offer.offeredPricePerPortion,
				date: new Date(),
				status: "Pending",
				envelopeId: "",
			};

			if (offer.investorType == "User") {
				fundraiserData.investorUser = {
					connect: { id: offer.investorUserId },
				};
			} else if (offer.investorType == "Company") {
				fundraiserData.investorCompany = {
					connect: { id: offer.investorCompanyId },
				};
			}
			await prisma.fundraiser.create({ data: fundraiserData });

			await prisma.raising_Funds.update({
				where: { id: offer.raisingFundsId },
				data: {
					remainingPortions:
						offer.raisingFunds.remainingPortions - offer.portions,
					fundingAmount:
						offer.raisingFunds.fundingAmount -
						(offer.raisingFunds.pricePerPortion * offer.portions -
							offer.totalOfferedPrice),
				},
			});
		});

		res.status(200).json({ message: "Offer accepted and investment recorded" });
	} catch (error) {
		console.error("Error accepting investment offer:", error);
		res.status(400).json({ message: "Internal server error" });
	}
};

export const rejectInvestmentOffer = async (req, res) => {
	if (req.decodedUser.role != "Company") {
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

		if (offer.raisingFunds.companyId != req.decodedUser.id) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (offer.status != "Pending") {
			return res.status(400).json({ message: "Cannot reject this offer" });
		}

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

	const investorType = req.decodedUser.role;
	const investorId = req.decodedUser.id;

	try {
		const offer = await prisma.investmentOffer.findUnique({
			where: { id: offerId },
		});

		if (!offer) {
			return res.status(404).json({ message: "Investment offer not found" });
		}

		if (offer.investorType != investorType) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (investorType == "User" && offer.investorUserId != investorId) {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		if (investorType == "Company" && offer.investorCompanyId != investorId) {
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
	const companyId = req.decodedUser.id;
	const userRole = req.decodedUser.role;
	const data = req.body.fundingData;
	console.log(data);

	try {
		if (userRole !== "Company") {
			return res.status(403).json({ message: "Unauthorized action" });
		}

		const activeFunds = await prisma.raising_Funds.findFirst({
			where: {
				companyId: companyId,
				status: "Active" || "Pending",
			},
		});

		if (activeFunds.length === 0) {
			return res.status(404).json({ message: "No active raising funds found" });
		}

		await prisma.raising_Funds.update({
			where: {
				id: data.raisingFundsId,
				companyId: companyId,
				status: "Active" || "Pending",
			},
			data: {
				status: "Failed",
			},
		});

		res.status(200).json({
			message: "All active raising funds have been cancelled successfully",
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
		const fundingRound = await prisma.funding_Round.delete({
			where: {
				id: req.body.fundingRoundId,
			},
		});
		const updatedTotalFundingAmount =
			financial.total_funding_amount - req.body.funding_amount;
		await prisma.financial.update({
			where: { id: req.body.financialId },
			data: { total_funding_amount: updatedTotalFundingAmount },
		});
		res.status(200).send("Deleted successfully");
	} catch (e) {
		console.log(e);
		res.status(400).send("Failed to delete");
	}
};
