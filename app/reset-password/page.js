"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPassword() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await axios.post(
			`${process.env.NEXT_PUBLIC_SERVER}/reset-password`,
			{ token, password },
			{
				withCredentials: true,
			},
		);
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Reset Your Password</h2>
			<input
				type="password"
				placeholder="Enter your new password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type="submit">Update Password</button>
		</form>
	);
}
