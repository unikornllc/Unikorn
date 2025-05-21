import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3001/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

const POSTS_PER_PAGE = 20;

export async function fetchPosts(page) {
	try {
		const response = await api.get("/getAllPosts", {
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

export async function createRepost(postId) {
	try {
		await api.post("/createRepost", { postId });
	} catch (error) {
		console.error("Error reposting:", error);
		throw error;
	}
}

export async function votePoll(pollId, optionId) {
	try {
		const response = await api.post("/voteOption", {
			pollId,
			optionId,
		});
		return response.data;
	} catch (error) {
		console.error("Error voting on poll:", error);
		throw error;
	}
}

export async function checkIfUserVoted(pollId) {
	try {
		const response = await api.get(`/checkUserVote/${pollId}`);
		return response.data;
	} catch (error) {
		console.error("Error checking if user voted:", error);
		throw error;
	}
}
