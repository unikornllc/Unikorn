"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../_ui/Card.js";
import { Avatar, AvatarFallback, AvatarImage } from "../_ui/Avatar.js";
import { Button } from "../_ui/Button.js";
import Link from "next/link";
import FundingPostContent from "./post-types/funding-post";
import PartnerPostContent from "./post-types/partner-post";
import GuidancePostContent from "./post-types/guidance-post";
import EventPostContent from "./post-types/event-post";
import PollPostContent from "./post-types/poll-post";
import DocumentPostContent from "./post-types/document-post";
import { likePost, unlikePost } from "@/app/_utils/_api/newsfeedAPIs.js";
import { toast } from "sonner";

export default function PostCard({ post }) {
	const [isLiked, setIsLiked] = useState(post.isLiked || false);
	const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
	const [isLiking, setIsLiking] = useState(false);

	const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
		addSuffix: true,
	});

	const commentsCount = post.comments?.length || 0;
	const repostsCount = post.reposts?.length || 0;

	const authorInitials =
		post.author?.username?.substring(0, 2).toUpperCase() || "UN";
	const authorName = post.author?.username || "Unknown User";
	const authorId = post.author?.id || "";

	const handleLikeToggle = async () => {
		if (isLiking) return;
		setIsLiking(true);

		try {
			if (isLiked) {
				await unlikePost(post.id);
				setLikesCount((prev) => Math.max(0, prev - 1));
			} else {
				await likePost(post.id);
				setLikesCount((prev) => prev + 1);
			}
			setIsLiked(!isLiked);
		} catch (error) {
			console.error("Error toggling like:", error);
			toast.error("Failed to process your action. Please try again.");
		} finally {
			setIsLiking(false);
		}
	};

	// Render the appropriate content based on post type
	const renderPostContent = () => {
		switch (post.type) {
			case "LOOKING_FOR_FUNDING":
				return <FundingPostContent post={post} />;
			case "LOOKING_FOR_PARTNER":
				return <PartnerPostContent post={post} />;
			case "LOOKING_FOR_GUIDANCE":
				return <GuidancePostContent post={post} />;
			case "EVENT":
				return <EventPostContent post={post} />;
			case "POLL":
				return <PollPostContent post={post} />;
			case "DOCUMENT":
				return <DocumentPostContent post={post} />;
			default:
				return (
					<div>{post.content && <p className="mb-3">{post.content}</p>}</div>
				);
		}
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader className="pb-3">
				<div className="flex items-center space-x-3">
					<Link href={`/profile/${authorId}`}>
						<Avatar>
							{post.author?.profilePicture ? (
								<AvatarImage
									src={post.author.profilePicture || "/placeholder.svg"}
									alt={authorName}
								/>
							) : (
								<AvatarFallback>{authorInitials}</AvatarFallback>
							)}
						</Avatar>
					</Link>
					<div>
						<Link
							href={`/profile/${authorId}`}
							className="font-medium hover:underline"
						>
							{authorName}
						</Link>
						<p className="text-xs text-gray-500">{formattedDate}</p>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pb-4">{renderPostContent()}</CardContent>

			<CardFooter className="border-t pt-3 flex justify-between">
				<Button
					variant="ghost"
					size="sm"
					className={`flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}
					onClick={handleLikeToggle}
					disabled={isLiking}
				>
					<Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
					<span>{likesCount}</span>
				</Button>
				<Link href={`/post/${post.id}/comments`} passHref>
					<Button variant="ghost" size="sm" className="flex items-center gap-1">
						<MessageCircle className="h-4 w-4" />
						<span>{commentsCount}</span>
					</Button>
				</Link>
				<Button variant="ghost" size="sm" className="flex items-center gap-1">
					<Repeat2 className="h-4 w-4" />
					<span>{repostsCount}</span>
				</Button>
			</CardFooter>
		</Card>
	);
}
