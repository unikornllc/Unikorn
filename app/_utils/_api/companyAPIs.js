import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER + "/api";

export const fetchCurrentCompanyData = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getCurrentCompany`, {
			withCredentials: true,
		});
		return response.data.company;
	} catch (error) {
		console.log("Error fetching user data:", error);
		throw error;
	}
};

export const fetchCompanyOverview = async (username) => {
	try {
		const respnse = await axios.get(`${API_BASE_URL}/getCompanyOverview`, {
			withCredentials: true,
			params: { username },
		});
		return respnse.data.company;
	} catch (error) {
		console.log("Error fetching company data:", error);
		throw error;
	}
};

export const fetchCompanyProductInfo = async (username) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getCompanyProductInfo`, {
			withCredentials: true,
			params: { username },
		});
		return response.data.productInfo;
	} catch (error) {
		console.log("Error fetching user data:", error);
		throw error;
	}
};

export const updateCompanyProfile = async (data) => {
	try {
		const response = await axios.put(
			`${API_BASE_URL}/updateCompanyOverview`,
			data,
			{
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.log("Error updating company profile:", error);
		throw error;
	}
};

export const fetchCompanyFinancialInfo = async (username) => {
	try {
		const response = await axios.get(
			`${API_BASE_URL}/getCompanyFinancialInfo`,
			{
				withCredentials: true,
				params: { username },
			},
		);
		return response.data.financialInfo;
	} catch (error) {
		console.log("Error fetching user data:", error);
		throw error;
	}
};

export const addCompanyActivity = async (data) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/addCompanyActivity`,
			data,
			{
				withCredentials: true,
			},
		);
		return response.data;
	} catch (error) {
		console.log("Error adding company activity:", error);
		throw error;
	}
};

export const fetchCompanyData = async (username) => {
	try {
		const include = {
			founders: true,
			keyEmployees: true,
			productInformation: true,
			financials: true,
			activities: true,
			raisingFunds: true,
		};
		const response = await axios.get(`${API_BASE_URL}/getOneCompanyProfile`, {
			withCredentials: true,
			params: { username, include },
		});
		return response.data.company;
	} catch (error) {
		console.log("Error fetching user data:", error);
		throw error;
	}
};

export const fetchTier = async () => {
	try {
		const response = await axios.get(`${API_BASE_URL}/getTier`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.log("Error fetching user data:", error);
		throw error;
	}
};
