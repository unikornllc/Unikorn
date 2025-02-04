import prisma from "../db.js";

export const depositWallet = async (req, res) => {
	try {
		await prisma.wallet.update({
			where: {
				userId: req.decodedUser.id,
			},
			data: {
				amount: {
					increment: parseFloat(req.body.amount),
				},
			},
		});
		res.status(200).json({ message: "Deposited successfully" });
	} catch (err) {
		console.error(err);
	}
};

export const withdrawWallet = async (req, res) => {
	try {
		const wallet = await prisma.wallet.findUnique({
			where: {
				userId: req.decodedUser.id,
			},
		});
		if (wallet.amount < parseFloat(req.body.amount)) {
			return res.status(400).json({ message: "Insufficient funds" });
		}
		await prisma.wallet.update({
			where: {
				userId: req.decodedUser.id,
			},
			data: {
				amount: {
					decrement: parseFloat(req.body.amount),
				},
			},
		});
		res.status(200).json({ message: "Withdrawn successfully" });
	} catch (err) {
		console.error(err);
	}
};

// export const sendTransaction = async (req, res) => {
// 	try {
// 		res.status(200).json({ message: "Transaction successful" });
// 	} catch (err) {
// 		console.error(err);
// 	}
// };

export const getTransactionHistory = async (req, res) => {
	try {
		const transactions = await prisma.user.findUnique({
			where: {
				id: req.decodedUser.id,
			},
			select: {
				sentTransactions: true,
				receivedTransactions: true,
			},
		});
		res.status(200).json(transactions);
	} catch (err) {
		console.error(err);
	}
};
