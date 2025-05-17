import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../_ui/Card.js";
import { Avatar, AvatarFallback } from "../_ui/Avatar.js";
import { Button } from "../_ui/Button.js";

export default function PostCard({ post }) {
	const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
		addSuffix: true,
	});

	const likesCount = post.likes?.length || 0;
	const commentsCount = post.comments?.length || 0;
	const repostsCount = post.reposts?.length || 0;

	const authorInitials =
		post.author?.username?.substring(0, 2).toUpperCase() || "UN";

	return (
		<Card className="overflow-hidden">
			<CardHeader className="pb-3">
				<div className="flex items-center space-x-3">
					<Avatar>
						<AvatarFallback>{authorInitials}</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-medium">
							{post.author?.username || "Unknown User"}
						</p>
						<p className="text-xs text-gray-500">{formattedDate}</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pb-4">
				{post.content && <p className="mb-3">{post.content}</p>}

				{post.type === "MEDIA" && post.media && post.media.length > 0 && (
					<div className="mt-3 rounded-md overflow-hidden">
						{post.media.map((media) => (
							<div key={media.id} className="relative pt-[56.25%]">
								{media.mimeType.startsWith("image/") ? (
									<img
										src={media.url || "/placeholder.svg"}
										alt="Post media"
										className="absolute inset-0 w-full h-full object-cover"
									/>
								) : media.mimeType.startsWith("video/") ? (
									<video
										src={media.url}
										controls
										className="absolute inset-0 w-full h-full object-cover"
									/>
								) : (
									<div className="absolute inset-0 flex items-center justify-center bg-gray-100">
										<p className="text-gray-500">Unsupported media type</p>
									</div>
								)}
							</div>
						))}
					</div>
				)}

				{post.type === "POLL" && (
					<div className="mt-3 p-3 bg-gray-50 rounded-md">
						<p className="font-medium mb-2">Poll</p>
						<p className="text-gray-500">
							Poll content not available in this view
						</p>
					</div>
				)}
			</CardContent>
			<CardFooter className="border-t pt-3 flex justify-between">
				<Button variant="ghost" size="sm" className="flex items-center gap-1">
					<Heart className="h-4 w-4" />
					<span>{likesCount}</span>
				</Button>
				<Button variant="ghost" size="sm" className="flex items-center gap-1">
					<MessageCircle className="h-4 w-4" />
					<span>{commentsCount}</span>
				</Button>
				<Button variant="ghost" size="sm" className="flex items-center gap-1">
					<Repeat2 className="h-4 w-4" />
					<span>{repostsCount}</span>
				</Button>
			</CardFooter>
		</Card>
	);
}
