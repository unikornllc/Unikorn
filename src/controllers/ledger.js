import prisma from "../db.js";



export const getAllLedgerAccounts = async (req, res) => {
    try {
        const ledgerAccounts = await prisma.ledgerAccount.findMany({
            include: { user: true, company: true }
        });
        res.json(ledgerAccounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLedgerAccountById = async (req, res) => {
    try {
        const { ledgerAccountId } = req.query;
        const ledgerAccount = await prisma.ledgerAccount.findUnique({
            where: { id: ledgerAccountId },
            include: { user: true, company: true }
        });
        if (!ledgerAccount) return res.status(400).json({ error: 'ledger Account not found' });
        res.json(ledgerAccount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const getAllWallets = async (req, res) => {
    try {
        const wallets = await prisma.wallet.findMany({
            include: { user: true, company: true }
        });
        res.json(wallets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getWalletById = async (req, res) => {
    try {
        const { walletId } = req.query;
        const wallet = await prisma.wallet.findUnique({
            where: { id: walletId },
            include: { user: true, company: true }
        });
        if (!wallet) return res.status(400).json({ error: 'Wallet not found' });
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            include: { user: true, company: true, Entry: true }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTransactionById = async (req, res) => {
    try {
        const { transactionId } = req.query;
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
            include: { user: true, company: true, Entry: true }
        });
        if (!transaction) return res.status(400).json({ error: 'Transaction not found' });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getAllJournals = async (req, res) => {
    try {
        const journals = await prisma.journal.findMany({ include: { raisingFunds: true, Entry: true } });
        res.json(journals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getJournalById = async (req, res) => {
    try {
        const { journalId } = req.query;
        const journal = await prisma.journal.findUnique({
            where: { id: journalId },
            include: { raisingFunds: true, Entry: true }
        });
        if (!journal) return res.status(400).json({ error: 'Journal not found' });
        res.json(journal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllEntries = async (req, res) => {
    try {
        const entries = await prisma.entry.findMany({
            include: { transaction: true, journal: true, ledger: true }
        });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEntryById = async (req, res) => {
    try {
        const { entryId } = req.query;
        const entry = await prisma.entry.findUnique({
            where: { id: entryId },
            include: { transaction: true, journal: true, ledger: true }
        });
        if (!entry) return res.status(400).json({ error: 'Entry not found' });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

