"use client";
import { useEffect, useState } from "react";
import ChatInterface from "../_components/chat/ChatInterface.js";
import axios from "axios";

export default function ChatTestPage() {
	const [username, setUsername] = useState("temp");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getCurrentUser`,
					{ withCredentials: true },
				);

				if (res.data && res.data.user && res.data.user.account) {
					setUsername(res.data.user.account.username);
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUser();
	}, []);

	return (
		<div className="h-full flex flex-1 overflow-hidden">
			<ChatInterface userId={username} username={username} />
		</div>
	);
}
