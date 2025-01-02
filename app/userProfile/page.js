"use client";
// pages/profile/[id].js
import { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
	const [userData, setUserData] = useState(null);
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [newSlots, setNewSlots] = useState("");

	// Set the user's schedule
	const handleSetSchedule = async () => {
		try {
			const slots = newSlots.split(",").map((slot) => slot.trim()); // Split new slots by comma
			await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/set_schedule`, {
				email: userData.email,
				availableSlots: slots,
			});

			alert("Schedule updated successfully!");
			setAvailableSlots(slots); // Update the available slots in the state
			setNewSlots(""); // Clear the input field
		} catch (error) {
			console.error("Error setting schedule:", error);
			alert("Failed to update schedule!");
		}
	};

	// Reserve a selected slot
	const handleSlotReservation = async () => {
		try {
			if (!selectedSlot) {
				alert("Please select a slot to reserve!");
				return;
			}

			await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/reserve_slot`, {
				target_email: userData.email,
				requester_email: "current_user@example.com", // Replace with the actual logged-in user's email
				slot: selectedSlot,
			});

			alert("Meeting reserved successfully!");
			setAvailableSlots((slots) =>
				slots.filter((slot) => slot !== selectedSlot),
			); // Remove the reserved slot
			setSelectedSlot(""); // Clear the selection
		} catch (error) {
			console.error("Error reserving slot:", error);
			alert("Failed to reserve the slot!");
		}
	};

	useEffect(() => {
		console.log("ana henaaa");
		const fetchData = async () => {
			try {
				// Fetch user information
				const userResponse = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/getOneUser`,
					{ withCredentials: true },
				);
				setUserData(userResponse.data);
				console.log(userResponse);
				// Fetch available slots for the user
				// const slotsResponse = await axios.get(
				// 	`${process.env.NEXT_PUBLIC_SERVER}/view_schedule/${userResponse.data.email}`,
				// );
				// setAvailableSlots(slotsResponse.data.available_slots);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="bg-gray-100 min-h-screen py-8">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
				{userData ? (
					<div>
						{/* Banner and Profile Picture // user.profilePicture || */}
						<div className="bg-blue-600 h-32"></div>
						<div className="relative -mt-16 flex justify-center">
							<img
								src={
									"https://scontent.fcai19-7.fna.fbcdn.net/v/t1.6435-1/90527624_1995131043944878_6927937670429540352_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_ohc=_cX7LeKjIFEQ7kNvgHUIAWA&_nc_oc=AdiCSHvQt61ZLKteSO39E75JUFAtdOKmvHEIJSVwOl1mJhVx4P4zSms1WOLSoZ2OunM&_nc_zt=24&_nc_ht=scontent.fcai19-7.fna&_nc_gid=Ak7JoHpUuAgLQWsqr32ELF8&oh=00_AYA25zX7173pOm_kwbpQMqP8z6grVgY8twEU3dY6m-9o-g&oe=679804ED"
								}
								alt="Profile"
								className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
							/>
						</div>

						{/* User Info */}
						<div className="p-4 text-center">
							<h1 className="text-2xl font-bold">{userData.username}</h1>
							<p className="text-gray-600">{userData.title}</p>
							<p className="text-gray-600">{userData.description}</p>
							<p className="text-blue-500 underline">{userData.email}</p>
						</div>

						{/* Buttons */}
						<div className="flex justify-center space-x-4 my-4">
							<button className="bg-blue-500 text-white px-4 py-2 rounded shadow">
								Edit Profile
							</button>
							<a
								href={"user.calendly_link"}
								target="_blank"
								className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow"
								rel="noopener noreferrer"
							>
								View Full Calendly
							</a>
						</div>

						{/* Availability Section */}
						<div className="p-4">
							<h2 className="text-xl font-bold mb-4">Available Slots</h2>
							{availableSlots.length > 0 ? (
								<ul>
									{availableSlots.map((slot, index) => (
										<li key={index} className="mb-2">
											<label>
												<input
													type="radio"
													value={slot}
													checked={selectedSlot === slot}
													onChange={(e) => setSelectedSlot(e.target.value)}
													className="mr-2"
												/>
												{slot}
											</label>
										</li>
									))}
								</ul>
							) : (
								<p>No available slots.</p>
							)}
							<button
								onClick={handleSlotReservation}
								className="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow"
							>
								Reserve Slot
							</button>
						</div>
					</div>
				) : (
					<p className="text-center p-4">Loading...</p>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
