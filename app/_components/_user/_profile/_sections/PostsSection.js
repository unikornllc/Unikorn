"use client";

import NewsFeed from "@/app/_components/_newsfeed/news-feed.js";

const PostsSection = ({ user, editable }) => {
	return <NewsFeed username={user.account.username} />;
};

export default PostsSection;
