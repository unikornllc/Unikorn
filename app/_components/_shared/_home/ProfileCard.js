import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import { Button } from "@/app/_components/_ui/Button";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ProfileCard({ profile, isCompany }) {
	const [userFile, setUserFile] = useState(null);
	useEffect(() => {
		if (isCompany) {
			return;
		}
		const fetchUserFile = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getFile`,
					{
						params: {
							username: profile.account.username,
							fileName: "profile_picture",
						},
						withCredentials: true,
					},
				);
				const data = response.data;
				if (data && data.fileContent) {
					const imageSrc = `data:${data.mimeType};base64,${data.fileContent}`;
					setUserFile(imageSrc);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		fetchUserFile();
	}, []);
	return (
		<Card className="md:col-span-1">
			<CardHeader>
				<CardTitle>{isCompany ? "Company Profile" : "User Profile"}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center">
					<Avatar className="w-24 h-24 mb-4">
						<AvatarImage
							src={userFile || "/placeholder.svg"}
							alt={profile.name}
						/>
						<AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<h2 className="text-xl font-semibold text-indigo-900">
						{profile.name}
					</h2>
					<p className="text-sm text-indigo-600">@{profile.account.username}</p>
					<div className="mt-2 w-full px-2">
						<p className="text-center text-gray-600 text-sm leading-relaxed break-words hyphens-auto">
							{profile.description && profile.description.length > 150
								? `${profile.description.substring(0, 150)}...`
								: profile.description}
							{profile.description && profile.description.length > 150 && (
								<button
									onClick={() => {
										window.location.href = isCompany
											? "/company/profile?tab=about"
											: "/user/profile?tab=about";
									}}
									className="ml-1 text-indigo-600 hover:text-indigo-800 underline text-sm font-medium inline-block"
								>
									Show more
								</button>
							)}
						</p>
					</div>
					<div className="mt-4 flex justify-center space-x-2">
						<Button
							variant="outline"
							onClick={() => {
								window.location.href = isCompany
									? "/company/profile"
									: "/user/profile";
							}}
						>
							Edit Profile
						</Button>
						<Button>{isCompany ? "Raise Funds" : "Invest Now"}</Button>
					</div>
				</div>
				<div className="mt-6 grid grid-cols-2 gap-4">
					<div className="text-center">
						<p className="text-2xl font-bold text-indigo-900">
							{isCompany ? 0 : 0}
						</p>
						<p className="text-sm text-gray-600">
							{isCompany ? "Followers" : "Following"}
						</p>
					</div>
					<div className="text-center">
						{/* <p className="text-sm text-gray-600">Tier</p> */}
						<p className="text-2xl font-bold text-indigo-900">{profile.tier}</p>
					</div>
					{/* <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-900">
                            {isCompany ? profile.investorCount : profile.investmentCount}
                        </p>
                        <p className="text-sm text-gray-600">{isCompany ? "Investors" : "Investments"}</p>
                    </div> */}
				</div>
			</CardContent>
		</Card>
	);
}
