"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/_ui/Table"
import { Input } from "@/app/_components/_ui/Input"
import { Button } from "@/app/_components/_ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/_ui/Select"
import { DatePickerWithRange } from "@/app/_components/_ui/DateRangePicker"
import { useToast } from "@/app/_components/_ui/UseToast"
import { EmptyState } from "@/app/_components/_ui/EmptyState"

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        dateRange: { from: null, to: null },
    })
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        fetchTransactions()
    }, [])

    const fetchTransactions = async () => {
        setIsLoading(true);

        const searchParams = new URLSearchParams({
            page: page.toString(),
            limit: ITEMS_PER_PAGE.toString(),
            search: filters.search,
            transactionType: filters.type,
        });

        if (filters.dateRange.from && filters.dateRange.to) {
            searchParams.append("from", filters.dateRange.from.toISOString());
            searchParams.append("to", filters.dateRange.to.toISOString());
        }

        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/admin/transactions?${searchParams.toString()}`, {
                withCredentials: true,
            });

            setTransactions(data.transactions);
            setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        } catch (error) {
            toast({
                message: "Failed to fetch transactions. Please try again.",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPage(1)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
        fetchTransactions()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Transactions</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                        <Input
                            placeholder="Search transactions"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Transaction Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Wallet_Deposit">Wallet Deposit</SelectItem>
                                <SelectItem value="Wallet_Withdraw">Wallet Withdraw</SelectItem>
                                <SelectItem value="Surrender_Equity">Surrender Equity</SelectItem>
                                <SelectItem value="Purchase_Equity">Purchase Equity</SelectItem>
                                <SelectItem value="Withdraw_Equity">Withdraw Equity</SelectItem>
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange onChange={(range) => handleFilterChange("dateRange", range)} />
                    </div>
                    <Button onClick={fetchTransactions}>Apply Filters</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transactions List</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading transactions...</p>
                        </div>
                    ) : transactions.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{transaction.id}</TableCell>
                                            <TableCell>{transaction.transactionType}</TableCell>
                                            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                                            <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
                                            <TableCell>{transaction.description}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/transactions/${transaction.id}`)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                                    Previous
                                </Button>
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <EmptyState
                            title="No transactions found"
                            description="Try adjusting your filters or add new transactions."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

