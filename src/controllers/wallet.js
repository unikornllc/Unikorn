import prisma from "../db.js";

export const depositWallet = async (req, res) => {
	try {
		const amount = parseFloat(req.body.amount);
		const date = Date.now();
		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ message: "Invalid deposit amount" });
		}

		const wallet = await prisma.wallet.findUnique({
			where:
				req.decodedUser.role === "User"
					? { userId: req.decodedUser.id }
					: { companyId: req.decodedUser.id },
		});

		const bank = await prisma.ledgerAccount.findUnique({
			where: {
				id: "4b00a1c6-ea92-4ffd-8488-419a2a087c28",
			},
			select: { id: true },
		});

		if (!wallet) {
			return res.status(402).json({ message: "Wallet not found" });
		}

		const account = await prisma[
			req.decodedUser.role === "User" ? "user" : "company_profile"
		].findUnique({
			where: { id: req.decodedUser.id },
			select: { username: true, LedgerAccount: true },
		});

		const journal = await prisma.journal.findUnique({
			where: {
				name: "Wallet Deposit",
			},
		});
		await prisma.$transaction(async (prisma) => {
			await prisma.wallet.update({
				where: { id: wallet.id },
				data: { amount: { increment: amount } },
			});

			const transaction = await prisma.transaction.create({
				data: {
					transactionType: "Wallet_Deposit",
					amount: amount,
					description:
						"Wallet Deposit by user " +
						account.username +
						"\nDeposit Amount $" +
						amount +
						"\nDate " +
						date,
					...(req.decodedUser.role === "User"
						? { userId: req.decodedUser.id }
						: { companyId: req.decodedUser.id }),
				},
			});

			const dr = await prisma.entry.create({
				data: {
					entryType: "DEBIT",
					transactionId: transaction.id,
					description:
						"Entry type DEBIT:" +
						"\n" +
						account.username +
						" deposited money into his wallet" +
						"\nDeposit Amount $" +
						amount +
						"\nDate " +
						date,
					amount: amount,
					journalId: journal.id,
					ledgerId: bank.id,
				},
			});
			await prisma.ledgerAccount.update({
				where: { id: bank.id },
				data: { totalBalance: { increment: amount } },
			});
			const cr = await prisma.entry.create({
				data: {
					entryType: "CREDIT",
					transactionId: transaction.id,
					description:
						"Entry type CREDIT:" +
						"\n" +
						account.username +
						" deposited money into his wallet" +
						"\nDeposit Amount $" +
						amount +
						"\nDate " +
						date,
					amount: amount,
					journalId: journal.id,
					ledgerId: account.LedgerAccount.id,
				},
			});
			await prisma.ledgerAccount.update({
				where: { id: account.LedgerAccount.id },
				data: { totalBalance: { decrement: amount } },
			});
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
		const date = Date.now();
		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ message: "Invalid deposit amount" });
		}
		const bank = await prisma.ledgerAccount.findUnique({
			where: {
				id: "4b00a1c6-ea92-4ffd-8488-419a2a087c28",
			},
			select: { id: true },
		});

		const wallet = await prisma.wallet.findUnique({
			where:
				req.decodedUser.role === "User"
					? { userId: req.decodedUser.id }
					: { companyId: req.decodedUser.id },
		});

		if (!wallet) {
			return res.status(402).json({ message: "Wallet not found" });
		}

		const account = await prisma[
			req.decodedUser.role === "User" ? "user" : "company_profile"
		].findUnique({
			where: { id: req.decodedUser.id },
			select: { username: true, LedgerAccount: true },
		});
		const journal = await prisma.journal.findUnique({
			where: {
				name: "Wallet Withdraw",
			},
		});
		await prisma.$transaction(async (prisma) => {
			await prisma.wallet.update({
				where: { id: wallet.id },
				data: { amount: { decrement: amount } },
			});

			const transaction = await prisma.transaction.create({
				data: {
					transactionType: "Wallet_Withdraw",
					amount: amount,
					description:
						"Wallet Withdraw by user " +
						account.username +
						"\nWithdraw Amount $" +
						amount +
						"\nDate " +
						date,
					...(req.decodedUser.role === "User"
						? { userId: req.decodedUser.id }
						: { companyId: req.decodedUser.id }),
				},
			});

			const cr = await prisma.entry.create({
				data: {
					entryType: "CREDIT",
					transactionId: transaction.id,
					description:
						"Entry type CREDIT:" +
						"\n" +
						account.username +
						" withdrawn money from his wallet" +
						"\nWithdraw Amount $" +
						amount +
						"\nDate " +
						date,
					amount: amount,
					journalId: journal.id,
					ledgerId: bank.id,
				},
			});
			await prisma.ledgerAccount.update({
				where: { id: bank.id },
				data: { totalBalance: { decrement: amount } },
			});
			const dr = await prisma.entry.create({
				data: {
					entryType: "DEBIT",
					transactionId: transaction.id,
					description:
						"Entry type DEBIT:" +
						"\n" +
						account.username +
						" withdrawn money from his wallet" +
						"\nWithdraw Amount $" +
						amount +
						"\nDate " +
						date,
					amount: amount,
					journalId: journal.id,
					ledgerId: account.LedgerAccount.id,
				},
			});
			await prisma.ledgerAccount.update({
				where: { id: account.LedgerAccount.id },
				data: { totalBalance: { increment: amount } },
			});
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
