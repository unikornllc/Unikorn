"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const ResetPasswordContent = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/reset-password`,
				{ token, password },
				{
					withCredentials: true,
				},
			);
			// Handle success response
			console.log("Password reset successful");
		} catch (error) {
			// Handle error
			console.error("Password reset failed:", error);
		}
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
};

const LoadingFallback = () => (
	<div className="flex justify-center items-center h-64">
		<div className="animate-pulse">
			<div className="h-8 bg-gray-200 rounded mb-4"></div>
			<div className="h-10 bg-gray-200 rounded mb-4"></div>
			<div className="h-10 bg-gray-200 rounded"></div>
		</div>
	</div>
);

const ResetPassword = () => {
	return (
		<Suspense fallback={<LoadingFallback />}>
			<ResetPasswordContent />
		</Suspense>
	);
};

export default ResetPassword;
