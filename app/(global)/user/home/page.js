"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/_ui/Tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/_components/_ui/Card"
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react"
import StatCard from "@/app/_components/_shared/_home/StatCard"
import ActivityFeed from "@/app/_components/_shared/_home/ActivityFeed"
import ProfileCard from "@/app/_components/_shared/_home/ProfileCard"
import { fetchCurrentUserData } from "@/app/_utils/_api/homePage"
import Loading from "@/app/(global)/loading"

export default function UserHome() {
    const [userData, setUserData] = useState(null)
    const [followedCompanies, setFollowedCompanies] = useState([])
    const [followedUsers, setFollowedUsers] = useState([])
    const [activities, setActivities] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user] = await Promise.all([
                    fetchCurrentUserData(),
                    // fetchFollowedEntities(userId, "companies"),
                    // fetchFollowedEntities(userId, "users"),
                    // fetchActivities(userId, "user"),
                ])
                console.log(user)
                setUserData(user)
                // setFollowedCompanies(companies)
                // setFollowedUsers(users)
                // setActivities(user.activities)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    const stats = [
        { title: "Total Invested", value: userData?.totalInvested || "$0", icon: DollarSign },
        { title: "Active Investments", value: userData?.activeInvestments || "0", icon: TrendingUp },
        { title: "Companies Followed", value: 0, icon: Users },
        { title: "Users Followed", value: 0, icon: Users },
    ]

    if (!userData) {
        return <Loading></Loading>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileCard profile={userData} isCompany={false} />
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="overview" className="space-y-4">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="investments">Investments</TabsTrigger>
                                    <TabsTrigger value="activity">Activity</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview">
                                    <div className="grid grid-cols-2 gap-4">
                                        {stats.map((stat, index) => (
                                            <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="investments">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Investment Overview</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm text-gray-600">Total Invested</p>
                                                    <p className="text-2xl font-bold text-indigo-900">{userData.totalInvested}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Active Investments</p>
                                                    <p className="text-2xl font-bold text-indigo-900">{userData.activeInvestments}</p>
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
                                                {activities.slice(0, 3).map((activity, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                        <span>{activity.description}</span>
                                                    </li>
                                                ))}
                                            </ul> */}
                                            <ul className="space-y-4">
                                                <li className="flex items-center">
                                                    <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                    <span>Invested in TechInnovate Inc.</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                    <span>Followed a new company</span>
                                                </li>
                                                <li className="flex items-center">
                                                    <Activity className="h-4 w-4 mr-2 text-indigo-600" />
                                                    <span>Commented on a company update</span>
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

