import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"

export default function StatCard({ title, value, icon: Icon }) {
    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

