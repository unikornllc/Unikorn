"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TextInput = ({
	label,
	name,
	type = "text",
	value,
	onChange,
	placeholder,
	required,
	error,
}) => (
	<div className="mb-4">
		<label className="block text-sm font-medium text-gray-700">{label}</label>
		<input
			name={name}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			className={`block w-full px-4 py-2 text-gray-900 border ${
				error ? "border-red-500" : "border-gray-300"
			} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
		/>
		{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
	</div>
);

export default function Signup() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		description: "",
		website: "",
		file: null,
		founded: Date.now(),
		hqlocation: "",
		hunter: false,
		industry: "",
	});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [usernameTaken, setUsernameTaken] = useState(false);
	const [emailTaken, setEmailTaken] = useState(false);

	const handleChange = (e) => {
		const { name, value, files } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: files ? files[0] : value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		if (usernameTaken || emailTaken) {
			setMessage("Please resolve the issues before proceeding.");
			setLoading(false);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setMessage("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			console.log(formData);
			const { status } = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createCompany`,
				{ formData },
				{
					withCredentials: true,
				},
			);

			if (status === 200) {
				setMessage("Signup successful! Redirecting...");
				router.push("/api/checkEmail");
			} else {
				setMessage("Signup failed. Please try again.");
			}
		} catch (error) {
			setMessage(
				error.response?.data?.message || "An error occurred. Please try again.",
			);
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
					<TextInput
						label="Name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>
					<TextInput
						label="Email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange}
						required
						error={emailTaken ? "Email is already registered." : ""}
					/>
					<TextInput
						label="Username"
						name="username"
						value={formData.username}
						onChange={handleChange}
						required
						error={usernameTaken ? "Username is already taken." : ""}
					/>
					<TextInput
						label="Password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>
					<TextInput
						label="Confirm Password"
						name="confirmPassword"
						type="password"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
					/>
					<TextInput
						label="Description"
						name="description"
						value={formData.description}
						onChange={handleChange}
					/>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							File
						</label>
						<input
							type="file"
							name="file"
							onChange={handleChange}
							accept="image/*"
							className="block w-full text-gray-900 border border-gray-300 rounded-lg"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Title
						</label>
						<select
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg"
						>
							<option value="Mr">Mr</option>
							<option value="Ms">Ms</option>
							<option value="Mrs">Mrs</option>
						</select>
					</div>
					<TextInput
						label="Website"
						name="website"
						value={formData.website}
						onChange={handleChange}
						placeholder="https://example.com"
					/>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Founded
						</label>
						<input
							type="date"
							name="founded"
							value={new Date(formData.founded).toISOString().split("T")[0]}
							onChange={handleChange}
							className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg"
						/>
					</div>
					<TextInput
						label="HQ Location"
						name="hqlocation"
						value={formData.hqlocation}
						onChange={handleChange}
					/>
					<TextInput
						label="Industry"
						name="industry"
						value={formData.industry}
						onChange={handleChange}
					/>
					<div className="mb-4 flex items-center">
						<input
							type="checkbox"
							name="hunter"
							checked={formData.hunter}
							onChange={(e) =>
								handleChange({
									target: { name: "hunter", value: e.target.checked },
								})
							}
							className="mr-2"
						/>
						<label className="text-sm font-medium text-gray-700">
							Are you a hunter?
						</label>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-[#7e57c2] hover:bg-[#8e23e7] text-white font-bold py-2 px-4 rounded-lg"
					>
						{loading ? "Signing up..." : "Sign Up"}
					</button>
				</form>
				<p className="mt-4 text-sm text-gray-500">
					Already have an account?{" "}
					<Link href="/signin" className="text-blue-500 hover:underline">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
