"use client";

import { useState, useEffect } from "react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import ProfileHeader from "@/app/_components/_company/_profile/ProfileHeader";
import HomeSection from "@/app/_components/_company/_profile/_sections/HomeSection";
import AboutSection from "@/app/_components/_company/_profile/_sections/AboutSection";
import PostsSection from "@/app/_components/_company/_profile/_sections/PostsSection";
import FundingSection from "@/app/_components/_company/_profile/_sections/FundingSection";
import PeopleSection from "@/app/_components/_company/_profile/_sections/PeopleSection";
import NewsSection from "@/app/_components/_company/_profile/_sections/NewsSection";

import {
	LoadingProvider,
	useLoading,
} from "@/app/_components/contexts/LoadingContext";

import {
	AutoSkeleton,
	BasicProfileSkeleton,
} from "@/app/_components/_ui/_loading/Skeleton";
import {
	deleteCompanyPersonnel,
	deleteCompanyProduct,
	updateCompanyProfile,
	updateCompnanyItem,
} from "@/app/_utils/_api/companyAPIs";

const COMPANY_SECTIONS = [
	"profile",
	"home",
	"about",
	"posts",
	"funding",
	"people",
	"news",
];

function CompanyProfileContent({ company, isOwner }) {
	const [activeTab, setActiveTab] = useState(isOwner ? "about" : "home");
	const [companyData, setCompanyData] = useState(company);
	const {
		isLoading,
		setIsLoading,
		sectionLoading,
		setSectionLoading,
		initializeSections,
	} = useLoading();

	const [renderedSections, setRenderedSections] = useState({});
	const [tabContentHeight, setTabContentHeight] = useState("auto");

	useEffect(() => {
		initializeSections(COMPANY_SECTIONS, true);

		const initialRenderedSections = {};
		COMPANY_SECTIONS.forEach((section) => {
			initialRenderedSections[section] = false;
		});
		setRenderedSections(initialRenderedSections);

		fetchProfileData();
	}, []);

	const fetchProfileData = async () => {
		setIsLoading(true);
		setSectionLoading("profile", true);

		try {
			// const response = await axios.get(`/api/company/${companyData.id}/profile`);
			// const data = response.data;
			// setCompanyData(data);

			setIsLoading(false);
			setSectionLoading("profile", false);
		} catch (error) {
			console.error("Error fetching profile data:", error);
			setIsLoading(false);
			setSectionLoading("profile", false);
		}
	};

	const updateCompanyData = async (newData) => {
		setCompanyData((prevData) => ({ ...prevData, ...newData }));

		try {
			// await axios.put(`/api/company/${companyData.id}`, newData);
			console.log("Changes saved successfully");
		} catch (error) {
			console.error("Error updating company data:", error);
		}
	};

	const fetchSectionData = async (section) => {
		setSectionLoading(section, true);

		try {
			setSectionLoading(section, false);
		} catch (error) {
			console.error(`Error fetching ${section} data:`, error);
			setSectionLoading(section, false);
		}
	};

	const handleTabChange = (value) => {
		const currentTabContent = document.querySelector('[data-state="active"]');
		if (currentTabContent) {
			setTabContentHeight(`${currentTabContent.scrollHeight}px`);
		}

		setActiveTab(value);
		fetchSectionData(value);
	};

	const renderSection = (sectionName, SectionComponent, props) => {
		const isCurrentlyLoading = sectionLoading[sectionName];
		const hasBeenRenderedBefore = renderedSections[sectionName];

		return <SectionComponent {...props} />;
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{sectionLoading.profile ? (
				<AutoSkeleton isLoading={true} fallback={<BasicProfileSkeleton />}>
					<ProfileHeader
						company={companyData}
						isOwner={isOwner}
						updateCompany={updateCompanyData}
					/>
				</AutoSkeleton>
			) : (
				<ProfileHeader
					company={companyData}
					isOwner={isOwner}
					updateCompany={updateCompanyData}
				/>
			)}

			<div className="container mx-auto px-4 py-6">
				<Tabs
					defaultValue={isOwner ? "about" : "home"}
					value={activeTab}
					onValueChange={handleTabChange}
					className="w-full"
				>
					<div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-4 shadow-sm">
						<TabsList className="grid w-full grid-cols-6 mb-2 rounded-xl bg-gray-100/80 backdrop-blur-sm">
							{!isOwner && (
								<TabsTrigger value="home" className="rounded-lg">
									Home
								</TabsTrigger>
							)}
							<TabsTrigger value="about" className="rounded-lg">
								About
							</TabsTrigger>
							<TabsTrigger value="posts" className="rounded-lg">
								Posts
							</TabsTrigger>
							<TabsTrigger value="funding" className="rounded-lg">
								Funding
							</TabsTrigger>
							<TabsTrigger value="people" className="rounded-lg">
								People
							</TabsTrigger>
							<TabsTrigger value="news" className="rounded-lg">
								News
							</TabsTrigger>
						</TabsList>
					</div>

					<div
						className="tab-content-wrapper transition-all duration-300 ease-in-out"
						style={{ minHeight: tabContentHeight }}
					>
						{!isOwner && (
							<TabsContent
								value="home"
								className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
								onAnimationEnd={(e) => {
									setTabContentHeight(`${e.target.scrollHeight}px`);
								}}
							>
								{renderSection("home", HomeSection, {
									company: companyData,
									isOwner: false,
									updateCompany: updateCompanyData,
								})}
							</TabsContent>
						)}

						<TabsContent
							value="about"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							{renderSection("about", AboutSection, {
								company: companyData,
								isOwner,
								updateCompany: updateCompnanyItem,
								updateCompanyProfile: updateCompanyProfile,
								deleteCompanyProduct: deleteCompanyProduct,
							})}
						</TabsContent>

						<TabsContent
							value="posts"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							{renderSection("posts", PostsSection, {
								company: companyData,
								isOwner,
							})}
						</TabsContent>

						<TabsContent
							value="funding"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							{renderSection("funding", FundingSection, {
								company: companyData,
								isOwner,
								updateCompany: updateCompanyData,
							})}
						</TabsContent>

						<TabsContent
							value="people"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							{renderSection("people", PeopleSection, {
								company: companyData,
								isOwner,
								updateCompany: updateCompnanyItem,
								deletePersonnel: deleteCompanyPersonnel,
							})}
						</TabsContent>

						<TabsContent
							value="news"
							className="mt-6 space-y-6 animate-in fade-in-50 slide-in-from-bottom-3 duration-500"
							onAnimationEnd={(e) => {
								setTabContentHeight(`${e.target.scrollHeight}px`);
							}}
						>
							{renderSection("news", NewsSection, {
								company: companyData,
								isOwner,
								updateCompany: updateCompanyData,
							})}
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
}

export default function CompanyProfile(props) {
	return (
		<LoadingProvider>
			<CompanyProfileContent {...props} />
		</LoadingProvider>
	);
}
