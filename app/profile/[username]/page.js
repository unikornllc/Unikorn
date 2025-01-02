import axios from "axios";
import MyProfile from "./my-profile";
import OtherProfile from "./other-profile";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function UserProfile({ params }) {
	const { username } = await params;
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");
	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_SERVER}/isCurrentUser`,
			{
				params: { username },
				headers: {
					cookie: cookie || "",
				},
			},
		);
		const isCurrentUser = res.data.isCurrentUser;
		return (
			<div>
				{isCurrentUser ? <MyProfile /> : <OtherProfile username={username} />}
			</div>
		);
	} catch (error) {
		if (error.response && error.response.status === 401) {
			console.error("Unauthorized or Bad Request:", error.response.status);
			redirect("/signin");
		} else {
			console.error("Error fetching user data:", error.message);
			redirect("/404");
		}
	}
}
