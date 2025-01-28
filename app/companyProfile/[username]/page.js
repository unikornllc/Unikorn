import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MyCompanyProfile from "./MyCompanyProfile";
import ViewCompanyProfile from "./ViewCompanyProfile";

export default async function CompanyProfile({ params }) {
	const { username } = await params;
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");

	const include = {
		founders: true,
		key_employees: true,
		product_information: true,
		financials: true,
		activities: true,
		raising_Funds: true,
	};

	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_SERVER}/getOneCompanyProfile`,
			{
				params: { username, include },
				headers: {
					cookie: cookie || "",
				},
			},
		);
		const isCurrentCompany = res.data.isCurrentCompany;
		const company = res.data.company;
		for (let i = 0; i < company.raising_Funds.length; ++i) {
			if (company.raising_Funds[i].status == "Active") {
				company.activeFund = true;
				break;
			}
		}

		if (!isCurrentCompany) {
			try {
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/isFollowingCompany`, {
						params: { username: company.username },
						headers: {
							cookie: cookie || "",
						},
					})
					.then((response) => {
						company.isFollowing = response.data.isFollowing;
					});
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getCompanyTier`, {
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
					<MyCompanyProfile company={company} />
				) : (
					<ViewCompanyProfile company={company} />
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
