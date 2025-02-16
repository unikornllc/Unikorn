import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { ArrowUpRight, DollarSign, Users, BarChart2, PieChart } from "lucide-react"
import axios from "axios";
import { headers } from "next/headers";

async function getDashboardData() {
    const headersInstance = await headers();
    const cookie = headersInstance.get("cookie");
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/api/admin/metrics`,
        {
            params: {},
            headers: {
                cookie: cookie || "",
            },
        },
    );
    console.log(response.data);
    return {
        ...response.data
    }
}

export default async function AdminDashboard() {
    const { totalTransactions, totalUsers, totalCompanies, totalFundRaising } = await getDashboardData()

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Total Transactions"
                    value={totalTransactions}
                    icon={<DollarSign className="h-4 w-4" />}
                    link="/admin/transactions"
                />
                <DashboardCard
                    title="Total Users"
                    value={totalUsers}
                    icon={<Users className="h-4 w-4" />}
                    link="/admin/users"
                />
                <DashboardCard
                    title="Total Companies"
                    value={totalCompanies}
                    icon={<BarChart2 className="h-4 w-4" />}
                    link="/admin/companies"
                />
                <DashboardCard
                    title="Active Fundraising"
                    value={totalFundRaising}
                    icon={<PieChart className="h-4 w-4" />}
                    link="/admin/fundraising"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <QuickLinksCard />
                <RecentActivityCard />
            </div>
        </div>
    )
}

function DashboardCard({ title, value, icon, link }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <Link href={link} className="text-xs text-muted-foreground hover:underline">
                    View all
                </Link>
            </CardContent>
        </Card>
    )
}

function QuickLinksCard() {
    const links = [
        { href: "/admin/transactions/new", label: "New Transaction" },
        { href: "/admin/ledger-accounts/new", label: "New Ledger Account" },
        { href: "/admin/journals/new", label: "New Journal" },
        { href: "/admin/fundraising/new", label: "New Fundraising" },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                                {link.label}
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}

function RecentActivityCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    Recent activity will be displayed here. Implement this feature by fetching and displaying the latest
                    transactions, journal entries, or fundraising activities.
                </p>
            </CardContent>
        </Card>
    )
}

