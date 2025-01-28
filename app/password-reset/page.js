// pages/reset-password.js

import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {
	const router = useRouter();
	const { token } = router.query;

	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const res = await fetch("/reset-password", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token, password }),
		});
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
