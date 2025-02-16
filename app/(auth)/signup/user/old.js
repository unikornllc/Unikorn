"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		description: "",
		title: "Mr",
	});

	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [usernameTaken, setUsernameTaken] = useState(false);
	const [emailTaken, setEmailTaken] = useState(false);
	const [suggestedUsernames, setSuggestedUsernames] = useState([]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		const suggestUsername = async () => {
			if (
				!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
				formData.name == ""
			)
				return;

			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/suggestUsername`,
					{ params: { email: formData.email, name: formData.name } },
				);
				console.log(response.data.usernameSuggestions);
				if (!usernameTaken) {
					setSuggestedUsernames(response.data.usernameSuggestions);
				}
			} catch (e) {
				console.error("Error suggesting username", e);
			}
		};

		const timeoutId = setTimeout(suggestUsername, 500);
		return () => clearTimeout(timeoutId);
	}, [formData.email, formData.name]);

	const handleUsernameSuggestion = (suggestedUsername) => {
		setFormData((prev) => ({ ...prev, username: suggestedUsername }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		if (usernameTaken) {
			setMessage("Username is already taken.");
			setLoading(false);
			return;
		}
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createUser`,
				{ formData },
				{ withCredentials: true },
			);
			//console.log(formData);
			if (response.status == 200) {
				setMessage("Signup successful!");
				setFormData({
					name: "",
					username: "",
					email: "",
					password: "",
					confirmPassword: "",
					description: "",
					title: "Mr",
				});
				router.push("/api/checkEmail");
				//console.log(response.cookies);
			} else {
				setMessage("Signup failed.");
			}
		} catch (error) {
			console.log(error.response.data.message);
			setMessage(error.response.data.message);
		} finally {
			setLoading(false);
			setFormData((prev) => ({
				...prev,
				password: "",
				confirmPassword: "",
			}));
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
							placeholder={formData.name}
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
							placeholder={formData.email}
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						/>
						{emailTaken && (
							<p className="text-red-500 text-sm mt-1">
								An account exists with this email.
							</p>
						)}
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
							placeholder={formData.username}
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
						/>
						{usernameTaken && (
							<p className="text-red-500 text-sm mt-1">
								Username is already taken.
							</p>
						)}
						{suggestedUsernames.map((suggestedUsername, index) => (
							<a
								key={index}
								type="button"
								onClick={() => handleUsernameSuggestion(suggestedUsername)}
								className="px-4 py-2 rounded-lg cursor-pointer underline text-blue-700"
							>
								{suggestedUsername}
							</a>
						))}
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
							Confirm Password
						</label>
						<input
							name="confirmPassword"
							type="password"
							value={formData.confirmPassword}
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
							placeholder={formData.description}
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
							placeholder={formData.title}
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
