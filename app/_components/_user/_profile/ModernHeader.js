import React from "react";
import ProfileCoverEdit from "@/app/_components/_shared/_profile/ProfileCoverEdit";
import { Badge } from "@/app/_components/_ui/Badge";
import { CheckCircle, MessageSquare, Users } from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import { useState } from "react";
import axios from "axios";
import { followAccount, unfollowAccount } from "@/app/_utils/_api/followAPIs";

const ModernHeader = ({ user, editable }) => {
	const { name, username, title, tier, unikornVerified, description } = user;
	const [isFollowing, setIsFollowing] = useState(user.isFollowing);
	const [followerCount, setFollowerCount] = useState(128);

	const handleFollow = async () => {
		try {
			await followAccount({ username: company.username }).then(() => {
				setIsFollowing(true);
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handleUnfollow = async () => {
		try {
			await unfollowAccount({ username: company.username }).then(() => {
				setIsFollowing(false);
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<ProfileCoverEdit account={{ username, name }} editable={editable} />

			<div className="container mx-auto px-4 relative">
				<div className="flex flex-col md:flex-row items-end gap-6 pt-6 mb-4">
					<div className="w-full md:w-auto md:ml-44 flex flex-col md:flex-row items-center md:items-start gap-2 flex-wrap mt-24 md:mt-0">
						<div className="flex items-center gap-2">
							<h1 className="text-3xl font-bold text-center md:text-left">
								{name}
							</h1>
						</div>

						{unikornVerified && (
							<Badge
								variant="outline"
								className="bg-blue-50 text-blue-600 border-blue-200"
							>
								<CheckCircle className="h-3.5 w-3.5 mr-1" />
								Verified
							</Badge>
						)}

						{tier === "Pro" && (
							<Badge
								variant="outline"
								className="bg-purple-50 text-purple-600 border-purple-200"
							>
								Pro Member
							</Badge>
						)}
					</div>

					<div className="w-full md:w-auto md:ml-auto mt-4 md:mt-0 flex justify-center md:justify-end">
						{!editable ? (
							<div className="flex gap-3">
								<Button
									variant={isFollowing ? "outline" : "default"}
									onClick={isFollowing ? handleUnfollow : handleFollow}
								>
									{isFollowing ? "Following" : "Follow"}
								</Button>
								<Button variant="outline">
									<MessageSquare className="h-4 w-4 mr-2" />
									Message
								</Button>
							</div>
						) : null}
					</div>
				</div>

				<div className="ml-0 md:ml-44 space-y-4">
					<p className="text-gray-600 max-w-3xl">{description}</p>
				</div>
			</div>
		</div>
	);
};

export default ModernHeader;
