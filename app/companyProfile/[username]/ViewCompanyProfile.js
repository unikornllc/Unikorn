"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FundingComponent } from "@/app/_components/_company/_funding/FundingComponent";

export default function ViewCompanyProfile({ company }) {
	const [loading, setLoading] = useState(false);
	const [isFollowing, setIsFollowing] = useState(company.isFollowing);
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [newSlots, setNewSlots] = useState("");
	const isHunter = company.tier;

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

	const handleFollow = async () => {
		try {
			setLoading(true);
			const follow = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/followUser`,
				{
					username: company.username,
					isUser: false,
				},
				{
					withCredentials: true,
				},
			);
			setIsFollowing(true);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleUnfollow = async () => {
		try {
			setLoading(true);
			const follow = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/unfollowUser`,
				{
					username: company.username,
					isUser: false,
				},
				{
					withCredentials: true,
				},
			);
			setIsFollowing(false);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

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
						<h1 className="text-2xl font-bold">{company.username}</h1>
						<p className="text-gray-600">{company.website}</p>
						<h1 className="text-gray-600">{company.name}</h1>
						<p className="text-gray-600">{company.description}</p>
						<p className="text-gray-600">{company.type}</p>
						<p className="text-gray-600">{company.industry}</p>
						<p className="text-gray-600">{company.hqLocation}</p>
					</div>
					<div>
						<div className="flex justify-center space-x-4 my-4">
							{isFollowing ? (
								<button
									onClick={handleUnfollow}
									className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
									disabled={loading}
								>
									unfollow
								</button>
							) : (
								<button
									onClick={handleFollow}
									className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
									disabled={loading}
								>
									follow
								</button>
							)}

							{(company.tier == "Hunter" || company.tier == "Pro") && (
								<a href={`/userChat`}>
									<button
										className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
										disabled={loading}
									>
										chat
									</button>
								</a>
							)}
						</div>
					</div>
					<FundingComponent companyUsername={company.account.username} />

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
