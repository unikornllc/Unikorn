"use client";
import { useEffect, useState } from "react";
import ChatInterface from "../_components/chat/ChatInterface.js";
import axios from "axios";

export default function ChatTestPage() {
	const [username, setUsername] = useState("temp");
	const [accountType, setAccountType] = useState(null);
	const [accountData, setAccountData] = useState(null);

	useEffect(() => {
		const fetchAccountData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getCurrentUser`,
					{ withCredentials: true },
				);

				// Handle both user and company accounts from single API
				if (response.data && response.data.user && response.data.user.account) {
					setUsername(response.data.user.account.username);
					setAccountType("user");
					setAccountData(response.data.user);
				} else if (response.data && response.data.company && response.data.company.account) {
					setUsername(response.data.company.account.username);
					setAccountType("company");
					setAccountData(response.data.company);
				}
			} catch (error) {
				console.error("Error fetching account data:", error);
			}
		};

		fetchAccountData();
	}, []);

	return (
		<div className="h-full flex flex-1 overflow-hidden">
			<ChatInterface 
				userId={username} 
				username={username} 
				accountType={accountType}
				accountData={accountData}
			/>
		</div>
	);
}
