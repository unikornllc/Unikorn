"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
const signIn = async (email, password) => {
	return await axios.post(
		`${process.env.NEXT_PUBLIC_SERVER}/signIn`,
		{
			email,
			password,
		},
		{ withCredentials: true },
	);
};
export default function SignIn() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const handleSignIn = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(false);
		setSuccess(false);
		try {
			const res = await signIn(email, password);
			setSuccess(true);
			setMessage("Signed in successfully");
			router.push("/userHome");
		} catch (error) {
			setError(true);
			setMessage("Invalid email or password");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fff0db]">
			<div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
				<h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
					Sign In
				</h2>
				<form onSubmit={handleSignIn} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<div className="mt-1 relative rounded-md shadow-sm">
							<input
								id="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<div className="mt-1 relative rounded-md shadow-sm">
							<input
								type="password"
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-[#7e57c2] hover:bg-[#8e23e7] text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						{loading ? "Signing in..." : "Sign In"}
					</button>
				</form>
				<div className="text-center mt-4">
					<p className="text-sm text-gray-500">or sign up with</p>
					<div className="flex justify-center gap-4 mt-2">
						<button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow">
							<FaFacebook className="text-blue-600 h-6 w-6" />
						</button>
						<a href={`${process.env.NEXT_PUBLIC_SERVER}/auth/google`}>
							<button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow">
								<FcGoogle className="text-red-500 h-6 w-6" />
							</button>
						</a>
					</div>
				</div>
				{error && <p className="text-red-500 text-sm mt-4">{message}</p>}
				{success && <p className="text-green-500 text-sm mt-4">{message}</p>}
			</div>
			<div className="mt-4 text-sm text-gray-500">
				Don’t have an account?{" "}
				<div className="mt-4 text-sm text-gray-500">
					Are you a user?{" "}
					<Link href="/signup/user" className="text-blue-500 hover:underline">
						Sign up
					</Link>
				</div>
				<div className="mt-4 text-sm text-gray-500">
					Are you a company?{" "}
					<Link
						href="/signup/company"
						className="text-blue-500 hover:underline"
					>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
}
