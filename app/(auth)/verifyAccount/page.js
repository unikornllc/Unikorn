"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Verify() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		axios
			.get(`${process.env.NEXT_PUBLIC_SERVER}/api/verifyAccount`, {
				withCredentials: true,
			})
			.then((response) => setMessage(response.data))
			.catch((error) =>
				setMessage(error.response.data.error || "Verification failed."),
			)
			.finally(() => {
				setLoading(false);
			});
	});

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fff0db]">
			<h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
				Email Verification
			</h1>
			{loading ? (
				<div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
			) : (
				<>
					<p className="text-lg text-center text-gray-600">{message}</p>
					{message.includes("successfully verified") && (
						<Link
							className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
							href="/signin"
						>
							Go to Login
						</Link>
					)}
				</>
			)}
		</div>
	);
}
