import { formatDistanceToNow } from "date-fns";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import Link from "next/link";
import { getInitials } from "@/app/_utils/utils";

export default function CommentItem({ comment }) {
	const formattedDate = formatDistanceToNow(new Date(comment.createdAt), {
		addSuffix: true,
	});
	const authorName = comment.author?.username || "Unknown User";
	const authorId = comment.author?.id || "";
	const authorInitials = getInitials(authorName);
	const profilePicture = comment.author?.profilePicture || null;

	return (
		<div className="flex space-x-4 py-4 border-b last:border-b-0">
			<Link href={`/profile/${authorId}`}>
				<Avatar>
					{profilePicture ? (
						<AvatarImage
							src={profilePicture || "/placeholder.svg"}
							alt={authorName}
						/>
					) : (
						<AvatarFallback>{authorInitials}</AvatarFallback>
					)}
				</Avatar>
			</Link>
			<div className="flex-1">
				<div className="flex items-center mb-1">
					<Link
						href={`/profile/${authorId}`}
						className="font-medium hover:underline"
					>
						{authorName}
					</Link>
					<span className="text-xs text-muted-foreground ml-2">
						{formattedDate}
					</span>
				</div>
				<p className="text-sm">{comment.content}</p>
			</div>
		</div>
	);
}
