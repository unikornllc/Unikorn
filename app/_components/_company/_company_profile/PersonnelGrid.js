"use client";

import { PencilIcon } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import { Badge } from "@/app/_components/_ui/Badge";

export default function PersonnelGrid({ personnel, onEdit }) {
	const getInitials = (name) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const getColorForRole = (role) => {
		const roles = {
			Founder: "bg-purple-100 text-purple-800 border-purple-300",
			KeyEmployee: "bg-blue-100 text-blue-800 border-blue-300",
			BoardMember: "bg-amber-100 text-amber-800 border-amber-300",
			Advisor: "bg-green-100 text-green-800 border-green-300",
		};

		return roles[role] || "bg-gray-100 text-gray-800 border-gray-300";
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{personnel.map((person) => (
				<div
					key={person.id}
					className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
				>
					<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
						<button
							onClick={() => onEdit(person)}
							className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
							aria-label={`Edit ${person.name}`}
						>
							<PencilIcon className="h-4 w-4 text-gray-600" />
						</button>
					</div>

					<div className="p-6">
						<div className="flex flex-col items-center text-center">
							{person.user ? (
								<Avatar className="h-20 w-20 mb-4">
									<AvatarImage
										src={person.user.avatar || "/placeholder.svg"}
										alt={person.name}
									/>
									<AvatarFallback className="text-lg">
										{getInitials(person.name)}
									</AvatarFallback>
								</Avatar>
							) : (
								<div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-500 text-lg font-medium">
									{getInitials(person.name)}
								</div>
							)}

							<h3 className="text-lg font-semibold mb-1">{person.name}</h3>

							<Badge
								variant="outline"
								className={`mb-3 ${getColorForRole(person.role)}`}
							>
								{person.role}
							</Badge>

							{person.user && (
								<p className="text-sm text-gray-500 mb-3">
									@{person.user.account.username}
								</p>
							)}

							<a
								href={person.crunchBaseLink}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-blue-600 hover:underline"
							>
								View on CrunchBase
							</a>
						</div>
					</div>

					<div className="h-2 w-full bg-gradient-to-r from-primary/80 to-primary"></div>
				</div>
			))}
		</div>
	);
}
