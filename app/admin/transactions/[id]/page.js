import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/_ui/Table"
import axios from "axios";
import { headers } from "next/headers";

async function getTransaction(transactionId) {
    try {
        const headersInstance = await headers();
        const cookie = headersInstance.get("cookie");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER}/api/getTransactionById`,
            {
                params: { transactionId },
                headers: {
                    cookie: cookie || "",
                },
            },
        );
        const transaction = response.data.transaction;
        console.log(transaction);
        if (!transaction) {
            notFound()
        }
        return transaction
    } catch (error) {
        console.error(error);
        notFound()
    }
}

export default async function TransactionDetail({ params }) {
    const transaction = await getTransaction(params.id)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Transaction {transaction.id}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div>
                            <strong>Type:</strong> {transaction.transactionType}
                        </div>
                        <div>
                            <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
                        </div>
                        <div>
                            <strong>Date:</strong> {new Date(transaction.date).toLocaleString()}
                        </div>
                        <div>
                            <strong>Description:</strong> {transaction.description}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-bold mt-6 mb-4">Ledger Entries</h2>
            {transaction.ledgers.map((entry) => (
                <Card key={entry.id} className="mb-4">
                    <CardContent className="p-4">
                        <div>
                            <strong>Amount:</strong> ${entry.amount.toFixed(2)}
                        </div>
                        <div>
                            <strong>Type:</strong> {entry.type}
                        </div>
                        <div>
                            <strong>Description:</strong> {entry.description}
                        </div>
                    </CardContent>
                </Card>
            ))}

            <h2 className="text-2xl font-bold mt-6 mb-4">Journal Entries</h2>
            {transaction.JournalEntry.map((entry) => (
                <Card key={entry.id} className="mb-4">
                    <CardContent className="p-4">
                        <div>
                            <strong>Amount:</strong> ${entry.amount.toFixed(2)}
                        </div>
                        <div>
                            <strong>Type:</strong> {entry.entryType}
                        </div>
                        <div>
                            <strong>Description:</strong> {entry.description}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

