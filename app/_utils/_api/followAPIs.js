import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER + "/api";

export const fetchMyFollowers = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getMyFollowers`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const fetchMyFollowing = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getMyFollowing`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const fetchFollowers = async (username) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getFollowers`, {
			withCredentials: true,
			params: { username },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const fetchFollowing = async (username) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getFollowing`, {
			withCredentials: true,
			params: { username },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const followAccount = async (data) => {
	try {
		const response = await axios.post(`${API_BASE_URL}/followAccount`, data, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const unfollowAccount = async (data) => {
	try {
		const response = await axios.post(`${API_BASE_URL}/unfollowAccount`, data, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const isFollowingAccount = async (data) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/isFollowingAccount`, {
			withCredentials: true,
			params: data,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};
