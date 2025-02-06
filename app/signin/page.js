"use client";

import axios from "axios";
import { useEffect } from "react";
import SignIn from "../_components/_signin/SignIn.js";
import { useRouter } from "next/navigation";

export default function UserProfile() {
	const router = useRouter();

	useEffect(() => {
		const authenticateUser = async () => {
			try {
				await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/api/signin`,
					{},
					{
						withCredentials: true,
					},
				);
				router.push("/userHome");
			} catch (error) {
				if (error.response && error.response.status === 400) {
					console.error("Unauthorized or Bad Request:", error.response.status);
				} else {
					console.error("Error fetching user data:", error.message);
				}
			}
		};
		authenticateUser();
	}, [router]);

	return <SignIn />;
}
