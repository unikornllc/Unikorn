"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "../../../_components/_ui/Button";
import { Input } from "../../../_components/_ui/Input";
import { Label } from "../../../_components/_ui/Label";
import { Textarea } from "../../../_components/_ui/Textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "../../../_components/_ui/Card";
import { Switch } from "../../../_components/_ui/Switch";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	AlertCircle,
} from "../../../_components/_ui/Alert";
import { Separator } from "../../../_components/_ui/Separator";
import Link from "next/link";
import Navbar from "../../../_components/_ui/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function CompanySignUp() {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setError,
		clearErrors,
	} = useForm();

	const [usernameSuggestions, setUsernameSuggestions] = useState([]);
	const [signUpError, setSignUpError] = useState(null);
	const [signUpSuccess, setSignUpSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const debounceTimer = useRef(null);

	const MIN_USERNAME_LENGTH = 5;
	const MAX_USERNAME_LENGTH = 16;

	const checkUsername = useCallback(async (username) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/checkUsername`,
				{ params: { username } },
			);
			return response.data;
		} catch (error) {
			console.error("Error checking username:", error);
			return { valid: false, message: "Error checking username" };
		}
	}, []);

	const handleInputChange = useCallback(
		(field) => async (e) => {
			const value = e.target.value;
			if (value.length > 4 && (field === "email" || field === "name")) {
				clearTimeout(debounceTimer.current);
				debounceTimer.current = setTimeout(async () => {
					const username = watch("username");
					let needSuggestions = false;
					if (!username) {
						needSuggestions = true;
					} else {
						// Check if the current username is valid
						const { valid, message } = await checkUsername(username);
						if (!valid) {
							needSuggestions = true;
						}
					}

					if (needSuggestions) {
						try {
							const name = watch("name");
							const email = watch("email");
							if (
								name.length >= MIN_USERNAME_LENGTH &&
								email.length >= MIN_USERNAME_LENGTH
							) {
								const response = await axios.get(
									`${process.env.NEXT_PUBLIC_SERVER}/api/suggestUsername`,
									{ params: { email, name } },
								);
								setUsernameSuggestions(response.data.usernameSuggestions || []);
							}
						} catch (error) {
							console.error("Error fetching username suggestions:", error);
						}
					} else {
						setUsernameSuggestions([]);
					}
				}, 300);
			}
		},
		[watch, checkUsername],
	);

	const handleUsernameBlur = useCallback(
		async (e) => {
			const username = e.target.value;
			if (username) {
				const { valid, message } = await checkUsername(username);
				if (!valid) {
					setError("username", { type: "manual", message });
					// Show suggestions when username is invalid
					try {
						const name = watch("name");
						const email = watch("email");
						if (
							name.length >= MIN_USERNAME_LENGTH &&
							email.length >= MIN_USERNAME_LENGTH
						) {
							const response = await axios.get(
								`${process.env.NEXT_PUBLIC_SERVER}/api/suggestUsername`,
								{ params: { email, name } },
							);
							setUsernameSuggestions(response.data.usernameSuggestions || []);
						}
					} catch (error) {
						console.error("Error fetching username suggestions:", error);
					}
				} else {
					clearErrors("username");
					setUsernameSuggestions([]);
				}
			}
		},
		[checkUsername, setError, clearErrors, watch],
	);

	const onSubmit = async (formData) => {
		setLoading(true);
		setSignUpError(null);

		if (formData.password !== formData.confirmPassword) {
			setSignUpError("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createCompany`,
				{ formData },
				{
					withCredentials: true,
				},
			);
			if (response.status === 200) {
				setSignUpSuccess(true);
				router.push("/checkEmail");
			} else {
				setSignUpError("Signup failed. Please try again.");
			}
		} catch (error) {
			setSignUpError(
				error.response?.data?.message || "An error occurred. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
			<Navbar />
			<div className="container mx-auto px-4 py-20">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl">
						<CardHeader>
							<CardTitle className="text-3xl font-bold text-center text-indigo-900">
								Sign Up as Company
							</CardTitle>
							<CardDescription className="text-center text-indigo-700">
								Create your company account to start fundraising
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{signUpSuccess && (
								<Alert className="bg-green-50 text-green-700 border-green-500">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Success</AlertTitle>
									<AlertDescription>
										Sign up successful! Redirecting...
									</AlertDescription>
								</Alert>
							)}
							{signUpError && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>{signUpError}</AlertDescription>
								</Alert>
							)}
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name" className="text-indigo-900">
											Company Name
										</Label>
										<Input
											id="name"
											{...register("name", {
												required: "Company name is required",
											})}
											onChange={handleInputChange("name")}
											className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
										/>
										{errors.name && (
											<span className="text-red-500 text-sm">
												{errors.name.message}
											</span>
										)}
									</div>
									<div className="space-y-2">
										<Label htmlFor="email" className="text-indigo-900">
											Company Email
										</Label>
										<Input
											id="email"
											type="email"
											{...register("email", { required: "Email is required" })}
											onChange={handleInputChange("email")}
											className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
										/>
										{errors.email && (
											<span className="text-red-500 text-sm">
												{errors.email.message}
											</span>
										)}
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="username" className="text-indigo-900">
										Username
									</Label>
									<Input
										id="username"
										{...register("username", {
											required: "Username is required",
										})}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
									{errors.username && (
										<span className="text-red-500 text-sm">
											{errors.username.message}
										</span>
									)}
									{usernameSuggestions.length > 0 && (
										<ul className="mt-2 bg-white border border-indigo-300 rounded-md shadow-sm">
											{usernameSuggestions.map((suggestion, index) => (
												<li
													key={index}
													className="px-3 py-2 hover:bg-indigo-50 cursor-pointer text-indigo-700"
													onClick={() => {
														document.getElementById("username").value =
															suggestion;
														setUsernameSuggestions([]);
													}}
												>
													{suggestion}
												</li>
											))}
										</ul>
									)}
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="password" className="text-indigo-900">
											Password
										</Label>
										<Input
											id="password"
											type="password"
											{...register("password", {
												required: "Password is required",
												minLength: {
													value: 8,
													message: "Password must be at least 8 characters",
												},
												pattern: {
													value:
														/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
													message:
														"Password must contain uppercase, lowercase, number, and special character",
												},
											})}
											className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
										/>
										{errors.password && (
											<span className="text-red-500 text-sm">
												{errors.password.message}
											</span>
										)}
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="confirmPassword"
											className="text-indigo-900"
										>
											Confirm Password
										</Label>
										<Input
											id="confirmPassword"
											type="password"
											{...register("confirmPassword", {
												required: "Please confirm your password",
												validate: (val) =>
													watch("password") === val || "Passwords do not match",
											})}
											className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
										/>
										{errors.confirmPassword && (
											<span className="text-red-500 text-sm">
												{errors.confirmPassword.message}
											</span>
										)}
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="description" className="text-indigo-900">
										Company Description
									</Label>
									<Textarea
										id="description"
										{...register("description")}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="website" className="text-indigo-900">
										Website
									</Label>
									<Input
										id="website"
										type="url"
										{...register("website")}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="foundedDate" className="text-indigo-900">
											Founded Date
										</Label>
										<Input
											id="foundedDate"
											type="date"
											{...register("foundedDate")}
											className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="hqLocation" className="text-indigo-900">
											HQ Location
										</Label>
										<Input
											id="hqLocation"
											{...register("hqLocation")}
											className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="industry" className="text-indigo-900">
										Industry
									</Label>
									<Input
										id="industry"
										{...register("industry")}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="files" className="text-indigo-900">
										Upload Files
									</Label>
									<Input
										id="files"
										type="file"
										multiple
										{...register("files")}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div className="flex items-center space-x-2">
									<Switch id="isHunter" {...register("isHunter")} />
									<Label htmlFor="isHunter" className="text-indigo-900">
										Are you a hunter?
									</Label>
								</div>
								<Button
									type="submit"
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
									disabled={loading}
								>
									{loading ? "Signing Up..." : "Sign Up"}
								</Button>
							</form>
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-white px-2 text-muted-foreground">
										Or sign up with
									</span>
								</div>
							</div>
							<div className="flex justify-center">
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
						</CardContent>
						<CardFooter className="flex justify-center">
							<div className="text-sm text-indigo-700">
								Already have an account?{" "}
								<Link
									href="/signin"
									className="text-indigo-600 hover:underline"
								>
									Sign in
								</Link>
							</div>
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
