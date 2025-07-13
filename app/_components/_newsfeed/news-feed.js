"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./post-card";
import { Spinner } from "../_ui/spinner";
import {
	fetchPosts,
	fetchCurrentProfilePosts,
} from "@/app/_utils/_api/newsfeedAPIs.js";
import { EmptyState } from "../_ui/EmptyState";

export default function NewsFeed({ username }) {
	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState(null);
	const { ref, inView } = useInView();

	const loadPosts = async () => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			const result = username
				? await fetchCurrentProfilePosts(username, page)
				: await fetchPosts(page);
			const newPosts = Array.isArray(result) ? result : result.posts || [];

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
			setError("Failed to load posts. Please try again later.");
		} finally {
			setLoading(false);
			setInitialLoading(false);
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

	if (initialLoading) {
		return (
			<div className="flex justify-center py-10">
				<Spinner size="lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 text-center">
				<p className="text-red-500">{error}</p>
				<button
					onClick={() => {
						setError(null);
						setPage(1);
						setHasMore(true);
						loadPosts();
					}}
					className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{posts.length === 0 && !loading ? (
				<EmptyState
					title="No posts yet"
					description="Be the first to create a post in your network"
				/>
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
				</>
			)}
		</div>
	);
}
