"use client";

import { useState } from "react";
import { Card, CardContent } from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import { formatDate } from "@/app/_utils/utils";
import {
	MessageSquare,
	Heart,
	Share2,
	Plus,
	ImageIcon,
	FileText,
	Paperclip,
	Trash2,
	Edit,
} from "lucide-react";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { Label } from "@/app/_components/_ui/Label";
import { Input } from "@/app/_components/_ui/Input";

export default function PostsSection({ company, isOwner }) {
	// Mock data for posts
	const [posts, setPosts] = useState([
		{
			id: "1",
			content:
				"We're excited to announce our latest product launch! Stay tuned for more updates.",
			date: new Date(2023, 3, 15),
			likes: 42,
			comments: 7,
			shares: 12,
		},
		{
			id: "2",
			content:
				"Our team had a great time at the annual tech conference. We met so many amazing people and learned about the latest industry trends.",
			date: new Date(2023, 3, 10),
			likes: 28,
			comments: 5,
			shares: 3,
			image: "/placeholder.svg",
		},
	]);

	const [newPost, setNewPost] = useState("");
	const [isAddingImage, setIsAddingImage] = useState(false);
	const [postImage, setPostImage] = useState(null);
	const [isEditingPost, setIsEditingPost] = useState(false);
	const [selectedPost, setSelectedPost] = useState(null);
	const [editPostContent, setEditPostContent] = useState("");

	const handleAddPost = () => {
		if (!newPost.trim()) return;

		const post = {
			id: Date.now().toString(),
			content: newPost,
			date: new Date(),
			likes: 0,
			comments: 0,
			shares: 0,
			image: postImage,
		};

		setPosts([post, ...posts]);
		setNewPost("");
		setPostImage(null);
	};

	const handleEditPost = (post) => {
		setSelectedPost(post);
		setEditPostContent(post.content);
		setIsEditingPost(true);
	};

	const handleSaveEditPost = () => {
		if (!editPostContent.trim()) return;

		const updatedPosts = posts.map((post) =>
			post.id === selectedPost.id
				? { ...post, content: editPostContent }
				: post,
		);

		setPosts(updatedPosts);
		setIsEditingPost(false);
	};

	const handleDeletePost = (id) => {
		const updatedPosts = posts.filter((post) => post.id !== id);
		setPosts(updatedPosts);
	};

	const handleLikePost = (id) => {
		const updatedPosts = posts.map((post) =>
			post.id === id ? { ...post, likes: post.likes + 1 } : post,
		);
		setPosts(updatedPosts);
	};

	const handleAddImage = () => {
		setIsAddingImage(true);
	};

	const handleImageSelected = (e) => {
		const file = e.target.files[0];
		if (file) {
			// In a real app, you would upload the file to a server
			// For now, we'll just create a local URL
			const url = URL.createObjectURL(file);
			setPostImage(url);
			setIsAddingImage(false);
		}
	};

	return (
		<div className="space-y-6">
			{isOwner && (
				<Card>
					<CardContent className="p-6">
						<div className="flex items-start gap-4">
							<Avatar className="h-10 w-10">
								<AvatarImage src="/placeholder.svg" alt={company.name} />
								<AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-4">
								<Textarea
									placeholder={`What's new at ${company.name}?`}
									value={newPost}
									onChange={(e) => setNewPost(e.target.value)}
									className="min-h-[100px]"
								/>
								{postImage && (
									<div className="relative">
										<img
											src={postImage || "/placeholder.svg"}
											alt="Post preview"
											className="w-full h-auto rounded-md"
										/>
										<Button
											variant="destructive"
											size="icon"
											className="absolute top-2 right-2 h-8 w-8 rounded-full"
											onClick={() => setPostImage(null)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								)}
								<div className="flex items-center justify-between">
									<div className="flex gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={handleAddImage}
										>
											<ImageIcon className="h-4 w-4 mr-2" />
											Photo
										</Button>
										<Button variant="outline" size="sm">
											<FileText className="h-4 w-4 mr-2" />
											Document
										</Button>
										<Button variant="outline" size="sm">
											<Paperclip className="h-4 w-4 mr-2" />
											Attachment
										</Button>
									</div>
									<Button onClick={handleAddPost} disabled={!newPost.trim()}>
										Post
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{posts.length > 0 ? (
				posts.map((post) => (
					<Card key={post.id}>
						<CardContent className="p-6">
							<div className="flex items-start gap-4 mb-4">
								<Avatar className="h-10 w-10">
									<AvatarImage src="/placeholder.svg" alt={company.name} />
									<AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<h3 className="font-medium">{company.name}</h3>
									<p className="text-sm text-gray-500">
										{formatDate(post.date)}
									</p>
								</div>
								{isOwner && (
									<div className="flex gap-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => handleEditPost(post)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
											onClick={() => handleDeletePost(post.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								)}
							</div>

							<p className="mb-4">{post.content}</p>

							{post.image && (
								<div className="mb-4 rounded-lg overflow-hidden">
									<img
										src={post.image || "/placeholder.svg"}
										alt="Post image"
										className="w-full h-auto"
									/>
								</div>
							)}

							<div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
								<button
									className="flex items-center gap-1 hover:text-gray-700"
									onClick={() => handleLikePost(post.id)}
								>
									<Heart
										className={`h-4 w-4 ${post.likes > 0 ? "fill-red-500 text-red-500" : ""}`}
									/>
									<span>{post.likes}</span>
								</button>
								<button className="flex items-center gap-1 hover:text-gray-700">
									<MessageSquare className="h-4 w-4" />
									<span>{post.comments}</span>
								</button>
								<button className="flex items-center gap-1 hover:text-gray-700">
									<Share2 className="h-4 w-4" />
									<span>{post.shares}</span>
								</button>
							</div>
						</CardContent>
					</Card>
				))
			) : (
				<Card>
					<CardContent className="p-6">
						<div className="text-center py-12 text-gray-500">
							<FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
							<p className="text-lg font-medium mb-2">No posts yet</p>
							<p className="mb-6">
								Be the first to see updates from {company.name}
							</p>
							{isOwner && (
								<Button
									onClick={() => document.querySelector("textarea")?.focus()}
								>
									<Plus className="h-4 w-4 mr-2" />
									Create Your First Post
								</Button>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Add Image Dialog */}
			<Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Image</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
							<p className="text-gray-500 mb-2">
								Drag and drop an image or click to browse
							</p>
							<Input
								type="file"
								accept="image/*"
								className="hidden"
								id="image-upload"
								onChange={handleImageSelected}
							/>
							<Label htmlFor="image-upload" className="cursor-pointer">
								<Button type="button" variant="outline">
									Choose File
								</Button>
							</Label>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddingImage(false)}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Post Dialog */}
			<Dialog open={isEditingPost} onOpenChange={setIsEditingPost}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Post</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<Textarea
							value={editPostContent}
							onChange={(e) => setEditPostContent(e.target.value)}
							placeholder="What's on your mind?"
							className="min-h-[150px]"
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditingPost(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveEditPost}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
