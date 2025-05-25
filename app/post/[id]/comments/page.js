"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button.js";
import { Textarea } from "@/app/_components/_ui/Textarea.js";
import { Spinner } from "@/app/_components/_ui/spinner.js";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import PostCard from "@/app/_components/_newsfeed/post-card";
import CommentItem from "@/app/_components/post_creation/comment-item.js";
import {
	fetchPostWithComments,
	addComment,
} from "@/app/_utils/_api/commentsAPIs.js";
import { EmptyState } from "@/app/_components/_ui/EmptyState.js";

export default function PostCommentsPage() {
	const params = useParams();
	const router = useRouter();
	const postId = params.id;

	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadPostWithComments = async () => {
			try {
				setIsLoading(true);
				const data = await fetchPostWithComments(postId);
				setPost(data.post);
				setComments(data.comments);
			} catch (err) {
				console.error("Error loading post and comments:", err);
				setError("Failed to load post and comments. Please try again.");
			} finally {
				setIsLoading(false);
			}
		};

		if (postId) {
			loadPostWithComments();
		}
	}, [postId]);

	const handleSubmitComment = async (e) => {
		e.preventDefault();

		if (!newComment.trim()) {
			toast.error("Comment cannot be empty");
			return;
		}

		setIsSubmitting(true);

		try {
			const comment = await addComment(postId, newComment);

			setComments((prevComments) => [comment, ...prevComments]);
			setNewComment("");
			toast.success("Comment added successfully");
		} catch (err) {
			console.error("Error adding comment:", err);
			toast.error("Failed to add comment. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<div className="container max-w-4xl py-8 flex justify-center">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="container max-w-4xl py-8">
				<div className="text-center p-8">
					<h2 className="text-2xl font-bold mb-4">Error</h2>
					<p className="text-muted-foreground mb-6">
						{error || "Post not found"}
					</p>
					<Button onClick={() => router.push("/newsfeed")}>
						Return to Newsfeed
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container max-w-4xl py-8">
			<div className="mb-6">
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="flex items-center text-muted-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
			</div>

			<div className="mb-8">
				{console.log(post)}
				<PostCard post={post} />
			</div>

			<Card>
				<CardHeader className="pb-3">
					<h2 className="text-xl font-semibold">
						Comments ({comments.length})
					</h2>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmitComment} className="mb-8">
						<Textarea
							placeholder="Add a comment..."
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className="mb-4 min-h-[100px]"
						/>
						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={isSubmitting || !newComment.trim()}
							>
								{isSubmitting ? (
									<>
										<Spinner size="sm" className="mr-2" />
										Posting...
									</>
								) : (
									"Post Comment"
								)}
							</Button>
						</div>
					</form>

					{comments.length === 0 ? (
						<EmptyState
							title="No comments yet"
							description="Be the first to comment on this post"
						/>
					) : (
						<div className="space-y-4">
							{comments.map((comment) => (
								<CommentItem key={comment.id} comment={comment} />
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
