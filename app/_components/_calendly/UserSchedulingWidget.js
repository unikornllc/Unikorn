// components/Calendly/UserSchedulingWidget.jsx

import React, { useEffect, useState } from "react";
import CalendlyWidget from "./CalendlyWidget";
import axios from "axios";

const UserSchedulingWidget = ({ userId }) => {
	const [schedulingUrl, setSchedulingUrl] = useState(null);
	const [loading, setLoading] = useState(true);
	const [canView, setCanView] = useState(false);

	useEffect(() => {
		const fetchSchedulingLink = async () => {
			try {
				const response = await axios.get(
					`/api/calendly/users/${userId}/scheduling-link`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("token") || ""}`, // Include JWT token if available
						},
					},
				);

				setSchedulingUrl(response.data.schedulingUrl);
				setCanView(true);
			} catch (error) {
				console.error("Error fetching scheduling link:", error);
				setCanView(false);
			} finally {
				setLoading(false);
			}
		};

		fetchSchedulingLink();
	}, [userId]);

	if (loading) return <div>Loading scheduling options...</div>;

	if (!canView)
		return <div>You do not have access to this user's scheduling options.</div>;

	if (schedulingUrl) {
		return <CalendlyWidget schedulingUrl={schedulingUrl} />;
	}

	return <div>No scheduling options available.</div>;
};

export default UserSchedulingWidget;
