import React, { useState, useEffect } from "react";
import { InvestmentForm } from "./inv";

export function FundingComponent({ companyUsername }) {
	const [fundingData, setFundingData] = useState(null);
	const [tab, setTab] = useState("Invest"); // 'Invest' or 'Offer'
	const fetchActiveFunding = async () => {
		try {
			await axios
				.get(`${process.env.NEXT_PUBLIC_SERVER}/raisingFunds/company/active`, {
					params: { username: companyUsername },
					withCredentials: true,
				})
				.then((response) => {
					setFundingData(response.data);
					console.log(response);
				});
		} catch (err) {
			console.error("Error fetching:", err);
		}
	};
	useEffect(() => {
		fetchActiveFunding();
	}, [companyUsername]);

	if (!fundingData) {
		return;
	}

	return (
		<div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-semibold mb-4">
				Investment Opportunity in {companyName}
			</h2>

			<div className="mt-6">
				<nav className="flex">
					<button
						onClick={() => setTab("Invest")}
						className={`mr-4 px-4 py-2 ${
							tab === "Invest" ? "bg-blue-500 text-white" : "bg-gray-200"
						} rounded`}
					>
						Invest at Fixed Price
					</button>
					<button
						onClick={() => setTab("Offer")}
						className={`px-4 py-2 ${
							tab === "Offer" ? "bg-blue-500 text-white" : "bg-gray-200"
						} rounded`}
					>
						Make an Offer
					</button>
				</nav>

				{tab === "Invest" ? (
					<InvestmentForm mode="invest" fundingData={fundingData} />
				) : (
					<InvestmentForm mode="offer" fundingData={fundingData} />
				)}
			</div>
		</div>
	);
}
