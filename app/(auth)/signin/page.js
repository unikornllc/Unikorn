"use client";

import axios from "axios";
import { useEffect } from "react";
import SignIn from "../../_components/_auth/_signin/SignIn.js";
import { useRouter } from "next/navigation";

export default function UserProfile() {
	const router = useRouter();

	useEffect(() => {
		const authenticateUser = async () => {
			await axios
				.post(
					`${process.env.NEXT_PUBLIC_SERVER}/api/signin`,
					{},
					{
						withCredentials: true,
						validateStatus: (status) => status < 500,
					},
				)
				.then((res) => {
					if (res.status === 200) {
						router.push("/home");
					}
				})
				.catch((error) => {
					if (!error.response) {
						console.error("Network error:", error.message);
					}
				});
		};
		authenticateUser();
	}, [router]);

	return <SignIn />;
}
