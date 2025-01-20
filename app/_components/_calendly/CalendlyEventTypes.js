import React, { useEffect, useState } from "react";
import axios from "axios";

const CalendlyEventTypes = () => {
	const [eventTypes, setEventTypes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchEventTypes = async () => {
			try {
				const response = await axios.get("/api/calendly/event-types", {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				});
				setEventTypes(response.data.collection);
			} catch (error) {
				console.error("Error fetching event types:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEventTypes();
	}, []);

	const handleCreateEventType = async () => {
		const eventData = {
			name: "Meeting",
			description: "Discuss opportunities",
			duration: 30,
		};

		try {
			const response = await axios.post(
				"/api/calendly/event-types/create",
				eventData,
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				},
			);
			setEventTypes([...eventTypes, response.data.resource]);
		} catch (error) {
			console.error("Error creating event type:", error);
		}
	};

	if (loading) return <div>Loading event types...</div>;

	return (
		<div>
			<h3 className="text-xl font-semibold mb-4">Your Event Types</h3>
			<button
				className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
				onClick={handleCreateEventType}
			>
				Create New Event Type
			</button>
			<ul className="mt-4">
				{eventTypes.map((eventType) => (
					<li key={eventType.uri} className="mb-2">
						{eventType.name} - {eventType.duration} minutes
					</li>
				))}
			</ul>
		</div>
	);
};

export default CalendlyEventTypes;
