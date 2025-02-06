"use client";
import { useState, useEffect } from "react";
import axios from "axios";
export default function MyProfile({ username }) {
	const [userData, setUserData] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedData, setEditedData] = useState({});
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [newSlots, setNewSlots] = useState("");

	const handleSetSchedule = async () => {
		try {
			const slots = newSlots.split(",").map((slot) => slot.trim());
			await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/set_schedule`, {
				email: userData.email,
				availableSlots: slots,
			});

			alert("Schedule updated successfully!");
			setAvailableSlots(slots);
			setNewSlots("");
		} catch (error) {
			console.error("Error setting schedule:", error);
			alert("Failed to update schedule!");
		}
	};

	const handleSlotReservation = async () => {
		try {
			if (!selectedSlot) {
				alert("Please select a slot to reserve!");
				return;
			}

			await axios.post(`${process.env.NEXT_PUBLIC_SERVER}/api/reserve_slot`, {
				target_email: userData.email,
				requester_email: "current_user@example.com",
				slot: selectedSlot,
			});

			alert("Meeting reserved successfully!");
			setAvailableSlots((slots) =>
				slots.filter((slot) => slot !== selectedSlot),
			);
			setSelectedSlot("");
		} catch (error) {
			console.error("Error reserving slot:", error);
			alert("Failed to reserve the slot!");
		}
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getCurrentUser`,
					{
						withCredentials: true,
					},
				);
				setUserData(res.data.user);
			} catch (err) {
				console.error("Error fetching user data:", err);
			}
		};
		fetchUserData();
	}, [username]);

	const handleEdit = () => {
		setIsEditing(true);
		setEditedData(userData);
	};

	const handleSave = async () => {
		// try {
		// 	await axios.put(`/api/user/${username}`, editedData, {
		// 		headers: { "Content-Type": "application/json" },
		// 	});
		// 	setUserData(editedData);
		// 	setIsEditing(false);
		// } catch (err) {
		// 	console.error(err);
		// }
		setIsEditing(false);
	};

	if (!userData)
		return (
			<div className="bg-gray-100 min-h-screen py-8">
				<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<p className="text-center p-4">Loading...</p>
				</div>
			</div>
		);

	return (
		<div className="bg-gray-100 min-h-screen py-8">
			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
				<div>
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
					<div className="p-4 text-center">
						<h1 className="text-2xl font-bold">{userData.username}</h1>
						<p className="text-gray-600">{userData.title}</p>
					</div>

					{isEditing ? (
						<div className="justify-center w-full mt-4">
							<input
								type="text"
								value={editedData.name}
								onChange={(e) =>
									setEditedData({ ...editedData, name: e.target.value })
								}
								className="w-full p-2 border border-gray-300 rounded mt-2"
								placeholder="Name"
							/>
							<textarea
								value={editedData.description}
								onChange={(e) =>
									setEditedData({ ...editedData, bio: e.target.value })
								}
								className="w-full p-2 border border-gray-300 rounded mt-2"
								placeholder="Description"
							></textarea>
							<div className="flex justify-center space-x-4 my-4">
								<button
									onClick={handleSave}
									className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
								>
									Save Changes
								</button>
							</div>
						</div>
					) : (
						<div>
							<div className="p-4 text-center">
								<h1 className="text-gray-600">{userData.name}</h1>
								<p className="text-gray-600">{userData.description}</p>
							</div>

							<div className="flex justify-center space-x-4 my-4">
								<button
									onClick={handleEdit}
									className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
								>
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
						</div>
					)}

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
			</div>
		</div>
	);
}
