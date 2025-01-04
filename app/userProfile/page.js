"use client";
import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";

import Header from "../_components/userProfile/Header";
import About from "../_components/userProfile/About";
import Experience from "../_components/userProfile/Experience";
import Education from "../_components/userProfile/Education";
import Skills from "../_components/userProfile/Skills";
import Certifications from "../_components/userProfile/Certifications";
import Sidebar from "../_components/userProfile/Sidebar";
import Files from "../_components/userProfile/Files";
import axios from "axios";

const ProfilePage = () => {
	// const router = useRouter();
	// const { username } = router.query;

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getOneUser`, {
						params: { username: "hazem" },
						withCredentials: true,
					})
					.then((response) => {
						setUser(response.data.user);
						// console.log(response.data.user);
						setLoading(false);
					});
			} catch (err) {
				console.error("Error fetching user data:", err);
			}
		};
		fetchUserData();
	}, []);

	if (!user && !loading)
		return (
			<div className="bg-gray-100 min-h-screen py-8">
				<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<p className="text-center p-4">User not found.</p>
				</div>
			</div>
		);
	if (loading)
		return (
			<div className="bg-gray-100 min-h-screen py-8">
				<div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
					<p className="text-center p-4">Loading...</p>
				</div>
			</div>
		);
	return (
		<div className="bg-backgroundLight min-h-screen">
			<Header user={user} userId={user.id} />
			<div className="container mx-auto flex flex-col lg:flex-row">
				<div className="w-full lg:w-2/3 p-4">
					<About user={user} userId={user.id} />
					<Experience user={user} userId={user.id} />
					<Education user={user} userId={user.id} />
					<Skills user={user} userId={user.id} />
					<Certifications user={user} userId={user.id} />
					<Files user={user} userId={user.id} />
				</div>
				<div className="w-full lg:w-1/3 p-4">
					<Sidebar user={user} userId={user.id} />
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
