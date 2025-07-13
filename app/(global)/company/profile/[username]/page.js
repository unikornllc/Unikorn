import CompanyProfile from "@/app/_components/_company/_profile/CompanyProfile";
import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CompanyPage({ params }) {
	const { username } = await params;
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");

	const include = {
		// founders: true,
		// keyEmployees: true,
		// personnel: { include: { user: true } },
		productInformation: true,
		activities: true,
		// raisingFunds: true,
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
		company.username = company.account.username;
		await axios
			.get(`${process.env.NEXT_PUBLIC_SERVER}/api/getCompanyPersonnel`, {
				params: { username: company.account.username },
				headers: {
					cookie: cookie || "",
				},
			})
			.then((response) => {
				company.personnel = response.data.personnel;
			});

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
