import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3003",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

const POSTS_PER_PAGE = 20;

export async function fetchPosts(page) {
	try {
		const response = await api.get("/allPosts", {
			params: { page, limit: POSTS_PER_PAGE },
		});
		return response.data.posts;
	} catch (error) {
		console.error("Error fetching posts:", error);
		return [];
	}
}

export async function likePost(postId) {
	try {
		await api.post("/likePost", { postId });
	} catch (error) {
		console.error("Error liking post:", error);
		throw error;
	}
}

export async function unlikePost(postId) {
	try {
		await api.post("/unlikePost", { postId });
	} catch (error) {
		console.error("Error unliking post:", error);
		throw error;
	}
}

export async function addComment(postId, content) {
	try {
		await api.post("/addComment", { postId, content });
	} catch (error) {
		console.error("Error adding comment:", error);
		throw error;
	}
}

export async function createRepost(postId) {
	try {
		await api.post("/createRepost", { postId });
	} catch (error) {
		console.error("Error reposting:", error);
		throw error;
	}
}
