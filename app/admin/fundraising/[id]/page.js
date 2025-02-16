import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/_ui/Table"
import axios from "axios";
import { headers } from "next/headers";

async function getFundRaisingDetails(raisingFundsId) {
    try {
        const headersInstance = await headers();
        const cookie = headersInstance.get("cookie");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER}/api/getRaisingFundsById`,
            {
                params: { raisingFundsId },
                headers: {
                    cookie: cookie || "",
                },
            },
        );
        const raisingFunds = response.data.raisingFunds;
        if (!raisingFunds) {
            notFound()
        }
        return raisingFunds
    } catch (error) {
        notFound()
    }
}

export default async function FundRaisingDetailsPage({ params }) {
    const fundRaising = await getFundRaisingDetails(params.id)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Fund Raising Details</h1>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Company:</strong> {fundRaising.company.name}
                        </div>
                        <div>
                            <strong>Status:</strong> {fundRaising.status}
                        </div>
                        <div>
                            <strong>Equity Percentage:</strong> {fundRaising.equityPercentage}%
                        </div>
                        <div>
                            <strong>Funding Amount:</strong> ${fundRaising.fundingAmount}
                        </div>
                        <div>
                            <strong>Price Per Portion:</strong> ${fundRaising.pricePerPortion}
                        </div>
                        <div>
                            <strong>Remaining Portions:</strong> {fundRaising.remainingPortions}
                        </div>
                        <div>
                            <strong>Total Portions:</strong> {fundRaising.totalPortions}
                        </div>
                        <div>
                            <strong>Date:</strong> {new Date(fundRaising.date).toLocaleString()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Fundraisers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Investor</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Equity %</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Portions</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fundRaising.fundraisers.map((fundraiser) => (
                                <TableRow key={fundraiser.id}>
                                    <TableCell>
                                        {fundraiser.investorType === "User"
                                            ? fundraiser.investorUser?.name
                                            : fundraiser.investorCompany?.name}
                                    </TableCell>
                                    <TableCell>{fundraiser.investorType}</TableCell>
                                    <TableCell>{fundraiser.equityPercentage}%</TableCell>
                                    <TableCell>${fundraiser.fundingAmount}</TableCell>
                                    <TableCell>{fundraiser.portions}</TableCell>
                                    <TableCell>{fundraiser.status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Investment Offers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Investor</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Portions</TableHead>
                                <TableHead>Price/Portion</TableHead>
                                <TableHead>Total Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fundRaising.investmentOffers.map((offer) => (
                                <TableRow key={offer.id}>
                                    <TableCell>
                                        {offer.investorType === "User" ? offer.investorUser?.name : offer.investorCompany?.name}
                                    </TableCell>
                                    <TableCell>{offer.investorType}</TableCell>
                                    <TableCell>{offer.portions}</TableCell>
                                    <TableCell>${offer.offeredPricePerPortion}</TableCell>
                                    <TableCell>${offer.totalOfferedPrice}</TableCell>
                                    <TableCell>{offer.status}</TableCell>
                                    <TableCell>{new Date(offer.date).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

