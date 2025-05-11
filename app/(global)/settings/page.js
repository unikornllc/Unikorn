"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { Switch } from "@/app/_components/_ui/Switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/_ui/Select";
import {
	ArrowLeft,
	Save,
	User,
	Calendar,
	Bell,
	Shield,
	CreditCard,
	Globe,
} from "lucide-react";
import Link from "next/link";
import CalendlyIntegration from "@/app/_components/_shared/_calendly/CalendlyIntegration";
import { Badge } from "@/app/_components/_ui/Badge";

export default function SettingsPage() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("account");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		title: "",
		description: "",
		notifications: {
			email: true,
			push: true,
			marketing: false,
		},
		language: "en",
		timezone: "UTC",
	});

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getCurrentUser`,
					{
						withCredentials: true,
					},
				);
				setUser(response.data);
				setFormData({
					name: response.data.name || "",
					email: response.data.email || "",
					title: response.data.title || "",
					description: response.data.description || "",
					notifications: {
						email: true,
						push: true,
						marketing: false,
					},
					language: "en",
					timezone: "UTC",
				});
			} catch (error) {
				console.error("Error fetching user data:", error);
				// Redirect to login if not authenticated
				router.push("/login");
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [router]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleNotificationChange = (key, value) => {
		setFormData((prev) => ({
			...prev,
			notifications: {
				...prev.notifications,
				[key]: value,
			},
		}));
	};

	const handleSaveAccount = async () => {
		try {
			setLoading(true);
			// Mock API call
			console.log("Saving account data:", formData);
			// In a real app, you would call an API here
			// await axios.put(`${process.env.NEXT_PUBLIC_SERVER}/api/updateUser`, formData, {
			//   withCredentials: true,
			// })
		} catch (error) {
			console.error("Error updating user data:", error);
		} finally {
			setLoading(false);
		}
	};

	// Mock user data for development
	const mockUser = {
		id: "user-123",
		account: { username: "johndoe" },
		name: "John Doe",
		description:
			"Experienced entrepreneur and investor with a passion for technology startups.",
		title: "Mr",
		tier: "Pro",
		email: "john.doe@example.com",
		calendlyIntegration: {
			id: "cal1",
			calendlyVisibility: "PUBLIC",
			allowedIndustries: ["Technology", "Finance"],
			minYearsOfOperation: 2,
			allowedRoles: ["INVESTOR", "ENTREPRENEUR"],
		},
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10 px-4">
			<div className="flex items-center mb-8">
				<Link href="/user/profile">
					<Button variant="ghost" className="mr-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Profile
					</Button>
				</Link>
				<h1 className="text-3xl font-bold">Settings</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
				<div className="space-y-4">
					<div className="flex flex-col h-auto space-y-1 bg-transparent">
						<button
							onClick={() => setActiveTab("account")}
							className={`flex items-center justify-start px-4 py-2 rounded-md text-left ${
								activeTab === "account" ? "bg-gray-100" : "hover:bg-gray-50"
							}`}
						>
							<User className="mr-2 h-4 w-4" />
							Account
						</button>
						<button
							onClick={() => setActiveTab("integrations")}
							className={`flex items-center justify-start px-4 py-2 rounded-md text-left ${
								activeTab === "integrations"
									? "bg-gray-100"
									: "hover:bg-gray-50"
							}`}
						>
							<Calendar className="mr-2 h-4 w-4" />
							Integrations
						</button>
						<button
							onClick={() => setActiveTab("notifications")}
							className={`flex items-center justify-start px-4 py-2 rounded-md text-left ${
								activeTab === "notifications"
									? "bg-gray-100"
									: "hover:bg-gray-50"
							}`}
						>
							<Bell className="mr-2 h-4 w-4" />
							Notifications
						</button>
						<button
							onClick={() => setActiveTab("privacy")}
							className={`flex items-center justify-start px-4 py-2 rounded-md text-left ${
								activeTab === "privacy" ? "bg-gray-100" : "hover:bg-gray-50"
							}`}
						>
							<Shield className="mr-2 h-4 w-4" />
							Privacy & Security
						</button>
						<button
							onClick={() => setActiveTab("billing")}
							className={`flex items-center justify-start px-4 py-2 rounded-md text-left ${
								activeTab === "billing" ? "bg-gray-100" : "hover:bg-gray-50"
							}`}
						>
							<CreditCard className="mr-2 h-4 w-4" />
							Billing
						</button>
						<button
							onClick={() => setActiveTab("preferences")}
							className={`flex items-center justify-start px-4 py-2 rounded-md text-left ${
								activeTab === "preferences" ? "bg-gray-100" : "hover:bg-gray-50"
							}`}
						>
							<Globe className="mr-2 h-4 w-4" />
							Preferences
						</button>
					</div>
				</div>

				<div className="space-y-6">
					{activeTab === "account" && (
						<Card>
							<CardHeader>
								<CardTitle>Account Information</CardTitle>
								<CardDescription>
									Update your personal information and profile details.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="name">Full Name</Label>
										<Input
											id="name"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											placeholder="Your full name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="email">Email Address</Label>
										<Input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder="Your email address"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="title">Title</Label>
										<Select
											value={formData.title}
											onValueChange={(value) =>
												setFormData({ ...formData, title: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select a title" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Mr">Mr</SelectItem>
												<SelectItem value="Mrs">Mrs</SelectItem>
												<SelectItem value="Ms">Ms</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											value={
												user?.account?.username || mockUser.account.username
											}
											disabled
											className="bg-gray-50"
										/>
										<p className="text-sm text-gray-500">
											Username cannot be changed
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="description">Bio</Label>
									<Textarea
										id="description"
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										placeholder="Tell us about yourself"
										rows={4}
									/>
									<p className="text-sm text-gray-500">
										{formData.description.length}/600 characters
									</p>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={handleSaveAccount}
										disabled={loading}
										className="flex items-center gap-2"
									>
										<Save className="h-4 w-4" />
										Save Changes
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "integrations" && (
						<Card>
							<CardHeader>
								<CardTitle>Integrations</CardTitle>
								<CardDescription>
									Connect third-party services to enhance your experience.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<CalendlyIntegration user={user || mockUser} />
							</CardContent>
						</Card>
					)}

					{activeTab === "notifications" && (
						<Card>
							<CardHeader>
								<CardTitle>Notification Settings</CardTitle>
								<CardDescription>
									Manage how you receive notifications.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-medium">Email Notifications</h4>
											<p className="text-sm text-gray-500">
												Receive notifications via email
											</p>
										</div>
										<Switch
											checked={formData.notifications.email}
											onCheckedChange={(checked) =>
												handleNotificationChange("email", checked)
											}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-medium">Push Notifications</h4>
											<p className="text-sm text-gray-500">
												Receive notifications on your device
											</p>
										</div>
										<Switch
											checked={formData.notifications.push}
											onCheckedChange={(checked) =>
												handleNotificationChange("push", checked)
											}
										/>
									</div>
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-medium">Marketing Emails</h4>
											<p className="text-sm text-gray-500">
												Receive marketing and promotional emails
											</p>
										</div>
										<Switch
											checked={formData.notifications.marketing}
											onCheckedChange={(checked) =>
												handleNotificationChange("marketing", checked)
											}
										/>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={handleSaveAccount}
										disabled={loading}
										className="flex items-center gap-2"
									>
										<Save className="h-4 w-4" />
										Save Changes
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "privacy" && (
						<Card>
							<CardHeader>
								<CardTitle>Privacy & Security</CardTitle>
								<CardDescription>
									Manage your privacy settings and account security.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-medium">Profile Visibility</h4>
											<p className="text-sm text-gray-500">
												Control who can see your profile
											</p>
										</div>
										<Select defaultValue="public">
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select visibility" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="public">Public</SelectItem>
												<SelectItem value="private">Private</SelectItem>
												<SelectItem value="connections">
													Connections Only
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-medium">Two-Factor Authentication</h4>
											<p className="text-sm text-gray-500">
												Add an extra layer of security to your account
											</p>
										</div>
										<Button variant="outline">Enable 2FA</Button>
									</div>

									<div className="flex items-center justify-between">
										<div>
											<h4 className="font-medium">Change Password</h4>
											<p className="text-sm text-gray-500">
												Update your account password
											</p>
										</div>
										<Button variant="outline">Change Password</Button>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={handleSaveAccount}
										disabled={loading}
										className="flex items-center gap-2"
									>
										<Save className="h-4 w-4" />
										Save Changes
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{activeTab === "billing" && (
						<Card>
							<CardHeader>
								<CardTitle>Billing Information</CardTitle>
								<CardDescription>
									Manage your subscription and payment methods.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="bg-gray-50 p-4 rounded-lg">
									<div className="flex justify-between items-center">
										<div>
											<h4 className="font-medium">Current Plan</h4>
											<p className="text-sm text-gray-500">
												{user?.tier || mockUser.tier}
											</p>
										</div>
										<Badge
											variant={user?.tier === "Pro" ? "default" : "outline"}
										>
											{user?.tier === "Pro" ? "Active" : "Standard"}
										</Badge>
									</div>
								</div>

								{user?.tier === "Pro" && (
									<div className="space-y-4">
										<h4 className="font-medium">Payment Method</h4>
										<div className="flex items-center p-4 border rounded-lg">
											<CreditCard className="h-6 w-6 mr-4 text-gray-400" />
											<div>
												<p className="font-medium">•••• •••• •••• 4242</p>
												<p className="text-sm text-gray-500">Expires 12/2025</p>
											</div>
											<Button variant="ghost" className="ml-auto">
												Edit
											</Button>
										</div>
									</div>
								)}

								{user?.tier !== "Pro" && (
									<div className="text-center p-6">
										<h4 className="font-medium mb-2">Upgrade to Pro</h4>
										<p className="text-sm text-gray-500 mb-4">
											Get access to premium features and benefits
										</p>
										<Button>Upgrade Now</Button>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{activeTab === "preferences" && (
						<Card>
							<CardHeader>
								<CardTitle>Preferences</CardTitle>
								<CardDescription>Customize your experience.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label htmlFor="language">Language</Label>
										<Select
											value={formData.language}
											onValueChange={(value) =>
												setFormData({ ...formData, language: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select language" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="en">English</SelectItem>
												<SelectItem value="es">Spanish</SelectItem>
												<SelectItem value="fr">French</SelectItem>
												<SelectItem value="de">German</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="timezone">Timezone</Label>
										<Select
											value={formData.timezone}
											onValueChange={(value) =>
												setFormData({ ...formData, timezone: value })
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select timezone" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="UTC">UTC</SelectItem>
												<SelectItem value="EST">Eastern Time (EST)</SelectItem>
												<SelectItem value="CST">Central Time (CST)</SelectItem>
												<SelectItem value="PST">Pacific Time (PST)</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={handleSaveAccount}
										disabled={loading}
										className="flex items-center gap-2"
									>
										<Save className="h-4 w-4" />
										Save Changes
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
