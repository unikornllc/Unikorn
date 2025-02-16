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
import axios from "axios";

const ITEMS_PER_PAGE = 10

export default function FundRaisingPage() {
    const [fundRaisings, setFundRaisings] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        dateRange: { from: null, to: null },
    })
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const { toast } = useToast()

    // useEffect(() => {
    //     fetchFundRaisings()
    // }, [])
    useEffect(() => {
        fetchFundRaisings()
    }, [page, filters])

    const fetchFundRaisings = async () => {
        setIsLoading(true);

        const searchParams = new URLSearchParams();
        searchParams.append("page", page.toString());
        searchParams.append("limit", ITEMS_PER_PAGE.toString());
        if (filters.search) searchParams.append("search", filters.search.trim());
        if (filters.status) searchParams.append("status", filters.status.trim());
        if (filters.dateRange.from) searchParams.append("from", filters.dateRange.from.toISOString());
        if (filters.dateRange.to) searchParams.append("to", filters.dateRange.to.toISOString());
        console.log(searchParams);
        try {
            console.log("Sending request to:", `/api/admin/fundraisings?${searchParams.toString()}`);
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/api/admin/fundraisings`, {
                withCredentials: true,
                params: { page: page.toString(), limit: ITEMS_PER_PAGE.toString(), search: filters.search, status: filters.status, from: filters.dateRange.from, to: filters.dateRange.to }
            });

            console.log("Received data:", data);

            setFundRaisings(data.fundRaisings);
            setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
        } catch (error) {
            console.error("Error fetching fundraisings:", error.response?.data || error.message);
            toast({
                message: "Failed to fetch fundraisings. Please try again.",
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
        fetchFundRaisings()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Fundraising Activities</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex space-x-4">
                        <Input
                            placeholder="Search fundraisings"
                            value={filters.search}
                            onChange={(e) => handleFilterChange("search", e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value=" ">All Statuses</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange onChange={(range) => handleFilterChange("dateRange", range)} />
                    </div>
                    <Button onClick={fetchFundRaisings}>Apply Filters</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Fundraising List</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <p>Loading fundraising activities...</p>
                        </div>
                    ) : fundRaisings.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Equity %</TableHead>
                                        <TableHead>Funding Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fundRaisings.map((fundRaising) => (
                                        <TableRow key={fundRaising.id}>
                                            <TableCell>{fundRaising.id}</TableCell>
                                            <TableCell>{fundRaising.company.name}</TableCell>
                                            <TableCell>{fundRaising.equityPercentage}%</TableCell>
                                            <TableCell>${fundRaising.fundingAmount.toFixed(2)}</TableCell>
                                            <TableCell>{fundRaising.status}</TableCell>
                                            <TableCell>{new Date(fundRaising.date).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/admin/fund-raising/${fundRaising.id}`)}
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
                            title="No fundraising activities found"
                            description="Try adjusting your filters or create a new fundraising activity."
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

