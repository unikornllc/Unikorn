import React, { useEffect, useState } from "react";
import axios from "axios";

const CalendlyWidget = ({ user }) => {
	const [canViewCalendlyWidget, setCanViewCalendlyWidget] = useState(true);
	const [schedulingUrl, setSchedulingUrl] = useState(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const eventTypesResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/calendly/eventType`,
					{
						withCredentials: true,
					},
				);

				const eventType = eventTypesResponse.data.collection[0];
				console.log(eventType);
				setSchedulingUrl(eventType?.scheduling_url || null);
			} catch (error) {
				console.error("Error fetching user profile:", error);
			}
		};

		fetchUser();
	}, [user]);

	useEffect(() => {
		if (schedulingUrl) {
			const script = document.createElement("script");
			script.src = "https://assets.calendly.com/assets/external/widget.js";
			script.async = true;
			document.body.appendChild(script);
			return () => {
				document.body.removeChild(script);
			};
		}
	}, [schedulingUrl]);

	if (!schedulingUrl) {
		return null;
	}

	return (
		<div
			className="calendly-inline-widget"
			data-url={schedulingUrl}
			style={{ minWidth: "320px", height: "630px" }}
		></div>
	);
};

export default CalendlyWidget;
