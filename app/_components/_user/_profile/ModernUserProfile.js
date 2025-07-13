"use client";

import React from "react";

import { useState, useEffect } from "react";
import Header from "@/app/_components/_user/_profile/ModernHeader";
import About from "@/app/_components/_user/_profile/About";
import Experience from "@/app/_components/_user/_profile/Experience";
import Education from "@/app/_components/_user/_profile/Education";
import Expertise from "@/app/_components/_user/_profile/Expertise";
import Certifications from "@/app/_components/_user/_profile/Certifications";
import Sidebar from "@/app/_components/_user/_profile/Sidebar";
import Files from "@/app/_components/_user/_profile/Files";
import InvestmentsSection from "@/app/_components/_shared/_profile/InvestmentsSection";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import CalendlyEventTypes from "@/app/_components/_shared/_calendly/CalendlyEventTypes";
import ManageSub from "@/app/_components/_user/_profile/ManageSub";
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
} from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import HomeSection from "@/app/_components/_user/_profile/_sections/HomeSection";
import PostsSection from "@/app/_components/_user/_profile/_sections/PostsSection";
import ActivitySection from "@/app/_components/_user/_profile/_sections/ActivitySection";
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

export default function ModernUserProfile({ user, editable = false }) {
	const [activeTab, setActiveTab] = useState("home");
	const [tabContentHeight, setTabContentHeight] = useState("auto");
	const [isMobile, setIsMobile] = useState(false);
	const [profileStats, setProfileStats] = useState({
		followers: 0,
		following: 0,
		posts: 0,
		investments: 0,
	});
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// useEffect(() => {
	// 	if (user) {
	// 		fetchProfileStats();
	// 	}
	// }, [user]);

	// const fetchProfileStats = async () => {
	// 	try {
	// 		setProfileStats({
	// 			followers: user.followers?.length || 0,
	// 			following: user.following?.length || 0,
	// 			posts: user.posts?.length || 0,
	// 			investments: user.investments?.length || 0,
	// 		});
	// 	} catch (error) {
	// 		console.error("Error fetching profile stats:", error);
	// 	}
	// };

	if (!user) {
		return (
			<div className="bg-gray-50 min-h-screen">
				<div className="container mx-auto px-4 py-8">
					<div className="max-w-4xl mx-auto">
						<Card className="p-8 text-center">
							<div className="animate-pulse">
								<div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
								<div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	const handleTabChange = (value) => {
		const currentTabContent = document.querySelector('[data-state="active"]');
		if (currentTabContent) {
			setTabContentHeight(`${currentTabContent.scrollHeight}px`);
		}
		setActiveTab(value);
	};

	// const completionPercentage = calculateProfileCompletion(user);

	const tabs = [
		{ value: "home", label: "Home", icon: Home, priority: 1 },
		{ value: "about", label: "About", icon: User, priority: 2 },
		{
			value: "professional",
			label: "Professional",
			icon: Briefcase,
			priority: 3,
		},
		{
			value: "investments",
			label: "Investments",
			icon: TrendingUp,
			priority: 4,
		},
		{ value: "posts", label: "Posts", icon: MessageSquare, priority: 5 },
		// { value: "activity", label: "Activity", icon: Activity, priority: 6 },
		{ value: "schedule", label: "Schedule", icon: Calendar, priority: 6 },
	];

	// For mobile, show only top 4 tabs directly, rest in dropdown
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

	return (
		<div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
			<Header
				user={{
					username: user.account.username,
					tier: user.tier,
					email: user.email,
					name: user.name,
					title: user.title,
					description: user.description,
					unikornVerified: false,
					calendlyIntegration: user.calendlyIntegration,
				}}
				editable={editable}
				profileStats={profileStats}
			/>

			<div className="container mx-auto px-4 py-6">
				{/* Profile Completion Banner */}
				{/* {editable && completionPercentage < 100 && (
					<Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-semibold text-blue-900">
										Complete Your Profile
									</h3>
									<p className="text-blue-700 text-sm">
										Your profile is {completionPercentage}% complete. Add more
										information to attract better opportunities.
									</p>
								</div>
								<div className="text-right">
									<div className="text-2xl font-bold text-blue-600">
										{completionPercentage}%
									</div>
									<div className="w-16 h-2 bg-blue-200 rounded-full">
										<div
											className="h-full bg-blue-500 rounded-full transition-all duration-300"
											style={{ width: `${completionPercentage}%` }}
										></div>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)} */}

				{/* Quick Stats */}
				{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<Eye className="h-6 w-6 text-blue-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.followers}
							</div>
							<div className="text-sm text-gray-500">Followers</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<Users className="h-6 w-6 text-green-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.following}
							</div>
							<div className="text-sm text-gray-500">Following</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<MessageSquare className="h-6 w-6 text-purple-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.posts}
							</div>
							<div className="text-sm text-gray-500">Posts</div>
						</CardContent>
					</Card>
					<Card className="hover:shadow-md transition-shadow">
						<CardContent className="p-4 text-center">
							<TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
							<div className="text-2xl font-bold text-gray-900">
								{profileStats.investments}
							</div>
							<div className="text-sm text-gray-500">Investments</div>
						</CardContent>
					</Card>
				</div> */}

				<Tabs
					defaultValue="home"
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
						className="tab-content-wrapper transition-all duration-300 ease-in-out mt-6"
						style={{ minHeight: tabContentHeight }}
					>
						<TabsContent
							value="home"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<HomeSection
								user={user}
								investments={user.investments || []}
								editable={editable}
								profileStats={profileStats}
							/>
						</TabsContent>

						<TabsContent
							value="about"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2 space-y-6">
									<About
										username={user.account.username}
										aboutList={{
											description: user.description,
										}}
										editable={editable}
									/>
									<Education
										username={user.account.username}
										educationList={user.education || []}
										editable={editable}
									/>
								</div>
								<div className="lg:col-span-1">
									<Sidebar
										username={user.account.username}
										languageList={user.language || []}
										interestList={user.interest || []}
										socialMediaList={user.socialMedia || []}
										editable={editable}
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="professional"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<div className="space-y-6">
								<Experience
									username={user.account.username}
									corporateExperienceList={user.corporateExperience || []}
									startupExperienceList={user.startupExperience || []}
									editable={editable}
								/>
								<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
									<Expertise
										username={user.account.username}
										expertiseList={user.expertise || []}
										editable={editable}
									/>
									<Certifications
										username={user.account.username}
										certificationList={user.certificationsCourses || []}
										editable={editable}
									/>
								</div>
								<Files username={user.account.username} editable={editable} />
							</div>
						</TabsContent>

						<TabsContent
							value="posts"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<PostsSection user={user} editable={editable} />
						</TabsContent>

						{/* <TabsContent
							value="activity"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<ActivitySection user={user} editable={editable} />
						</TabsContent> */}

						<TabsContent
							value="schedule"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								<div className="lg:col-span-2">
									<Card className="shadow-sm">
										<CardHeader>
											<CardTitle className="flex items-center gap-2">
												<Calendar className="h-5 w-5" />
												Schedule & Availability
											</CardTitle>
										</CardHeader>
										<CardContent>
											{user.calendlyIntegration ? (
												<CalendlyEventTypes />
											) : (
												<div className="text-center py-8">
													<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
													<h3 className="text-lg font-medium text-gray-900 mb-2">
														No Calendar Integration
													</h3>
													<p className="text-gray-500 mb-4">
														Connect your calendar to allow others to schedule
														meetings with you.
													</p>
													{editable && <Button>Connect Calendar</Button>}
												</div>
											)}
										</CardContent>
									</Card>
								</div>
								<div className="lg:col-span-1">
									{editable && (
										<ManageSub tier={user.tier} wallet={user.wallet} />
									)}
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="investments"
							className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
						>
							<InvestmentsSection
								investments={user.investments || []}
								editable={editable}
							/>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}

// function calculateProfileCompletion(user) {
// 	let completed = 0;
// 	const total = 10;

// 	if (user.name) completed++;
// 	if (user.description) completed++;
// 	if (user.education && user.education.length > 0) completed++;
// 	if (user.corporateExperience && user.corporateExperience.length > 0)
// 		completed++;
// 	if (user.startupExperience && user.startupExperience.length > 0) completed++;
// 	if (user.expertise && user.expertise.length > 0) completed++;
// 	if (user.certificationsCourses && user.certificationsCourses.length > 0)
// 		completed++;
// 	if (user.language && user.language.length > 0) completed++;
// 	if (user.socialMedia && user.socialMedia.length > 0) completed++;
// 	if (user.interest && user.interest.length > 0) completed++;

// 	return Math.round((completed / total) * 100);
// }
