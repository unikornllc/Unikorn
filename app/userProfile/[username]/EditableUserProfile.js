"use client";
import React, { useEffect, useState } from "react";
import Header from "../../_components/_user_profile/Header";
import About from "../../_components/_user_profile/About";
import Experience from "../../_components/_user_profile/Experience";
import Education from "../../_components/_user_profile/Education";
import Expertise from "../../_components/_user_profile/Expertise";
import Certifications from "../../_components/_user_profile/Certifications";
import Sidebar from "../../_components/_user_profile/Sidebar";
import Files from "../../_components/_user_profile/Files";
import axios from "axios";
import SettingsPage from "@/app/_components/_settings/Settings";
import CalendlyWidget from "@/app/_components/_calendly/CalendlyWidget";
import CalendlyEventTypes from "@/app/_components/_calendly/CalendlyEventTypes";
import ManageSub from "@/app/_components/_user_profile/ManageSub";

export default function EditableUserProfile({ user, editable = false }) {
	const [loading, setLoading] = useState(true);

	const handleFollow = async () => {
		try {
			setLoading(true);
			const follow = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/followUser`,
				{
					followerUsername: user.username,
				},
				{
					withCredentials: true,
				},
			);
			setIsFollowing(true);
			console.log(follow.data);
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
					followerUsername: user.username,
				},
				{
					withCredentials: true,
				},
			);
			setIsFollowing(false);
			console.log(follow.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	console.log(editable);
	// }, []);

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
					tier: user.tier,
					email: user.email,
					name: user.name,
					title: user.title,
					unikornVerified: false,
					calendlyIntegration: user.calendly_integration,
				}}
				editable
			/>

			<div className="container mx-auto flex flex-col lg:flex-row">
				<div className="w-full lg:w-2/3 p-4">
					<ManageSub tier={user.tier} />
					{user.calendly_integration && (
						<CalendlyEventTypes></CalendlyEventTypes>
					)}
					<About
						username={user.username}
						aboutList={{
							description: user.description,
						}}
						editable
					/>
					<Experience
						username={user.username}
						corporateExperienceList={user.corporate_experience}
						startupExperienceList={user.startup_experience}
						editable
					/>
					<Education
						username={user.username}
						educationList={user.education}
						editable
					/>
					<Expertise
						username={user.username}
						expertiseList={user.expertise}
						editable
					/>
					<Certifications
						username={user.username}
						certificationList={user.certifications_courses}
						editable
					/>
					<Files username={user.username} editable />
				</div>
				<div className="w-full lg:w-1/3 p-4">
					<Sidebar
						username={user.username}
						languageList={user.language}
						interestList={user.interest}
						socialMediaList={user.social_media}
						editable
					/>
				</div>
			</div>
		</div>
	);
}
