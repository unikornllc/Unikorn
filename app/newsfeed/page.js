import Newsfeed from "@/app/_components/_newsfeed/news-feed.jsx";

export default function Home() {
	return (
		<main className="min-h-screen bg-gray-50">
			<div className="container mx-auto max-w-2xl py-8 px-4">
				<h1 className="text-3xl font-bold mb-6 text-center">Your Newsfeed</h1>
				<Newsfeed />
			</div>
		</main>
	);
}
