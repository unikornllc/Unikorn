import axios from "axios";
import { headers } from "next/headers";
import SignIn from "../_components/_signin/SignIn";
import { redirect } from "next/navigation";

export default async function UserProfile() {
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");
	const userAgent = headersInstance.get("user-agent") || "";
	const xForwardedFor = headersInstance.get("x-forwarded-for") || "";

	try {
		await axios.post(
			`${process.env.NEXT_PUBLIC_SERVER}/test`,
			{},
			{
				headers: {
					cookie: cookie || "",
					"User-Agent": userAgent,
					"X-Forwarded-For": xForwardedFor,
				},
			},
		);
	} catch (error) {
		if (error.response && error.response.status === 400) {
			console.error("Unauthorized or Bad Request:", error.response.status);
			return <SignIn />;
		} else {
			console.error("Error fetching user data:", error.message);
			// redirect("/404");
		}
	}
	redirect("/userHome");
}
