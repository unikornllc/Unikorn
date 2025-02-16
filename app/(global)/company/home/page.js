"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/_ui/Tabs"

import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Users, Briefcase, TrendingUp, Activity } from "lucide-react"
import StatCard from "@/app/_components/_shared/_home/StatCard"
import ActivityFeed from "@/app/_components/_shared/_home/ActivityFeed"
import ProfileCard from "@/app/_components/_shared/_home/ProfileCard"
import { fetchCurrentCompanyData } from "@/app/_utils/_api/homePage"
import Loading from "@/app/(global)/loading"

export default function CompanyHome() {
    const [companyData, setCompanyData] = useState(null)
    const [followers, setFollowers] = useState([])
    const [activities, setActivities] = useState([])

    useEffect(() => {
        const companyId = "current-company-id"
        const fetchData = async () => {
            try {
                const [company] = await Promise.all([
                    fetchCurrentCompanyData(),
                    // fetchFollowedEntities(companyId, "followers"),
                    // fetchActivities(companyId, "company"),
                ])
                setCompanyData(company)
                // setFollowers(followerData)
                // setActivities(activityData)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    const stats = [
        { title: "Total Followers", value: followers.length, icon: Users },
        {
            title: "Fundraising Progress",
            value: `$${companyData?.fundraisingProgress || 0}M / $${companyData?.fundraisingGoal || 0}M`,
            icon: TrendingUp,
        },
        { title: "Investors", value: companyData?.investorCount || "0", icon: Users },
        { title: "Documents", value: companyData?.documentCount || "0", icon: Briefcase },
    ]

    if (!companyData) {
        return <Loading></Loading>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileCard profile={companyData} isCompany={true} />
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="fundraising">Fundraising</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview">
                                    <div className="grid grid-cols-2 gap-4">
                                        {stats.map((stat, index) => (
                                            <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="fundraising">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Current Fundraising</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span>Progress</span>
                                                    <span>
                                                        {((companyData.fundraisingProgress / companyData.fundraisingGoal) * 100).toFixed(2)}%
                                                    </span>
                                                </div>
                                                <progress
                                                    className="w-full [&::-moz-progress-bar]:bg-indigo-600 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-indigo-600"
                                                    value={companyData.fundraisingProgress}
                                                    max={companyData.fundraisingGoal}
                                                />
                                                <div className="flex justify-between text-sm text-gray-600">
                                                    <span>${companyData.fundraisingProgress}M</span>
                                                    <span>${companyData.fundraisingGoal}M</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="activity">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Recent Activity</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* <ul className="space-y-4">
                                                {activities && activities.slice(0, 3).map((activity, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                        <span>{activity.description}</span>
                                                    </li>
                                                ))}
                                            </ul> */}
                                            <ul className="space-y-4">
                                                <li className="flex items-center">
                                                    <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                    <span>New investor joined your latest funding round</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                    <span>Updated company profile information</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                    <span>Posted a new update to your feed</span>
                                                </li>
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                    <ActivityFeed />
                </div>
            </main>
        </div>
    )
}

