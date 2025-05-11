import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";

const PostsSection = ({ user, editable }) => {
	const posts = [
		{
			id: 1,
			content:
				"Excited to announce that I've just invested in an innovative AI startup that's revolutionizing the healthcare industry! Looking forward to seeing their growth in the coming months.",
			date: "2 days ago",
			likes: 42,
			comments: 8,
			shares: 3,
		},
		{
			id: 2,
			content:
				"Just finished attending the Global Tech Summit 2023. Met some incredible entrepreneurs and learned about cutting-edge technologies. The future is bright!",
			date: "1 week ago",
			likes: 78,
			comments: 15,
			shares: 7,
		},
		{
			id: 3,
			content:
				"Sharing my thoughts on the current state of venture capital in the post-pandemic world. What trends are you seeing in your industry?",
			date: "2 weeks ago",
			likes: 124,
			comments: 32,
			shares: 18,
		},
	];

	return (
		<div className="space-y-6">
			{editable && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage
									src={user.profileImage || "/placeholder.svg"}
									alt={user.name}
								/>
								<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<span className="font-medium">Share an update...</span>
						</div>
					</CardHeader>
					<CardContent>
						<Textarea
							placeholder="What's on your mind?"
							className="min-h-[100px]"
						/>
					</CardContent>
					<CardFooter className="flex justify-between">
						<div className="flex gap-2">
							<Button variant="outline" size="sm">
								Photo
							</Button>
							<Button variant="outline" size="sm">
								Video
							</Button>
							<Button variant="outline" size="sm">
								Document
							</Button>
						</div>
						<Button className="flex items-center gap-1">
							<Send className="h-4 w-4" />
							Post
						</Button>
					</CardFooter>
				</Card>
			)}

			{posts.map((post) => (
				<Card key={post.id}>
					<CardHeader>
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage
									src={user.profileImage || "/placeholder.svg"}
									alt={user.name}
								/>
								<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div>
								<p className="font-medium">{user.name}</p>
								<p className="text-sm text-gray-500">{post.date}</p>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700">{post.content}</p>
					</CardContent>
					<CardFooter className="flex justify-between border-t pt-4">
						<div className="flex gap-6">
							<button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
								<ThumbsUp className="h-4 w-4" />
								<span>{post.likes}</span>
							</button>
							<button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
								<MessageSquare className="h-4 w-4" />
								<span>{post.comments}</span>
							</button>
							<button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
								<Share2 className="h-4 w-4" />
								<span>{post.shares}</span>
							</button>
						</div>
						{editable && (
							<div>
								<Button
									variant="ghost"
									size="sm"
									className="text-red-500 hover:text-red-700 hover:bg-red-50"
								>
									Delete
								</Button>
							</div>
						)}
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default PostsSection;
