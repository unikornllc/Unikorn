import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/_ui/Table"
import axios from "axios";
import { headers } from "next/headers";
export const dynamic = 'force-dynamic'
async function getLedgerAccounts() {
    try {
        const headersInstance = await headers();
        const cookie = headersInstance.get("cookie");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER}/api/getAllLedgerAccounts`,
            {
                params: {},
                headers: {
                    cookie: cookie || "",
                },
            },
        );
        const ledgerAccounts = response.data.ledgerAccounts;

        return ledgerAccounts
    } catch (error) {
        notFound()
    }
    return prisma.ledgerAccount.findMany({
        include: {
            company: true,
            user: true,
        },
    })
}

export default async function LedgerAccountsPage() {
    const ledgerAccounts = await getLedgerAccounts()

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Ledger Accounts Summary</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Ledger Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Total Balance</TableHead>
                                <TableHead>Owner</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ledgerAccounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell>{account.id}</TableCell>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell>${account.totalBalance.toFixed(2)}</TableCell>
                                    <TableCell>{account.company ? account.company.name : account.user?.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

