"use client";

import React from "react";

import { useState, useEffect } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { useToast } from "@/app/_components/_hooks/useToast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/app/_components/_ui/DropdownMenu";
import { Button } from "@/app/_components/_ui/Button";

import ProfileHeader from "@/app/_components/_company/_profile/ProfileHeader";
import HomeSection from "@/app/_components/_company/_profile/_sections/HomeSection";
import AboutSection from "@/app/_components/_company/_profile/_sections/AboutSection";
import PostsSection from "@/app/_components/_company/_profile/_sections/PostsSection";
import FundingSection from "@/app/_components/_company/_profile/_sections/FundingSection";
import PeopleSection from "@/app/_components/_company/_profile/_sections/PeopleSection";
import NewsSection from "@/app/_components/_company/_profile/_sections/NewsSection";
import InvestmentsSection from "@/app/_components/_shared/_profile/InvestmentsSection";

import {
	Briefcase,
	Home,
	MessageSquare,
	User,
	TrendingUp,
	Activity,
	Calendar,
	Eye,
	Users,
	ChevronDown,
	DollarSign,
} from "lucide-react";

import { getAccountStats } from "@/app/_utils/_api/sharedAPIs";

export default function CompanyProfile({ company, isOwner }) {
	const [isMobile, setIsMobile] = useState(false);
	const { toast } = useToast();
	const [activeTab, setActiveTab] = useState(isOwner ? "about" : "home");
	const [companyData, setCompanyData] = useState(company);

	const [tabContentHeight, setTabContentHeight] = useState("auto");
	const [profileStats, setProfileStats] = useState({
		followersCount: 0,
		followingCount: 0,
		postsCount: 0,
		investmentsCount: 0,
	});

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	const handleTabChange = (value) => {
		const currentTabContent = document.querySelector('[data-state="active"]');
		if (currentTabContent) {
			setTabContentHeight(`${currentTabContent.scrollHeight}px`);
		}
		setActiveTab(value);
	};

	const tabs = [
		{ value: "about", label: "About", icon: User, priority: 2 },
		{
			value: "funding",
			label: "Funding",
			icon: DollarSign,
			priority: 3,
		},
		{
			value: "investments",
			label: "Investments",
			icon: TrendingUp,
			priority: 4,
		},
		{ value: "posts", label: "Posts", icon: MessageSquare, priority: 5 },
		{ value: "people", label: "People", icon: Users, priority: 7 },
		{ value: "news", label: "News", icon: Calendar, priority: 8 },
	];

	if (!isOwner) {
		tabs.unshift({
			value: "home",
			label: "Home",
			icon: Home,
			priority: 1,
		});
	}

	const primaryTabs = tabs.slice(0, 4);
	const secondaryTabs = tabs.slice(4);
	const currentTab = tabs.find((tab) => tab.value === activeTab);

	const TabButton = ({ tab, isActive = false, className = "" }) => (
		<TabsTrigger
			value={tab.value}
			className={`rounded-lg flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-all duration-200 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-100 data-[state=active]:hover:bg-blue-600 ${className}`}
		>
			<tab.icon size={16} className="flex-shrink-0" />
			<span className="hidden sm:inline truncate">{tab.label}</span>
		</TabsTrigger>
	);
	useEffect(() => {
		const fetchProfileStats = async () => {
			try {
				await getAccountStats(company.username).then((data) => {
					setProfileStats({
						followersCount: data.followersCount,
						followingCount: data.followingCount,
						postsCount: data.postsCount,
						investmentsCount: data.investmentsCount,
					});
				});
			} catch (error) {
				console.error("Error fetching profile stats:", error);
			}
		};
		fetchProfileStats();
	}, [companyData]);

	return (
		<div className="min-h-screen bg-gray-50">
			<ProfileHeader company={companyData} isOwner={isOwner} />

			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.followersCount}
							</div>
							<div className="text-sm text-gray-500">Followers</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.followingCount}
							</div>
							<div className="text-sm text-gray-500">Following</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<MessageSquare className="h-6 w-6 text-purple-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.postsCount}
							</div>
							<div className="text-sm text-gray-500">Posts</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.investmentsCount}
							</div>
							<div className="text-sm text-gray-500">Investments</div>
						</CardContent>
					</Card>
				</div>

				<Tabs
					defaultValue={isOwner ? "about" : "home"}
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<div className="sticky top-0 z-10 bg-gradient-to-br from-gray-50 to-gray-100 pt-2 pb-4">
						<Card className="shadow-sm overflow-hidden">
							{/* Desktop Tabs */}
							<div className="hidden md:block">
								<TabsList className="grid w-full grid-cols-6 rounded-xl bg-white p-1">
									{tabs.map((tab) => (
										<TabButton key={tab.value} tab={tab} />
									))}
								</TabsList>
							</div>

							{/* Mobile Tabs */}
							<div className="md:hidden">
								<div className="bg-white p-2">
									<div className="flex items-center justify-between">
										{/* Primary tabs - horizontally scrollable */}
										<div className="flex-1 overflow-x-auto">
											<TabsList className="inline-flex h-auto p-1 bg-gray-100 rounded-lg min-w-full">
												<div className="flex space-x-1 min-w-max px-1">
													{primaryTabs.map((tab) => (
														<TabButton
															key={tab.value}
															tab={tab}
															className="flex-shrink-0 min-w-[60px]"
														/>
													))}
												</div>
											</TabsList>
										</div>

										{/* More dropdown for secondary tabs */}
										<div className="ml-2 flex-shrink-0">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="outline"
														size="sm"
														className={`h-10 px-3 ${secondaryTabs.some((tab) => tab.value === activeTab) ? "bg-blue-500 text-white border-blue-500" : ""}`}
													>
														{secondaryTabs.some(
															(tab) => tab.value === activeTab,
														) ? (
															<>
																{React.createElement(currentTab.icon, {
																	size: 16,
																	className: "mr-1",
																})}
																<span className="sr-only">
																	{currentTab.label}
																</span>
															</>
														) : (
															<>
																<span className="text-xs font-medium">
																	More
																</span>
															</>
														)}
														<ChevronDown size={14} className="ml-1" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48">
													{secondaryTabs.map((tab) => (
														<DropdownMenuItem
															key={tab.value}
															onClick={() => handleTabChange(tab.value)}
															className={`flex items-center gap-2 cursor-pointer ${
																activeTab === tab.value
																	? "bg-blue-50 text-blue-600"
																	: ""
															}`}
														>
															<tab.icon size={16} />
															{tab.label}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</div>
							</div>
						</Card>
					</div>

					<div
						className="tab-content-wrapper transition-all duration-300 ease-in-out"
						style={{ minHeight: tabContentHeight }}
					>
						{!isOwner && (
							<TabsContent
								value="home"
								className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
								onAnimationEnd={(e) => {
									setTabContentHeight(`${e.target.scrollHeight}px`);
								}}
							>
								<HomeSection company={companyData} isOwner={isOwner} />
							</TabsContent>
						)}

						<TabsContent
							value="about"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<AboutSection company={companyData} isOwner={isOwner} />
						</TabsContent>

						<TabsContent
							value="posts"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<PostsSection company={companyData} isOwner={isOwner} />
						</TabsContent>

						<TabsContent
							value="funding"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<FundingSection company={companyData} isOwner={isOwner} />
						</TabsContent>

						<TabsContent
							value="people"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<PeopleSection company={companyData} isOwner={isOwner} />
						</TabsContent>

						<TabsContent
							value="news"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<NewsSection company={companyData} isOwner={isOwner} />
						</TabsContent>

						<TabsContent
							value="investments"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<InvestmentsSection
								investments={company.investments || []}
								editable={isOwner}
							/>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
