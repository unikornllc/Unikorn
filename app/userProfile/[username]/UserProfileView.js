"use client";
import React, { useState } from "react";
import Header from "../../_components/_user/_user_profile/Header";
import About from "../../_components/_user/_user_profile/About";
import Experience from "../../_components/_user/_user_profile/Experience";
import Education from "../../_components/_user/_user_profile/Education";
import Expertise from "../../_components/_user/_user_profile/Expertise";
import Certifications from "../../_components/_user/_user_profile/Certifications";
import Sidebar from "../../_components/_user/_user_profile/Sidebar";
import Files from "../../_components/_user/_user_profile/Files";
import axios from "axios";
import CalendlySchedule from "@/app/_components/_shared/_calendly/CalendlySchedule";

export default function EditableUserProfile({ user, editable = false }) {
	const [loading, setLoading] = useState(false);
	const [isFollowing, setIsFollowing] = useState(user.isFollowing);
	const [availableSlots, setAvailableSlots] = useState([]);
	const [selectedSlot, setSelectedSlot] = useState("");
	const [newSlots, setNewSlots] = useState("");
	const isPro = user.tier;

	const handleFollow = async () => {
		try {
			setLoading(true);
			const follow = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/followUser`,
				{
					username: user.username,
					isUser: true,
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
					username: user.username,
					isUser: true,
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

	if (!user)
		return (
			<div className="bg-gray-100 min-h-screen py-8">
				<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<p className="text-center p-4">Loading...</p>
				</div>
			</div>
		);

	return (
		<div className="bg-secondary min-h-screen">
			<Header
				user={{
					username: user.username,
					name: user.name,
					title: user.title,
					unikornVerified: false,
				}}
			/>
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

				{(isPro == "Pro" || isPro == "Hunter") && (
					<a href={`/userChat`}>
						<button
							className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
							disabled={loading}
						>
							chat
						</button>
					</a>
				)}

				<a
					href={"user.calendly_link"}
					target="_blank"
					className="bg-gray-200 text-gray-800 px-4 py-2 rounded shadow"
					rel="noopener noreferrer"
				>
					View Full Calendly
				</a>
			</div>
			<div className="container mx-auto flex flex-col lg:flex-row">
				<div className="w-full lg:w-2/3 p-4">
					{user.calendly_integration && (
						<div className="bg-white p-6 rounded-lg shadow mb-6 relative">
							<h3 className="text-2xl font-semibold text-textPrimary mb-4">
								User's Schedules
							</h3>
							<CalendlySchedule username={user.username}></CalendlySchedule>
						</div>
					)}
					<About
						username={user.username}
						aboutList={{
							description: user.description,
						}}
					/>
					<Experience
						username={user.username}
						corporateExperienceList={user.corporate_experience}
						startupExperienceList={user.startup_experience}
					/>
					<Education username={user.username} educationList={user.education} />
					<Expertise username={user.username} expertiseList={user.expertise} />
					<Certifications
						username={user.username}
						certificationList={user.certifications_courses}
					/>
					<Files username={user.username} />
				</div>
				<div className="w-full lg:w-1/3 p-4">
					<Sidebar
						username={user.username}
						languageList={user.language}
						interestList={user.interest}
						socialMediaList={user.social_media}
					/>
				</div>
			</div>
		</div>
	);
}
