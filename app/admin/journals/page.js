"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/_ui/Table"
import { Input } from "@/app/_components/_ui/Input"
import { Button } from "@/app/_components/_ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/_ui/Select"
import { useToast } from "@/app/_components/_hooks/useToast"
import { EmptyState } from "@/app/_components/_ui/EmptyState"
import axios from "axios"

const ITEMS_PER_PAGE = 10

export default function JournalsPage() {
    const [journals, setJournals] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [filters, setFilters] = useState({ search: "", flowType: "" })
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        fetchJournals()
    }, [])

    const fetchJournals = async () => {
        setIsLoading(true);

        const searchParams = new URLSearchParams({
            page: page.toString(),
            limit: ITEMS_PER_PAGE.toString(),
            search: filters.search.trim(),
            flowType: filters.flowType.trim(),
        });

        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/admin/journals?${searchParams.toString()}`, {
                withCredentials: true,
            });

            setJournals(data.journals);
            setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        } catch (error) {
            console.error("Error fetching journals:", error.response?.data || error.message);
            toast({ message: "Failed to fetch journals. Please try again.", type: "error" });
        } finally {
            setIsLoading(false);
        }
    };


    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
        setPage(1)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Journals</h1>

            <Card>
                <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                        <Input
                            placeholder="Search journals"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={filters.flowType} onValueChange={(value) => handleFilterChange("flowType", value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Flow Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Types</SelectItem>
                                <SelectItem value="Wallet_Deposit">Wallet Deposit</SelectItem>
                                <SelectItem value="Wallet_Withdraw">Wallet Withdraw</SelectItem>
                                <SelectItem value="Investment_Flow">Investment Flow</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={fetchJournals}>Apply Filters</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Journals List</CardTitle></CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading journals...</p>
                        </div>
                    ) : journals.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Flow Type</TableHead>
                                        <TableHead>Total Balance</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {journals.map((journal) => (
                                        <TableRow key={journal.id}>
                                            <TableCell>{journal.id}</TableCell>
                                            <TableCell>{journal.name}</TableCell>
                                            <TableCell>{journal.flowType}</TableCell>
                                            <TableCell>${journal.totalBalance.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/journals/${journal.id}`)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <Button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
                                    Previous
                                </Button>
                                <span>Page {page} of {totalPages}</span>
                                <Button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages}>
                                    Next
                                </Button>
                            </div>
                        </>
                    ) : (
                        <EmptyState title="No journals found" description="Try adjusting your filters or create a new journal." />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
