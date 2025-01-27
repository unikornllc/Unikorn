import axios from "axios";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import EditableUserProfile from "./EditableUserProfile";
import UserProfileView from "./UserProfileView";

export default async function UserProfile({ params }) {
	const { username } = await params;
	const headersInstance = await headers();
	const cookie = headersInstance.get("cookie");

	const include = {
		expertise: true,
		education: true,
		interest: true,
		corporate_experience: true,
		startup_experience: true,
		certifications_courses: true,
		language: true,
		social_media: true,
		calendly_integration: true,
	};

	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_SERVER}/getOneUser`,
			{
				params: { username, include },
				headers: {
					cookie: cookie || "",
				},
			},
		);
		const isCurrentUser = res.data.isCurrentUser;
		const user = res.data.user;
		if (!isCurrentUser) {
			try {
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/isFollowing`, {
						params: { username: user.username },
						headers: {
							cookie: cookie || "",
						},
					})
					.then((response) => {
						user.isFollowing = response.data.isFollowing;
					});
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getTier`, {
						headers: {
							cookie: cookie || "",
						},
					})
					.then((response) => {
						user.tier = response.data.tier;
						if (user.tier == "Standard" || user.tier == "Holder") {
							user.calendly_integration = null;
						}
					});
			} catch (err) {
				console.error("Error fetching user data:", err);
			}
		}
		return (
			<div>
				{isCurrentUser ? (
					<EditableUserProfile user={res.data.user} editable />
				) : (
					<UserProfileView user={res.data.user} />
				)}
			</div>
		);
	} catch (error) {
		// if (error.response && error.response.status === 401) {
		// 	console.error("Unauthorized or Bad Request:", error.response.status);
		// 	redirect("/signin");
		// } else {
		// 	console.error("Error fetching user data:", error.message);
		// 	// redirect("/404");
		// }
	}
}
