"use client";

import { useState } from "react";
import Header from "@/app/_components/_user/_profile/ModernHeader";
import About from "@/app/_components/_user/_profile/About";
import Experience from "@/app/_components/_user/_profile/Experience";
import Education from "@/app/_components/_user/_profile/Education";
import Expertise from "@/app/_components/_user/_profile/Expertise";
import Certifications from "@/app/_components/_user/_profile/Certifications";
import Sidebar from "@/app/_components/_user/_profile/Sidebar";
import Files from "@/app/_components/_user/_profile/Files";
import Investments from "@/app/_components/_user/_profile/Investments";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import CalendlyEventTypes from "@/app/_components/_shared/_calendly/CalendlyEventTypes";
import ManageSub from "@/app/_components/_user/_profile/ManageSub";
import Link from "next/link";
import {
	Settings,
	Briefcase,
	GraduationCap,
	Home,
	MessageSquare,
	User,
	TrendingUp,
} from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import HomeSection from "@/app/_components/_user/_profile/_sections/HomeSection";
import PostsSection from "@/app/_components/_user/_profile/_sections/PostsSection";

export default function ModernUserProfile({ user, editable = false }) {
	const [activeTab, setActiveTab] = useState("home");
	const [tabContentHeight, setTabContentHeight] = useState("auto");

	if (!user)
		return (
			<div className="bg-gray-100 min-h-screen py-8">
				<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<p className="text-center p-4">Loading...</p>
				</div>
			</div>
		);

	const handleTabChange = (value) => {
		// Store current tab content height before changing
		const currentTabContent = document.querySelector('[data-state="active"]');
		if (currentTabContent) {
			setTabContentHeight(`${currentTabContent.scrollHeight}px`);
		}

		setActiveTab(value);
	};

	return (
		<div className="bg-gray-50 min-h-screen">
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
			/>

			<div className="container mx-auto px-4 py-6">
				{/* {editable && (
					<div className="flex justify-end mb-4">
						<Link href="/settings">
							<Button
								variant="outline"
								className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-sm"
							>
								<Settings size={16} />
								Settings
							</Button>
						</Link>
					</div>
				)} */}

				<Tabs
					defaultValue="home"
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4 shadow-sm">
						<TabsList className="grid w-full grid-cols-6 mb-2 rounded-xl bg-gray-100/80 backdrop-blur-sm">
							<TabsTrigger
								value="home"
								className="rounded-lg flex items-center gap-1"
							>
								<Home size={16} />
								<span className="hidden sm:inline">Home</span>
							</TabsTrigger>
							<TabsTrigger
								value="about"
								className="rounded-lg flex items-center gap-1"
							>
								<User size={16} />
								<span className="hidden sm:inline">About</span>
							</TabsTrigger>
							<TabsTrigger
								value="professional"
								className="rounded-lg flex items-center gap-1"
							>
								<Briefcase size={16} />
								<span className="hidden sm:inline">Professional</span>
							</TabsTrigger>
							<TabsTrigger
								value="investments"
								className="rounded-lg flex items-center gap-1"
							>
								<TrendingUp size={16} />
								<span className="hidden sm:inline">Investments</span>
							</TabsTrigger>
							<TabsTrigger
								value="posts"
								className="rounded-lg flex items-center gap-1"
							>
								<MessageSquare size={16} />
								<span className="hidden sm:inline">Posts</span>
							</TabsTrigger>
							<TabsTrigger
								value="schedule"
								className="rounded-lg flex items-center gap-1"
							>
								<GraduationCap size={16} />
								<span className="hidden sm:inline">Schedule</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<div
						className="tab-content-wrapper transition-all duration-300 ease-in-out"
						style={{ minHeight: tabContentHeight }}
					>
						<TabsContent
							value="home"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<HomeSection
								user={user}
								investments={user.investments || []}
								editable={editable}
							/>
						</TabsContent>

						<TabsContent
							value="about"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="md:col-span-2">
									<About
										username={user.account.username}
										aboutList={{
											description: user.description,
										}}
										editable={editable}
									/>
									<Education
										username={user.account.username}
										educationList={user.education}
										editable={editable}
									/>
								</div>
								<div className="md:col-span-1">
									<Sidebar
										username={user.account.username}
										languageList={user.language}
										interestList={user.interest}
										socialMediaList={user.socialMedia}
										editable={editable}
									/>
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="professional"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<div className="grid grid-cols-1 gap-6">
								<Experience
									username={user.account.username}
									corporateExperienceList={user.corporateExperience}
									startupExperienceList={user.startupExperience}
									editable={editable}
								/>

								<Expertise
									username={user.account.username}
									expertiseList={user.expertise}
									editable={editable}
								/>
								<Certifications
									username={user.account.username}
									certificationList={user.certificationsCourses}
									editable={editable}
								/>
								<Files username={user.account.username} editable={editable} />
							</div>
						</TabsContent>

						<TabsContent
							value="posts"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<PostsSection user={user} editable={editable} />
						</TabsContent>

						<TabsContent
							value="schedule"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
									{user.calendlyIntegration && <CalendlyEventTypes />}
								</div>
								<div className="md:col-span-1">
									{editable && (
										<ManageSub tier={user.tier} wallet={user.wallet} />
									)}
								</div>
							</div>
						</TabsContent>

						<TabsContent
							value="investments"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							<Investments
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
