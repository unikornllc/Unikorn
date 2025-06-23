"use client";

import { useState, useEffect } from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Users, Briefcase, TrendingUp, Activity } from "lucide-react";
import StatCard from "@/app/_components/_shared/_home/StatCard";
import ActivityFeed from "@/app/_components/_shared/_home/ActivityFeed";
import ProfileCard from "@/app/_components/_shared/_home/ProfileCard";
import { fetchCurrentCompanyData } from "@/app/_utils/_api/homePage";
import Loading from "@/app/(global)/loading";

export default function CompanyHome() {
	const [companyData, setCompanyData] = useState(null);
	const [followers, setFollowers] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [company] = await Promise.all([fetchCurrentCompanyData()]);
				setCompanyData(company);
				// setFollowers(fetchedFollowers)
			} catch (error) {
				console.error("Error fetching company data:", error);
			}
		};
		fetchData();
	}, []);

	const stats = [
		{ title: "Total Followers", value: followers.length, icon: Users },
		{
			title: "Fundraising Progress",
			value: `$${companyData?.fundraisingProgress || 0}M / $${companyData?.fundraisingGoal || 0}M`,
			icon: TrendingUp,
		},
		{
			title: "Investors",
			value: companyData?.investorCount || "0",
			icon: Users,
		},
		{
			title: "Documents",
			value: companyData?.documentCount || "0",
			icon: Briefcase,
		},
	];

	if (!companyData) return <Loading />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
			<main className="container mx-auto py-8 flex flex-col md:flex-row gap-6">
				{/* SIDEBAR */}
				<aside className="w-full md:w-1/5 sticky top-0 self-start">
					<ProfileCard profile={companyData} isCompany={true} />
				</aside>

				{/* MAIN: Newsfeed */}
				<section className="w-full md:w-2/5 space-y-6">
					<ActivityFeed />
				</section>

				{/* DASHBOARD: Separate Cards */}
				<section className="w-full md:w-2/5 space-y-6 sticky top-0 self-start">
					{/* Overview */}
					<Card>
						<CardHeader>
							<CardTitle>Overview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4">
								{stats.map((stat, idx) => (
									<StatCard
										key={idx}
										title={stat.title}
										value={stat.value}
										icon={stat.icon}
									/>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Fundraising */}
					<Card>
						<CardHeader>
							<CardTitle>Current Fundraising</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="flex justify-between">
								<span>Progress</span>
								<span>
									{(
										(companyData.fundraisingProgress /
											companyData.fundraisingGoal) *
										100
									).toFixed(2)}
									%
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
						</CardContent>
					</Card>

					{/* Recent Activity */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-4">
								{(companyData.recentActivities || []).map((act, idx) => (
									<li key={idx} className="flex items-center">
										<Activity className="h-4 w-4 mr-2 text-indigo-600" />
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
