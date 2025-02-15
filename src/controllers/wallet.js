import prisma from "../db.js";

export const depositWallet = async (req, res) => {
	try {
		const amount = parseFloat(req.body.amount);
		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ message: "Invalid deposit amount" });
		}

		const wallet =
			(await prisma.wallet.findUnique({
				where: { userId: req.decodedUser.id },
			})) ||
			(await prisma.wallet.findUnique({
				where: { companyId: req.decodedUser.id },
			}));

		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		await prisma.wallet.update({	
			where: { id: wallet.id },
			data: { amount: { increment: amount } },
		});

		res.status(200).json({ message: "Deposited successfully" });
	} catch (err) {
		console.error("Deposit error:", err);
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const withdrawWallet = async (req, res) => {
	try {
		const amount = parseFloat(req.body.amount);
		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ message: "Invalid withdrawal amount" });
		}

		const wallet =
			(await prisma.wallet.findUnique({
				where: { userId: req.decodedUser.id },
			})) ||
			(await prisma.wallet.findUnique({
				where: { companyId: req.decodedUser.id },
			}));

		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		if (wallet.amount < amount) {
			return res.status(400).json({ message: "Insufficient funds" });
		}

		await prisma.wallet.update({
			where: { id: wallet.id },
			data: { amount: { decrement: amount } },
		});

		res.status(200).json({ message: "Withdrawn successfully" });
	} catch (err) {
		console.error("Withdrawal error:", err);
		res.status(500).json({ message: "Something went wrong" });
	}
};

export const getUserWallet = async (req, res) => {
	try {
		const wallet =
			(await prisma.wallet.findUnique({
				where: { userId: req.decodedUser.id },
			})) ||
			(await prisma.wallet.findUnique({
				where: { companyId: req.decodedUser.id },
			}));

		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		res.status(200).json({ amount: wallet.amount });
	} catch (err) {
		console.error("Get wallet error:", err);
		res.status(500).json({ message: "Something went wrong" });
	}
};
