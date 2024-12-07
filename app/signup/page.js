"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		description: "",
		title: "Mr",
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createUser`,
				{ formData },
				{ withCredentials: true },
			);

			if (response.status == 200) {
				setMessage("Signup successful!");
				setFormData({
					name: "",
					email: "",
					password: "",
					description: "",
					title: "Mr",
				});
				router.push("/checkEmail");
				console.log(response.cookies);
			} else {
				setMessage("Signup failed.");
			}
		} catch (error) {
			console.log(error);
			setMessage("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fff0db]">
			<div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
					Sign Up
				</h2>
				{message && <p className="mb-4 text-red-500">{message}</p>}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							name="name"
							value={formData.name}
							onChange={handleChange}
							required
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<input
							name="password"
							type="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Description
						</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleChange}
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						></textarea>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Title
						</label>
						<select
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="Mr">Mr</option>
							<option value="Ms">Ms</option>
							<option value="Mrs">Mrs</option>
						</select>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-[#7e57c2] hover:bg-[#8e23e7] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{loading ? "Signing up..." : "Sign Up"}
					</button>
				</form>
			</div>
			<p className="mt-4 text-sm text-gray-500">
				Return to{" "}
				<Link href="/signin" className="text-blue-500 hover:underline">
					login
				</Link>{" "}
				page?{" "}
			</p>
		</div>
	);
}
