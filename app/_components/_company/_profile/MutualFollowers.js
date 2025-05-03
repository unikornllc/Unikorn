"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";

export default function MutualFollowers() {
	const mutualFollowers = [
		{
			id: "1",
			name: "Alex Johnson",
			avatar: "/placeholder.svg",
			role: "CEO at TechCorp",
		},
		{
			id: "2",
			name: "Sarah Williams",
			avatar: "/placeholder.svg",
			role: "Investor",
		},
		{
			id: "3",
			name: "Michael Brown",
			avatar: "/placeholder.svg",
			role: "Founder at StartupX",
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Mutual Connections</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{mutualFollowers.map((follower) => (
						<div key={follower.id} className="flex items-center gap-3">
							<Avatar>
								<AvatarImage
									src={follower.avatar || "/placeholder.svg"}
									alt={follower.name}
								/>
								<AvatarFallback>{follower.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<p className="font-medium truncate">{follower.name}</p>
								<p className="text-xs text-gray-500 truncate">
									{follower.role}
								</p>
							</div>
						</div>
					))}
					<Button
						variant="ghost"
						size="sm"
						className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
					>
						View all mutual connections
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
