"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Users, TrendingUp, DollarSign } from "lucide-react";
import StatCard from "@/app/_components/_shared/_home/StatCard";
import ActivityFeed from "@/app/_components/_shared/_home/ActivityFeed";
import ProfileCard from "@/app/_components/_shared/_home/ProfileCard";
import { fetchCurrentUserData } from "@/app/_utils/_api/homePage";
import Loading from "@/app/(global)/loading";

export default function UserHome() {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [user] = await Promise.all([fetchCurrentUserData()]);
				setUserData(user);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const stats = [
		{
			title: "Total Invested",
			value: userData?.totalInvested || "$0",
			icon: DollarSign,
		},
		{
			title: "Active Investments",
			value: userData?.activeInvestments || "0",
			icon: TrendingUp,
		},
		{
			title: "Companies Followed",
			value: userData?.companiesFollowed || "0",
			icon: Users,
		},
		{
			title: "Users Followed",
			value: userData?.usersFollowed || "0",
			icon: Users,
		},
	];

	if (!userData) {
		return <Loading />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
			<main className="container mx-auto py-8 flex flex-col md:flex-row gap-6">
				{/* SIDEBAR: Profile Only */}
				<aside className="w-full md:w-1/5 sticky top-0 self-start">
					<ProfileCard profile={userData} isCompany={false} />
				</aside>

				{/* MAIN: Newsfeed */}
				<section className="w-full md:w-2/5 space-y-6">
					<ActivityFeed />
				</section>

				{/* DASHBOARD: Each Tab as Own Div */}
				<section className="w-full md:w-2/5 space-y-6 sticky top-0 self-start">
					{/* Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								{stats.map((stat, i) => (
									<StatCard
										key={i}
										title={stat.title}
										value={stat.value}
										icon={stat.icon}
									/>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Investments */}
					<Card>
						<CardHeader>
							<CardTitle>Investment Overview</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<p className="text-sm text-gray-600">Total Invested</p>
								<p className="text-2xl font-bold text-indigo-900">
									{userData.totalInvested}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600">Active Investments</p>
								<p className="text-2xl font-bold text-indigo-900">
									{userData.activeInvestments}
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{(userData.recentActivities || [])
									.slice(0, 3)
									.map((act, idx) => (
										<li key={idx} className="flex items-center">
											<TrendingUp className="h-4 w-4 mr-2 text-indigo-600" />
											<span>{act.description}</span>
										</li>
									))}
							</ul>
						</CardContent>
					</Card>
				</section>
			</main>
		</div>
	);
}
