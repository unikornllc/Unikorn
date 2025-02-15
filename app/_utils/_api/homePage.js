import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER + "/api"

export const fetchCurrentUserData = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/getCurrentUser`,
            {
                withCredentials: true,
            },
        );
        return response.data.user
    } catch (error) {
        console.log("Error fetching user data:", error)
        throw error
    }
}

export const fetchCurrentCompanyData = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/getCurrentCompany`,
            {
                withCredentials: true,
            },
        );
        return response.data.company
    } catch (error) {
        console.log("Error fetching user data:", error)
        throw error
    }
}
export const fetchUserData = async (username) => {
    try {
        const include = {
            expertise: true,
            education: true,
            interest: true,
            corporate_experience: true,
            startup_experience: true,
            certifications_courses: true,
            language: true,
            social_media: true,
            calendly_integration: true,
            wallet: true,
            fundraiser: true,
        };
        const response = await axios.get(
            `${API_BASE_URL}/getOneUser`,
            {
                withCredentials: true,
                params: { username, include },
            },
        );
        return response.data.user
    } catch (error) {
        console.log("Error fetching user data:", error)
        throw error
    }
}

export const fetchCompanyData = async (username) => {
    try {
        const include = {
            founders: true,
            key_employees: true,
            product_information: true,
            financials: true,
            activities: true,
            raising_Funds: true,
            wallet: true,
        };
        const response = await axios.get(
            `${API_BASE_URL}/getOneCompanyProfile`,
            {
                withCredentials: true,
                params: { username, include },
            },
        );
        return response.data.company
    } catch (error) {
        console.log("Error fetching user data:", error)
        throw error
    }
}

export const fetchTier = async () => {
    try {
        const response = await axios
            .get(`${API_BASE_URL}/getTier`, {
                withCredentials: true,
            })
        return response.data
    } catch (error) {
        console.log("Error fetching user data:", error)
        throw error
    }

}

