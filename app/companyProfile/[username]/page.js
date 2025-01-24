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
						console.log("response", response.data.tier);
						company.hunter = response.data.tier;
					});
			} catch (err) {
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getTier`, {
						headers: {
							cookie: cookie || "",
						},
					})
					.then((response) => {
						response.data.tier == "Standard"
							? (company.hunter = false)
							: (company.hunter = true);
					});
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
