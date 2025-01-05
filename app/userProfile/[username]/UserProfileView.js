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

export default function EditableUserProfile({ user, editable = false }) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(editable);
	}, []);

	// if (!user && !loading)
	// 	return (
	// 		<div className="bg-gray-100 min-h-screen py-8">
	// 			<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
	// 				<p className="text-center p-4">User not found.</p>
	// 			</div>
	// 		</div>
	// 	);

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
				username={user.username}
				userData={{
					name: user.name,
					title: user.title,
					unikornVerified: false,
				}}
			/>
			<div className="container mx-auto flex flex-col lg:flex-row">
				<div className="w-full lg:w-2/3 p-4">
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
