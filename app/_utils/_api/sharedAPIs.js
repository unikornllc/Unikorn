import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER + "/api";

export const fetchInvestments = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getInvestments`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const createInvestment = async (data) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/createInvestment`,
			data,
			{
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const updateInvestment = async (data) => {
	try {
		const response = await axios.put(`${API_BASE_URL}/updateInvestment`, data, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const deleteInvestment = async (investmentId) => {
	try {
		const response = await axios.delete(`${API_BASE_URL}/deleteInvestment`, {
			withCredentials: true,
			params: { investmentId },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const getAccountStats = async (username) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getAccountStats`, {
			withCredentials: true,
			params: { username },
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};
