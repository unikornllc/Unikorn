import prisma from "../db.js";

export const investmentFlow = async (req, res) => {
	try {
		const amount = parseFloat(req.body.amount);
		const { raisingFundsId } = req.body;
		const date = Date.now();

		const wallet = await prisma.wallet.findUnique({
			where: { accountId: req.account.id },
		});
		if (!wallet) {
			return res.status(402).json({ message: "Wallet not found" });
		}

		const account = await prisma.account.findUnique({
			where: { id: req.account.id },
			select: { username: true, LedgerAccount: true },
		});

		await prisma.$transaction(async (prisma) => {
			await prisma.wallet.update({
				where: { id: wallet.id },
				data: { amount: { decrement: amount } },
			});
			const journal = await prisma.journal.create({
				data: {
					name: `Investment ${raisingFundsId}`,
					flowType: "Investment_Flow",
					raisingFunds: { connect: { id: raisingFundsId } },
				},
			});

			const transaction = await prisma.transaction.create({
				data: {
					transactionType: "Purchase_Equity",
					amount: amount,
					description:
						"Investment by user " +
						account.username +
						"\nInvestment Amount $" +
						amount +
						"\nDate" +
						date,
					accountId: account.id,
				},
			});
			const debit = await prisma.entry.create({
				data: {
					entryType: "DEBIT",
					transactionId: transaction.id,
					description:
						"Entry Type DEBIT:" +
						"\n" +
						account.username +
						"invested" +
						"\nAmount $" +
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

			const credit = await prisma.entry.create({
				data: {
					entryType: "CREDIT",
					transactionId: transaction.id,
					description:
						"Entry Type CREDIT:" +
						"\n" +
						account.username +
						"invested" +
						"\nAmount $" +
						amount +
						"\nDate " +
						date,
					amount: amount,
					journalId: journal.id,
					ledgerId: bank.id,
				},
			});
			await prisma.ledgerAccount.update({
				where: { id: account.LedgerAccount.id },
				data: { totalBalance: { decrement: amount } },
			});
		});
	} catch (err) {}
};

export const depositWallet = async (req, res) => {
	try {
		const amount = parseFloat(req.body.amount);
		const date = Date.now();
		if (isNaN(amount) || amount <= 0) {
			return res.status(400).json({ message: "Invalid deposit amount" });
		}

		const wallet = await prisma.wallet.findUnique({
			where: { accountId: req.account.id },
		});

		const bank = await prisma.ledgerAccount.findUnique({
			where: {
				id: process.env.BANK_ACCOUNT,
			},
			select: { id: true },
		});

		if (!wallet) {
			return res.status(402).json({ message: "Wallet not found" });
		}

		const account = await prisma.account.findUnique({
			where: { id: req.account.id },
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
					accountId: account.id,
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
				id: process.env.BANK_ACCOUNT,
			},
			select: { id: true },
		});

		const wallet = await prisma.wallet.findUnique({
			where: { accountId: req.account.id },
		});

		if (!wallet) {
			return res.status(402).json({ message: "Wallet not found" });
		}

		const account = await prisma.account.findUnique({
			where: { id: req.account.id },
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
					accountId: account.id,
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

export const getWallet = async (req, res) => {
	try {
		const wallet = await prisma.wallet.findUnique({
			where: { accountId: req.account.id },
		});

		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		res.status(200).json({ amount: wallet.amount });
	} catch (err) {
		console.error("Get wallet error:", err);
		res.status(500).json({ message: "Something went wrong" });
	}
};
