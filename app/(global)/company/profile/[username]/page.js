import CompanyProfile from "@/app/_components/_company/_profile/CompanyProfile";
import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getCompanyData(id) {
	return {
		id,
		account: {
			id,
			username: "techcorp",
			email: "info@techcorp.com",
		},
		name: "TechCorp Solutions",
		description:
			"TechCorp is a leading provider of innovative software solutions for businesses of all sizes. We specialize in cloud computing, artificial intelligence, and enterprise software that helps companies streamline operations and drive growth.",
		website: "https://techcorp.example.com",
		founded: new Date(2015, 5, 12),
		type: "Private",
		hqLocation: "San Francisco, CA",
		industry: "Technology",
		verified: true,
		tier: "Holder",
		personnel: [
			{
				id: "p1",
				name: "Sarah Johnson",
				role: "Founder",
				crunchBaseLink: "https://crunchbase.com/person/sarah-johnson",
				companyId: id,
				userId: "u1",
			},
			{
				id: "p2",
				name: "Michael Chen",
				role: "Advisor",
				crunchBaseLink: "https://crunchbase.com/person/michael-chen",
				companyId: id,
			},
		],
		productInformation: [
			{
				id: "prod1",
				product: "CloudFlow",
				market: "Enterprise Software",
				partnerships: ["Microsoft", "Amazon Web Services", "Google Cloud"],
				companyId: id,
			},
		],
		financials: {
			id: "f1",
			valuation: 25000000,
			investors: ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator"],
			totalFundingAmount: 12000000,
			fundingRounds: [
				{
					id: "fr1",
					type: "Seed",
					fundingAmount: 2000000,
					roundDate: new Date(2016, 3, 15),
					leadInvestors: ["Y Combinator"],
					financialId: "f1",
				},
				{
					id: "fr2",
					type: "Series A",
					fundingAmount: 10000000,
					roundDate: new Date(2018, 7, 22),
					leadInvestors: ["Sequoia Capital", "Andreessen Horowitz"],
					financialId: "f1",
				},
			],
			companyId: id,
		},
		activities: [
			{
				id: "a1",
				title: "Product Launch",
				description:
					"We're excited to announce the launch of our new product, CloudFlow 2.0, with enhanced AI capabilities.",
				companyId: id,
				date: new Date(2023, 3, 15),
			},
			{
				id: "a2",
				title: "New Partnership",
				description:
					"TechCorp has partnered with Microsoft to deliver integrated cloud solutions for enterprise customers.",
				companyId: id,
				date: new Date(2023, 2, 10),
			},
		],
		raisingFunds: [
			{
				id: "rf1",
				equityPercentage: 8,
				fundingAmount: 5000000,
				pricePerPortion: 500000,
				remainingPortions: 6,
				totalPortions: 10,
				date: new Date(2023, 2, 1),
				status: "Active",
				envelopeId: "env123",
				companyId: id,
			},
		],
	};
}

export default async function CompanyPage({ params }) {
	const { username } = await params;
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");
	const companyData = await getCompanyData(username);

	const include = {
		// founders: true,
		// keyEmployees: true,
		personnel: { include: { user: true } },
		productInformation: true,
		financials: true,
		activities: true,
		raisingFunds: true,
	};

	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_SERVER}/api/getOneCompanyProfile`,
			{
				params: { username, include },
				headers: {
					cookie: cookie || "",
				},
			},
		);
		// const he = await axios.get(
		// 	`${process.env.NEXT_PUBLIC_SERVER}/api/getMyFollowers`,
		// 	{
		// 		headers: {
		// 			cookie: cookie || "",
		// 		},
		// 	},
		// );
		// console.log("he", he.data);
		const isCurrentCompany = res.data.isCurrentCompany;
		let company = res.data.company;

		if (!isCurrentCompany) {
			try {
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/api/isFollowing`, {
						params: { username: company.account.username, isUser: false },
						headers: {
							cookie: cookie || "",
						},
					})
					.then((response) => {
						company.isFollowing = response.data.isFollowing;
					});
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/api/getTier`, {
						headers: {
							cookie: cookie || "",
						},
					})
					.then((response) => {
						company.tier = response.data.tier;
					});
			} catch (err) {
				console.error(err);
			}
		}
		return (
			<div>
				{isCurrentCompany ? (
					<CompanyProfile company={company} isOwner={true} />
				) : (
					<CompanyProfile company={company} isOwner={false} />
				)}
			</div>
		);
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Unauthorized or Bad Request:", error.response.status);
			redirect("/signin");
		} else {
			console.error("Error fetching profile data:", error.message);
			//redirect("/404");
		}
	}
}
