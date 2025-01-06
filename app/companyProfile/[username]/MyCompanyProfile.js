"use client";
import React, { useState } from "react";
import axios from "axios";
import GeneralInfo from "@/app/_components/_company_profile/GeneralInfo";
import BoardMembers from "@/app/_components/_company_profile/BoardMembers";
import FounderInfo from "@/app/_components/_company_profile/FounderInfo";
import ProductInformation from "@/app/_components/_company_profile/ProductInformation";
import Activity from "@/app/_components/_company_profile/Activity";
import CompanyFiles from "@/app/_components/_company_profile/CompanyFiles";
import Advisors from "@/app/_components/_company_profile/Advisors";

const MyCompanyProfile = ({ company }) => {
	const [companyData, setCompanyData] = useState(company);

	const handleUpdate = async (fieldName, fieldValue) => {
		try {
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/updateCompanyProfile`,
				{
					fieldName,
					fieldValue,
				},
				{
					withCredentials: true,
				},
			);
			setCompanyData(res.data.company);
		} catch (error) {
			console.error("Error updating company data:", error);
		}
	};

	if (!companyData) {
		return <div>Loading...</div>;
	}
	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-bold mb-4">{companyData.name}</h1>
			<GeneralInfo company={companyData} onUpdate={handleUpdate} />
			<BoardMembers members={company.board_members} onUpdate={handleUpdate} />
			<Advisors advisors={company.advisors} onUpdate={handleUpdate} />
			<FounderInfo founder={company.founders} onUpdate={handleUpdate} />
			<ProductInformation
				productInformationList={company.product_information}
				onUpdate={handleUpdate}
			/>
			<Activity activities={company.activites} onUpdate={handleUpdate} />
			<CompanyFiles files={company.company_file} onUpdate={handleUpdate} />
		</div>
	);
};

export default MyCompanyProfile;
// "use client";
// import React from "react";
// import GeneralInfo from "@/app/_components/_company_profile/GeneralInfo";
// import BoardMembers from "@/app/_components/_company_profile/BoardMembers";
// import FounderInfo from "@/app/_components/_company_profile/FounderInfo";
// import ProductInformation from "@/app/_components/_company_profile/ProductInformation";
// import Activity from "@/app/_components/_company_profile/Activity";
// import CompanyFiles from "@/app/_components/_company_profile/CompanyFiles";
// import Advisors from "@/app/_components/_company_profile/Advisors";

// const MyCompanyProfile = ({ company }) => {
// 	if (!company) {
// 		return <div>Loading...</div>;
// 	}
// 	return (
// 		<div className="container mx-auto">
// 			<h1 className="text-2xl font-bold mb-4">{company.name}</h1>
// 			<GeneralInfo company={company} />
// 			<BoardMembers members={company.board_members} />
// 			<Advisors advisors={company.advisors} />
// 			<FounderInfo founder={company.founders} />
// 			<ProductInformation
// 				productInformationList={company.product_information}
// 			/>
// 			<Activity activities={company.activites} />
// 			<CompanyFiles files={company.company_file} />
// 		</div>
// 	);
// };

// export default MyCompanyProfile;
