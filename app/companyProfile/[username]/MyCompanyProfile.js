"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import GeneralInfo from "@/app/_components/_company/_company_profile/GeneralInfo";
import BoardMembers from "@/app/_components/_company/_company_profile/BoardMembers";
import FounderInfo from "@/app/_components/_company/_company_profile/FounderInfo";
import ProductInformation from "@/app/_components/_company/_company_profile/ProductInformation";
import Activity from "@/app/_components/_company/_company_profile/Activity";
import CompanyFiles from "@/app/_components/_company/_company_profile/CompanyFiles";
import Advisors from "@/app/_components/_company/_company_profile/Advisors";
import KeyEmployees from "@/app/_components/_company/_company_profile/KeyEmployees";
import { FundingComponentCompany } from "@/app/_components/_company/_funding/FundingComponentCompany";

const MyCompanyProfile = ({ company }) => {
	const [companyData, setCompanyData] = useState(company);
	const [activeFund, setActiveFund] = useState(company.activeFund);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fundingDetails, setFundingDetails] = useState({
		equityPercentage: "",
		fundingAmount: "",
		date: "",
	});

	const handleUpdate = async (fieldName, fieldValue) => {
		try {
			const res = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/updateCompanyProfile`,
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

	const handleRaiseFunds = async () => {
		try {
			const { equityPercentage, fundingAmount, date } = fundingDetails;
			if (!equityPercentage || !fundingAmount || !date) {
				alert("Please fill in all fields.");
				return;
			}

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/docusign`,
				{
					data: {
						equity: parseFloat(equityPercentage),
						price: parseInt(fundingAmount),
						date,
					},
				},
				{
					withCredentials: true,
				},
			);

			if (res.data.redirectUrl) {
				window.open(res.data.redirectUrl, "_blank");
			}
		} catch (error) {
			console.error("Error initiating fundraising:", error);
			alert("An error occurred while starting the fundraising process.");
		}
	};

	if (!companyData) {
		return <div>Loading...</div>;
	}
	return (
		<div className="container mx-auto">
			<h1 className="text-2xl font-bold mb-4">{companyData.name}</h1>
			{activeFund ? (
				<div>
					<FundingComponentCompany
						companyUsername={companyData.account.username}
					/>
				</div>
			) : (
				<button
					className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
					onClick={() => setIsModalOpen(true)}
				>
					Raise Funds
				</button>
			)}

			{isModalOpen && (
				<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
					<div className="bg-white p-6 rounded shadow-md w-1/3">
						<h2 className="text-xl font-bold mb-4">Raise Funds</h2>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Equity Percentage (%)
							</label>
							<input
								type="number"
								className="w-full border px-3 py-2 rounded"
								value={fundingDetails.equityPercentage}
								onChange={(e) =>
									setFundingDetails((prev) => ({
										...prev,
										equityPercentage: e.target.value,
									}))
								}
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">
								Funding Amount ($)
							</label>
							<input
								type="number"
								className="w-full border px-3 py-2 rounded"
								value={fundingDetails.fundingAmount}
								onChange={(e) =>
									setFundingDetails((prev) => ({
										...prev,
										fundingAmount: e.target.value,
									}))
								}
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Date</label>
							<input
								type="date"
								className="w-full border px-3 py-2 rounded"
								value={fundingDetails.date}
								onChange={(e) =>
									setFundingDetails((prev) => ({
										...prev,
										date: e.target.value,
									}))
								}
							/>
						</div>

						<div className="flex justify-end space-x-2">
							<button
								className="bg-gray-500 text-white px-4 py-2 rounded"
								onClick={() => setIsModalOpen(false)}
							>
								Cancel
							</button>
							<button
								className="bg-blue-500 text-white px-4 py-2 rounded"
								onClick={handleRaiseFunds}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
			{console.log()}
			<GeneralInfo company={companyData} onUpdate={handleUpdate} />
			<BoardMembers
				members={companyData.boardMembers}
				onUpdate={handleUpdate}
			/>
			<Advisors advisors={companyData.advisors} onUpdate={handleUpdate} />
			<FounderInfo founders={companyData.founders} onUpdate={handleUpdate} />
			<ProductInformation
				productInformationList={companyData.productInformation}
				onUpdate={handleUpdate}
			/>
			<Activity activities={companyData.activities} onUpdate={handleUpdate} />
			<KeyEmployees
				employees={companyData.keyEmployees}
				onUpdate={handleUpdate}
			/>
			<CompanyFiles files={companyData.company_file} onUpdate={handleUpdate} />
		</div>
	);
};

export default MyCompanyProfile;
