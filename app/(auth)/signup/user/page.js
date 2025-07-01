"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Users, Building2 } from "lucide-react";
import dynamic from "next/dynamic";
const PhoneInput = dynamic(
	() => import("react-phone-input-2").then((mod) => mod.default),
	{ ssr: false },
);
import "react-phone-input-2/lib/style.css";
import { Controller } from "react-hook-form";

export default function UserSignUp() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialType = searchParams.get("type") || "Investor";
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setError,
		clearErrors,
		setValue,
	} = useForm();

	const [usernameSuggestions, setUsernameSuggestions] = useState([]);
	const [signUpError, setSignUpError] = useState(null);
	const [signUpSuccess, setSignUpSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userType, setUserType] = useState(initialType);
	const debounceTimer = useRef(null);

	const MIN_USERNAME_LENGTH = 4;
	const MAX_USERNAME_LENGTH = 20;

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

	const checkForUsernameSuggestions = useCallback(async () => {
		const name = watch("name") || "";
		const email = watch("email") || "";
		const username = watch("username") || "";

		if (
			name.length >= MIN_USERNAME_LENGTH &&
			email.length >= MIN_USERNAME_LENGTH
		) {
			if (!username || username.length === 0 || errors.username) {
				try {
					const response = await axios.get(
						`${process.env.NEXT_PUBLIC_SERVER}/api/suggestUsername`,
						{ params: { email, name } },
					);
					setUsernameSuggestions(response.data.usernameSuggestions || []);
				} catch (error) {
					console.error("Error fetching username suggestions:", error);
				}
			}
		} else {
			setUsernameSuggestions([]);
		}
	}, [watch, errors.username, MIN_USERNAME_LENGTH]);

	const handleInputChange = useCallback(
		(field) => async (e) => {
			const value = e.target.value;
			if (field === "email" || field === "name") {
				clearTimeout(debounceTimer.current);
				debounceTimer.current = setTimeout(() => {
					checkForUsernameSuggestions();
				}, 300);
			}
		},
		[checkForUsernameSuggestions],
	);
	// const handleInputChange = useCallback(
	// 	(field) => async (e) => {
	// 		const value = e.target.value;
	// 		if (value.length > 4 && (field === "email" || field === "name")) {
	// 			clearTimeout(debounceTimer.current);
	// 			debounceTimer.current = setTimeout(async () => {
	// 				const username = watch("username");
	// 				let needSuggestions = false;
	// 				if (!username) {
	// 					needSuggestions = true;
	// 				} else {
	// 					// Check if the current username is valid
	// 					const { valid, message } = await checkUsername(username);
	// 					if (!valid) {
	// 						needSuggestions = true;
	// 					}
	// 				}

	// 				if (needSuggestions) {
	// 					try {
	// 						const name = watch("name");
	// 						const email = watch("email");
	// 						if (
	// 							name.length >= MIN_USERNAME_LENGTH &&
	// 							email.length >= MIN_USERNAME_LENGTH
	// 						) {
	// 							const response = await axios.get(
	// 								`${process.env.NEXT_PUBLIC_SERVER}/api/suggestUsername`,
	// 								{ params: { email, name } },
	// 							);
	// 							setUsernameSuggestions(response.data.usernameSuggestions || []);
	// 						}
	// 					} catch (error) {
	// 						console.error("Error fetching username suggestions:", error);
	// 					}
	// 				} else {
	// 					setUsernameSuggestions([]);
	// 				}
	// 			}, 300);
	// 		}
	// 	},
	// 	[watch, checkUsername],
	// );

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

	useEffect(() => {
		const checkAutofill = setTimeout(() => {
			const name = watch("name");
			const email = watch("email");
			if (name || email) {
				checkForUsernameSuggestions();
			}
		}, 500);

		return () => clearTimeout(checkAutofill);
	}, [watch, checkForUsernameSuggestions]);

	const handleInputFocus = useCallback(() => {
		checkForUsernameSuggestions();
	}, [checkForUsernameSuggestions]);

	const onSubmit = async (formData) => {
		setLoading(true);
		setSignUpError(null);

		if (formData.password !== formData.confirmPassword) {
			setSignUpError("Passwords do not match.");
			setLoading(false);
			return;
		}

		try {
			console.log("formData:", formData);
			const isInvestor = userType === "Investor";
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createAccount`,
				{ formData, role: "User", isInvestor }, // Use isInvestor instead of userType
				{
					withCredentials: true,
				},
			);
			if (response.status === 200) {
				setSignUpSuccess(true);
				// router.push("/checkEmail");
				router.push("/stayTuned");
			} else {
				setSignUpError("Signup failed. Please try again.");
				setLoading(false);
			}
		} catch (error) {
			setSignUpError(
				error.response?.data?.message || "An error occurred. Please try again.",
			);
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
								Sign Up as {userType}
							</CardTitle>
							<CardDescription className="text-center text-indigo-700">
								Create your account to start your journey
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
							{/* User Type Toggle */}
							<div className="space-y-3">
								<Label className="text-indigo-900 font-medium">
									What describes you best?
								</Label>
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => setUserType("Investor")}
										className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
											userType === "Investor"
												? "border-indigo-500 bg-indigo-50 text-indigo-700"
												: "border-gray-300 bg-white text-gray-600 hover:border-indigo-300"
										}`}
									>
										<Users className="w-5 h-5" />
										<span className="font-medium">Investor</span>
									</button>
									<button
										type="button"
										onClick={() => setUserType("Founder")}
										className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
											userType === "Founder"
												? "border-purple-500 bg-purple-50 text-purple-700"
												: "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
										}`}
									>
										<Building2 className="w-5 h-5" />
										<span className="font-medium">Founder</span>
									</button>
								</div>
							</div>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="name" className="text-indigo-900">
											Name
										</Label>
										<Input
											id="name"
											{...register("name", { required: "Name is required" })}
											onChange={handleInputChange("name")}
											onFocus={handleInputFocus}
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
											Email
										</Label>
										<Input
											id="email"
											type="email"
											{...register("email", { required: "Email is required" })}
											onChange={handleInputChange("email")}
											onFocus={handleInputFocus}
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
											minLength: {
												value: 4,
												message: "Username must be at least 4 characters",
											},
											maxLength: {
												value: 20,
												message: "Username must be at most 20 characters",
											},
										})}
										onBlur={handleUsernameBlur}
										onFocus={handleInputFocus}
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
														setValue("username", suggestion);
														clearErrors("username");
														setUsernameSuggestions([]);
													}}
												>
													{suggestion}
												</li>
											))}
										</ul>
									)}
								</div>
								{/* <div className="space-y-2">
									<Label htmlFor="mobileNumber" className="text-indigo-900">
										Mobile Number
									</Label>
									<Controller
										name="mobileNumber"
										control={control}
										rules={{ required: "Mobile number is required" }}
										render={({ field }) => (
											<PhoneInput
												country={"us"}
												value={field.value}
												onChange={(value) => field.onChange(value)}
												placeholder="Enter mobile number"
												inputStyle={{
													width: "100%",
													height: "40px",
													fontSize: "16px",
													borderRadius: "4px",
													border: "1px solid #93c5fd",
													paddingLeft: "60px",
													outline: "none",
													transition: "border 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
												}}
												containerStyle={{
													width: "100%",
												}}
												buttonStyle={{
													border: "1px solid #93c5fd",
													borderRight: "none",
													backgroundColor: "#fff",
													width: "55px",
												}}
												onFocus={(e) => {
													e.target.style.border = "1px solid #6366f1";
													e.target.style.boxShadow = "0 0 0 2px #6366f1";
												}}
												onBlur={(e) => {
													e.target.style.border = "1px solid #93c5fd";
													e.target.style.boxShadow = "none";
												}}
											/>
										)}
									/>
									{errors.mobileNumber && (
										<span className="text-red-500 text-sm">{errors.mobileNumber.message}</span>
									)}
								</div> */}
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="password" className="text-indigo-900">
											Password
										</Label>
										<Input
											id="password"
											type="password"
											{...register(
												"password",
												// 	, {
												// 	required: "Password is required",
												// 	minLength: {
												// 		value: 8,
												// 		message: "Password must be at least 8 characters",
												// 	},
												// 	pattern: {
												// 		value:
												// 			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
												// 		message:
												// 			"Password must contain uppercase, lowercase, number, and special character",
												// 	},
												// }
											)}
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
											onFocus={handleInputFocus}
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
										Description
									</Label>
									<Textarea
										id="description"
										{...register("description")}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="linkedin" className="text-indigo-900">
										LinkedIn Profile URL (Optional)
									</Label>
									<Input
										id="linkedin"
										type="url"
										placeholder="https://linkedin.com/in/your-profile"
										{...register("linkedin", {
											pattern: {
												value: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
												message: "Please enter a valid LinkedIn profile URL"
											}
										})}
										className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
									/>
									{errors.linkedin && (
										<span className="text-red-500 text-sm">
											{errors.linkedin.message}
										</span>
									)}
								</div>
								{/* <div className="space-y-2">
									<Label htmlFor="title" className="text-indigo-900">
										Title
									</Label>
									<select
										name="title"
										id="title"
										{...register("title")}
										className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
									>
										<option value="Mr">Mr</option>
										<option value="Ms">Ms</option>
										<option value="Mrs">Mrs</option>
									</select>
									
								</div> */}
								<Button
									type="submit"
									className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
									disabled={loading}
								>
									{loading ? "Signing Up..." : "Sign Up"}
								</Button>
							</form>
							{/* <div className="relative">
								<div className="absolute inset-0 flex items-center">
									<Separator className="w-full" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-white px-2 text-muted-foreground">
										Or sign up with
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
							</div> */}
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
