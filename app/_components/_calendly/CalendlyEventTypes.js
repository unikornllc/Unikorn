import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendlySchedule from "./CalendlySchedule";

const CalendlyEventTypes = () => {
	const [eventTypes, setEventTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		duration: 30,
		color: "#00a2ff",
		location: { type: "custom", value: "Zoom" },
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		availability: [
			{
				start_time: "",
				end_time: "",
			},
		],
		secret: false,
	});

	// Prevent page scrolling when modal is open
	useEffect(() => {
		if (showModal) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
	}, [showModal]);

	useEffect(() => {
		// const fetchEventTypes = async () => {
		// 	try {
		// 		const response = await axios.get(
		// 			`${process.env.NEXT_PUBLIC_SERVER}/calendly/eventType`,
		// 			{
		// 				withCredentials: true,
		// 			},
		// 		);
		// 		console.log("Event Types:", response.data);
		// 		setEventTypes(response.data.collection);
		// 	} catch (error) {
		// 		console.error("Error fetching event types:", error);
		// 	} finally {
		// 		setLoading(false);
		// 	}
		// };
		// fetchEventTypes();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleAvailabilityChange = (index, key, value) => {
		const updatedAvailability = [...formData.availability];
		updatedAvailability[index][key] = value;
		setFormData({ ...formData, availability: updatedAvailability });
	};

	const handleRemoveAvailability = (index) => {
		const updatedAvailability = formData.availability.filter(
			(_, i) => i !== index,
		);
		setFormData({ ...formData, availability: updatedAvailability });
	};

	const handleAddAvailability = () => {
		setFormData({
			...formData,
			availability: [
				...formData.availability,
				{ start_time: "", end_time: "" },
			],
		});
	};

	const handleCreateEventType = async () => {
		const eventData = {
			name: "Unikorn Meetings",
			description: "Discuss opportunities",
			duration: formData.duration,
			color: formData.color,
			location: formData.location,
			availability: formData.availability,
			secret: formData.secret,
			timezone: formData.timezone,
		};

		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/calendly/createEventType`,
				eventData,
				{
					withCredentials: true,
				},
			);
			setEventTypes([...eventTypes, response.data.resource]);
			setShowModal(false);
		} catch (error) {
			console.error("Error creating event type:", error);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6 relative">
			<h3 className="text-2xl font-semibold text-textPrimary mb-4">
				Your Schedule
			</h3>

			<CalendlySchedule></CalendlySchedule>
			<button
				className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4"
				onClick={() => setShowModal(true)}
			>
				Create New Event Type
			</button>

			{showModal && (
				<div
					className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
					style={{ zIndex: 9999 }}
				>
					<div className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
						<h3 className="text-lg font-semibold mb-4 text-center">
							Create New Event Type
						</h3>
						<form className="space-y-4">
							<div>
								<label className="block text-sm font-medium mb-1">
									Duration (minutes):
								</label>
								<input
									type="number"
									name="duration"
									value={formData.duration}
									onChange={handleInputChange}
									className="w-full border rounded px-3 py-2"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">Color:</label>
								<input
									type="color"
									name="color"
									value={formData.color}
									onChange={handleInputChange}
									className="w-12 h-8 border rounded"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Location:
								</label>
								<input
									type="text"
									name="location"
									value={formData.location.value}
									onChange={(e) =>
										setFormData({
											...formData,
											location: { type: "custom", value: e.target.value },
										})
									}
									className="w-full border rounded px-3 py-2"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium mb-1">
									Availability:
								</label>
								{formData.availability.map((slot, index) => (
									<div key={index} className="flex items-center space-x-2 mb-2">
										<input
											type="datetime-local"
											value={slot.start_time}
											onChange={(e) =>
												handleAvailabilityChange(
													index,
													"start_time",
													e.target.value,
												)
											}
											className="border rounded px-3 py-2 w-full"
										/>
										<input
											type="datetime-local"
											value={slot.end_time}
											onChange={(e) =>
												handleAvailabilityChange(
													index,
													"end_time",
													e.target.value,
												)
											}
											className="border rounded px-3 py-2 w-full"
										/>
										{/*<button
											type="button"
											onClick={() => handleRemoveAvailability(index)}
											className="px-3 py-2 bg-red-500 text-white rounded-md"
										>
											Remove
										</button>*/}
									</div>
								))}
								{/*<button
									type="button"
									onClick={handleAddAvailability}
									className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
								>
									Add Availability Slot
								</button>  */}
							</div>
						</form>
						<div className="flex justify-end mt-6 space-x-2">
							<button
								className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
								onClick={() => setShowModal(false)}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
								onClick={handleCreateEventType}
							>
								Create Event Type
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CalendlyEventTypes;
