import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:3001/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

/**
 * Fetch a post with all its comments
 * @param {string} postId - The ID of the post
 * @returns {Promise<Object>} - The post and its comments
 */
export async function fetchPostWithComments(postId) {
	try {
		const response = await api.get(`/post/${postId}/comments`);
		return response.data;
	} catch (error) {
		console.error("Error fetching post with comments:", error);
		throw error;
	}
}

/**
 * Add a comment to a post
 * @param {string} postId - The ID of the post
 * @param {string} content - The comment content
 * @returns {Promise<Object>} - The created comment
 */
export async function addComment(postId, content) {
	try {
		const response = await api.post("/addComment", { postId, content });
		return response.data;
	} catch (error) {
		console.error("Error adding comment:", error);
		throw error;
	}
}

/**
 * Delete a comment
 * @param {string} commentId - The ID of the comment to delete
 * @returns {Promise<Object>} - The response
 */
export async function deleteComment(commentId) {
	try {
		const response = await api.delete(`/deleteComment/${commentId}`);
		return response.data;
	} catch (error) {
		console.error("Error deleting comment:", error);
		throw error;
	}
}
