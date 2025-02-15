"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "../../_ui/Button";
import { Input } from "../../_ui/Input";
import { Label } from "../../_ui/Label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "../../_ui/Card";
import { Alert, AlertDescription, AlertTitle, AlertCircle } from "../../_ui/Alert";
import { Separator } from "../../_ui/Separator";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const [signInError, setSignInError] = useState(null);
	const [signUpSuccess, setSignUpSuccess] = useState(false);

	const [loading, setLoading] = useState(false);

	const onSubmit = async ({ email, password }) => {
		setLoading(true);
		setSignInError(null);

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/signin`,
				{ email, password },
				{ withCredentials: true },
			);
			if (response.status === 200) {
				setSignUpSuccess(true);
				router.push("/home");
			} else {
				setSignInError("Invalid email or password");
				setLoading(false);
			}
		} catch (error) {
			setSignInError(
				error.response?.data?.message || "An error occurred. Please try again.",
			);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
			<div className="container mx-auto px-4 py-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
						<CardHeader className="space-y-1">
							<CardTitle className="text-3xl font-bold text-center text-indigo-900">
								Sign In
							</CardTitle>
							<CardDescription className="text-center text-indigo-700">
								Enter your credentials to access your account
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{signUpSuccess && (
								<Alert className="bg-green-50 text-green-700 border-green-500">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Success</AlertTitle>
									<AlertDescription>
										Sign in successful! Redirecting...
									</AlertDescription>
								</Alert>
							)}
							{signInError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Login Failed</AlertTitle>
									<AlertDescription>{signInError}</AlertDescription>
								</Alert>
							)}
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email" className="text-indigo-900">
										Email
									</Label>
									<Input
										id="email"
										placeholder="you@example.com"
										{...register("email", { required: "Email is required" })}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
									{errors.email && (
										<span className="text-red-500 text-sm">
											{errors.email.message}
										</span>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="password" className="text-indigo-900">
										Password
									</Label>
									<Input
										id="password"
										type="password"
										{...register("password", {
											required: "Password is required",
										})}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
									{errors.password && (
										<span className="text-red-500 text-sm">
											{errors.password.message}
										</span>
									)}
								</div>
								<Button
									type="submit"
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
									disabled={loading}
								>
									{loading ? "Signing In..." : "Sign In"}
								</Button>
							</form>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-white px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>
							<div className="flex justify-center gap-4 mt-2">
								<button
									onClick={() => console.log("Facebook sign-in clicked")}
									className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow"
								>
									<FaFacebook className="text-blue-600 h-6 w-6" />
								</button>
								<a href={`${process.env.NEXT_PUBLIC_SERVER}/auth/google`}>
									<button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full shadow">
										<FcGoogle className="h-6 w-6" />
									</button>
								</a>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col space-y-4">
							<div className="text-sm text-center text-indigo-700">
								Don't have an account?
							</div>
							<div className="flex justify-between w-full">
								<Link
									href="/signup/user"
									className="text-sm text-indigo-600 hover:underline"
								>
									Sign up as Investor
								</Link>
								<Link
									href="/signup/company"
									className="text-sm text-indigo-600 hover:underline"
								>
									Sign up as Company
								</Link>
							</div>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
