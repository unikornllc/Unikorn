import React, { useState, useEffect } from "react";
import axios from "axios";
import { PopupButton } from "react-calendly";

const CalendlySchedule = ({ username }) => {
	const [eventTypes, setEventTypes] = useState(null);

	const fetchEventTypes = async () => {
		try {
			console.log(username);
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/calendly/eventType`,
				{
					params: { username },
					withCredentials: true,
				},
			);
			console.log("Event Types:", response.data);
			setEventTypes(response.data.eventTypes || []);
		} catch (error) {
			console.error("Error fetching event types:", error);
			setEventTypes([]);
		}
	};

	useEffect(() => {
		console.log("Here");
		fetchEventTypes();
	}, [username]);

	return (
		<div className="container mx-auto mt-8 px-4">
			{eventTypes && eventTypes.length === 0 ? (
				<div className="text-center">
					<h2 className="text-xl font-semibold text-gray-800">
						No available schedules at the moment.
					</h2>
					{username ? (
						<p className="text-gray-600 mt-2">
							It looks like you have not set up any event types. Please create a
							calender with the name "unikorn" to be able to schedule meetings.
						</p>
					) : (
						<p className="text-gray-600 mt-2">
							It looks like the user has not set up any event types. Please
							check back later.
						</p>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{eventTypes &&
						eventTypes.map((eventType) => (
							<div
								key={eventType.uri}
								className="bg-white rounded-lg shadow-md overflow-hidden"
							>
								<div
									className="h-12"
									style={{
										backgroundColor: eventType.color || "#f5f5f5",
									}}
								></div>
								<div className="p-4">
									<h3 className="text-lg font-semibold text-gray-800 mb-2">
										{eventType.name}
									</h3>
									<p className="text-gray-600 text-sm mb-4">
										{eventType.description_plain || "No description provided"}
									</p>
									<PopupButton
										url={eventType.scheduling_url}
										rootElement={document.body} // Fixed rootElement
										text={
											eventType.active
												? "View Availability"
												: "INACTIVE EVENT TYPE"
										}
										styles={{
											display: "inline-block",
											padding: "10px 20px",
											backgroundColor: eventType.active ? "#4CAF50" : "#F44336",
											color: "#fff",
											borderRadius: "5px",
											textAlign: "center",
											cursor: "pointer",
											fontWeight: "bold",
										}}
									/>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default CalendlySchedule;
