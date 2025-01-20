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
import KeyEmployees from "@/app/_components/_company_profile/KeyEmployees";

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
			<BoardMembers
				members={companyData.board_members}
				onUpdate={handleUpdate}
			/>
			<Advisors advisors={companyData.advisors} onUpdate={handleUpdate} />
			<FounderInfo founders={companyData.founders} onUpdate={handleUpdate} />
			<ProductInformation
				productInformationList={companyData.product_information}
				onUpdate={handleUpdate}
			/>
			<Activity activities={companyData.activities} onUpdate={handleUpdate} />
			<KeyEmployees
				employees={companyData.key_employees}
				onUpdate={handleUpdate}
			/>
			<CompanyFiles files={companyData.company_file} onUpdate={handleUpdate} />
		</div>
	);
};

export default MyCompanyProfile;
