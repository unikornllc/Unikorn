import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { ScrollArea } from "@/app/_components/_ui/ScrollArea";
import { Button } from "@/app/_components/_ui/Button";
import { useRouter } from "next/navigation";
import NewsFeed from "../../_newsfeed/news-feed";

export default function ActivityFeed() {
	const router = useRouter();

	const handlePostClick = () => {
		router.push("/create-post");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Investment Feed</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col h-full">
				<div className="mb-4">
					<Button onClick={handlePostClick}>Make A Post</Button>
				</div>
				<div className="flex-1">
					<NewsFeed />
				</div>
			</CardContent>
		</Card>
	);
}
