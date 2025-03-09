"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { CalendarDays } from "lucide-react";
import { InlineWidget } from "react-calendly";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/_ui/Dialog";

export default function UserHeader({ user, isOwnProfile }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedUser, setEditedUser] = useState(user);

	const handleSave = async () => {
		// In a real app, send a PUT request to update the user data
		// await fetch(`/api/user/${user.id}`, { method: 'PUT', body: JSON.stringify(editedUser) })
		setIsEditing(false);
	};

	return (
		<div className="relative">
			<div className="h-48 bg-gray-200">
				{user.coverImage && (
					<Image
						src={user.coverImage || "/placeholder.svg"}
						alt={`${user.name} cover`}
						layout="fill"
						objectFit="cover"
					/>
				)}
			</div>
			<div className="absolute bottom-0 left-8 transform translate-y-1/2">
				<div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden">
					{user.profileImage ? (
						<Image
							src={user.profileImage || "/placeholder.svg"}
							alt={user.name}
							width={128}
							height={128}
							objectFit="cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 text-4xl font-bold">
							{user.name.charAt(0)}
						</div>
					)}
				</div>
			</div>
			<div className="mt-16 ml-44">
				<h1 className="text-3xl font-bold">{user.name}</h1>
				<p className="text-gray-600">@{user.username}</p>
				<div className="mt-4 flex space-x-4">
					{isOwnProfile ? (
						isEditing ? (
							<>
								<Button onClick={handleSave}>Save</Button>
								<Button variant="outline" onClick={() => setIsEditing(false)}>
									Cancel
								</Button>
							</>
						) : (
							<Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
						)
					) : (
						<>
							<Button>Follow</Button>
							{user.calendlyIntegration && (
								<Dialog>
									{console.log(user.calendlyIntegration)}
									<DialogTrigger asChild>
										<Button variant="outline">
											<CalendarDays className="mr-2 h-4 w-4" />
											Schedule Meeting
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Schedule a Meeting</DialogTitle>
											<DialogDescription>
												Choose a time slot that works for you to meet with{" "}
												{user.name}.
											</DialogDescription>
										</DialogHeader>
										<div className="mt-4 h-[500px]">
											<InlineWidget url={user.calendlyIntegration.url} />
										</div>
									</DialogContent>
								</Dialog>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
