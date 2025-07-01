import prisma from "../db.js";

export const getAdminMetrics = async (req, res) => {
    try {
        // const totalTransactions = await prisma.transaction.count();
        // const totalVolumeAgg = await prisma.transaction.aggregate({
        //     _sum: {
        //         amount: true,
        //     },
        // });
        // const totalVolume = totalVolumeAgg._sum.amount || 0;

        // const totalVerifiedUsers = await prisma.user.count({
        //     where: { verified: true },
        // });

        // const totalVerifiedCompanies = await prisma.company.count({
        //     where: { verified: true },
        // });
        const [totalTransactions, totalUsers, totalCompanies, totalFundRaising] = await prisma.$transaction([
            prisma.transaction.count(),
            prisma.user.count(),
            prisma.company.count(),
            prisma.raisingFunds.count()

        ]);

        // res.json({
        //     totalTransactions,
        //     totalVolume,
        //     totalVerifiedUsers,
        //     totalVerifiedCompanies,
        // });
        res.status(200).json({
            totalTransactions,
            totalUsers,
            totalCompanies,
            totalFundRaising,
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFundRaisingsFiltered = async (req, res) => {
    try {
        console.log("Received query:", req.query);

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim() || '';
        const status = req.query.status?.trim() || '';
        const fromDate = req.query.from ? new Date(req.query.from) : null;
        const toDate = req.query.to ? new Date(req.query.to) : null;
        const skip = (page - 1) * limit;
        const take = limit;
        const whereClause = {};

        if (status) whereClause.status = status;
        if (fromDate && toDate) {
            whereClause.date = {
                gte: fromDate,
                lte: toDate,
            };
        }
        if (search) {
            whereClause.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { envelopeId: { contains: search, mode: 'insensitive' } },
            ];
        }

        console.log("Final query:", whereClause);

        const [fundRaisings, total] = await prisma.$transaction([
            prisma.raisingFunds.findMany({
                where: whereClause,
                skip,
                take,
                orderBy: { date: 'desc' },
                include: { company: true, journal: true, investmentOffers: true },
            }),
            prisma.raisingFunds.count({ where: whereClause }),
        ]);

        res.json({ fundRaisings, total });
    } catch (error) {
        console.error("Error fetching fund raisings:", error);
        res.status(500).json({ error: 'Failed to fetch fund raisings' });
    }
};


export const getJournalsFiltered = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim() || '';
        const flowType = req.query.flowType?.trim() || '';
        const skip = (page - 1) * limit;
        const take = limit;
        const whereClause = {};

        if (flowType) whereClause.flowType = flowType;
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { id: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [journals, total] = await prisma.$transaction([
            prisma.journal.findMany({
                where: whereClause,
                skip,
                take,
                orderBy: { name: 'asc' },
                include: { raisingFunds: true, Entry: true },
            }),
            prisma.journal.count({ where: whereClause }),
        ]);

        res.json({ journals, total });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch journals' });
    }
};

export const getTransactionsFiltered = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search?.trim() || '';
        const type = req.query.transactionType?.trim() || '';
        const fromDate = req.query.from ? new Date(req.query.from) : null;
        const toDate = req.query.to ? new Date(req.query.to) : null;
        const skip = (page - 1) * limit;
        const take = limit;
        const whereClause = {};

        if (type && type !== 'all') whereClause.transactionType = type;
        if (fromDate && toDate) {
            whereClause.date = {
                gte: fromDate,
                lte: toDate,
            };
        }
        if (search) {
            whereClause.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { id: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [transactions, total] = await prisma.$transaction([
            prisma.transaction.findMany({
                where: whereClause,
                skip,
                take,
                orderBy: { date: 'desc' },
                include: { account: true, Entry: true },
            }),
            prisma.transaction.count({ where: whereClause }),
        ]);

        res.json({ transactions, total });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};
