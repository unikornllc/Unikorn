"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./post-card";
import { Spinner } from "../_ui/spinner";
import { fetchPosts } from "@/app/_utils/_api/newsfeedAPIs.js";

export default function NewsFeed() {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const { ref, inView } = useInView();

	const loadPosts = async () => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			const result = await fetchPosts(page);
			const newPosts = Array.isArray(result)
				? result
				: result.posts || [];

			if (newPosts.length === 0) {
				setHasMore(false);
			} else {
				setPosts((prev) => {
					const existingIds = new Set(prev.map((p) => p.id));
					const deduped = newPosts.filter((p) => !existingIds.has(p.id));
					return [...prev, ...deduped];
				});
				setPage((p) => p + 1);
			}
		} catch (error) {
			console.error("Error loading posts:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadPosts();
	}, []);

	useEffect(() => {
		if (inView) {
			loadPosts();
		}
	}, [inView]);

	return (
		<div className="space-y-6">
			{posts.length === 0 && loading ? (
				<div className="flex justify-center py-10">
					<Spinner size="lg" />
				</div>
			) : (
				<>
					{posts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}

					{hasMore && (
						<div ref={ref} className="flex justify-center py-4">
							{loading && <Spinner />}
						</div>
					)}

					{!hasMore && posts.length > 0 && (
						<p className="text-center text-gray-500 py-4">
							No more posts to load
						</p>
					)}

					{!hasMore && posts.length === 0 && (
						<div className="text-center py-10">
							<p className="text-gray-500">No posts found</p>
						</div>
					)}
				</>
			)}
		</div>
	);
}
