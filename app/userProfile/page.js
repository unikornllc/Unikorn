import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserProfile() {
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");
	let redirectPath = null;
	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_SERVER}/getCurrentUser`,
			{
				params: {},
				headers: {
					cookie: cookie || "",
				},
			},
		);
		const user = res.data.user;

		if (user && user.username) {
			redirectPath = `/userProfile/${user.username}`;
		} else {
			redirectPath = "/signin";
		}
	} catch (error) {
		console.log(error);
		if (error.response && error.response.status === 401) {
			console.error("Unauthorized or Bad Request:", error.response.status);
			redirectPath = "/signin";
		} else {
			console.error("Error fetching user data:", error.message);
		}
	} finally {
		if (redirectPath) {
			redirect(redirectPath);
		}
	}
}
