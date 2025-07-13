"use client";

import NewsFeed from "@/app/_components/_newsfeed/news-feed.js";

export default function PostsSection({ company, isOwner }) {
	return <NewsFeed username={company.account.username} />;
}
