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
	BasicCardSkeleton,
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
	const defaultCompany = {
		id: company?.id || "new-company",
		name: company?.name || "New Company",
		description: company?.description || "Company description goes here",
		hqLocation: company?.hqLocation || "Location",
		founded: company?.founded || new Date().toISOString(),
		type: company?.type || "Private",
		industry: company?.industry || "Technology",
		website: company?.website || "https://example.com",
		tier: company?.tier || "Hunter",
		verified: company?.verified || false,
		activities: company?.activities || [],
		personnel: company?.personnel || [],
		productInformation: company?.productInformation || [],
		financials: company?.financials || null,
		raisingFunds: company?.raisingFunds || [],
		...company,
	};

	const [activeTab, setActiveTab] = useState(isOwner ? "about" : "home");
	const [companyData, setCompanyData] = useState(company);
	const {
		isLoading,
		setIsLoading,
		sectionLoading,
		setSectionLoading,
		initializeSections,
	} = useLoading();

	// Track which sections have been rendered at least once
	const [renderedSections, setRenderedSections] = useState({});

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

	// Function to fetch section data - replace with actual API calls
	const fetchSectionData = async (section) => {
		setSectionLoading(section, true);

		try {
			// Replace with actual API call based on section
			// const response = await axios.get(`/api/company/${companyData.id}/${section}`);
			// const data = response.data;
			// Update relevant part of companyData based on section

			// For now, just set loading to false after a brief delay
			setSectionLoading(section, false);
		} catch (error) {
			console.error(`Error fetching ${section} data:`, error);
			setSectionLoading(section, false);
		}
	};

	const handleTabChange = (value) => {
		setActiveTab(value);
		fetchSectionData(value);
	};

	// useEffect to mark sections as rendered after they've loaded
	// useEffect(() => {
	// 	const sectionsToUpdate = Object.keys(sectionLoading).filter(
	// 		(sectionName) =>
	// 			!sectionLoading[sectionName] && renderedSections[sectionName] === false,
	// 	);

	// 	if (sectionsToUpdate.length > 0) {
	// 		setRenderedSections((prev) => {
	// 			const updatedSections = { ...prev };
	// 			sectionsToUpdate.forEach((sectionName) => {
	// 				updatedSections[sectionName] = true;
	// 			});
	// 			return updatedSections;
	// 		});
	// 	}
	// }, [sectionLoading, renderedSections]);

	const renderSection = (sectionName, SectionComponent, props) => {
		const isCurrentlyLoading = sectionLoading[sectionName];
		const hasBeenRenderedBefore = renderedSections[sectionName];

		// If it's loading but has been rendered before, use AutoSkeleton
		// if (isCurrentlyLoading && hasBeenRenderedBefore) {
		// 	return (
		// 		<AutoSkeleton isLoading={true}>
		// 			<SectionComponent {...props} />
		// 		</AutoSkeleton>
		// 	);
		// }

		// // If it's loading and has never been rendered, use a basic skeleton
		// if (isCurrentlyLoading && !hasBeenRenderedBefore) {
		// 	return (
		// 		<div className="space-y-6">
		// 			{Array(2)
		// 				.fill(0)
		// 				.map((_, i) => (
		// 					<BasicCardSkeleton key={i} />
		// 				))}
		// 		</div>
		// 	);
		// }

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
					<TabsList className="grid w-full grid-cols-6 mb-8">
						{!isOwner && <TabsTrigger value="home">Home</TabsTrigger>}
						<TabsTrigger value="about">About</TabsTrigger>
						<TabsTrigger value="posts">Posts</TabsTrigger>
						<TabsTrigger value="funding">Funding</TabsTrigger>
						<TabsTrigger value="people">People</TabsTrigger>
						<TabsTrigger value="news">News</TabsTrigger>
					</TabsList>

					{!isOwner && (
						<TabsContent value="home">
							{renderSection("home", HomeSection, {
								company: companyData,
								isOwner: false,
								updateCompany: updateCompanyData,
							})}
						</TabsContent>
					)}

					<TabsContent value="about">
						{renderSection("about", AboutSection, {
							company: companyData,
							isOwner,
							updateCompany: updateCompnanyItem,
							updateCompanyProfile: updateCompanyProfile,
							deleteCompanyProduct: deleteCompanyProduct,
						})}
					</TabsContent>

					<TabsContent value="posts">
						{renderSection("posts", PostsSection, {
							company: companyData,
							isOwner,
						})}
					</TabsContent>

					<TabsContent value="funding">
						{renderSection("funding", FundingSection, {
							company: companyData,
							isOwner,
							updateCompany: updateCompanyData,
						})}
					</TabsContent>

					<TabsContent value="people">
						{renderSection("people", PeopleSection, {
							company: companyData,
							isOwner,
							updateCompany: updateCompnanyItem,
							deletePersonnel: deleteCompanyPersonnel,
						})}
					</TabsContent>

					<TabsContent value="news">
						{renderSection("news", NewsSection, {
							company: companyData,
							isOwner,
							updateCompany: updateCompanyData,
						})}
					</TabsContent>
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
