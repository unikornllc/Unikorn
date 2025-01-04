import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const Sidebar = ({ user, userId }) => {
	const [userLanguages, setUserLanguages] = useState(null);
	const [addingLanguage, setAddingLanguage] = useState(false);
	const [newLanguage, setNewLanguage] = useState({
		language: "",
		proficiency: "Beginner",
	});

	const [userInterests, setUserInterests] = useState(null);
	const [addingInterest, setAddingInterest] = useState(false);
	const [newInterest, setNewInterest] = useState("");

	const [userSocialLinks, setUserSocialLinks] = useState(null);
	const [addingSocialLink, setAddingSocialLink] = useState(false);
	const [newSocialLink, setNewSocialLink] = useState({
		platform: "LinkedIn",
		url: "",
	});
	const platformOptions = ["LinkedIn", "X", "Meetup"];
	const platformIcons = {
		LinkedIn:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRokEYt0yyh6uNDKL8uksVLlhZ35laKNQgZ9g&s",
		X: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/X_icon_2.svg/1483px-X_icon_2.svg.png",
		Meetup: "https://cdn-icons-png.flaticon.com/512/3984/3984399.png",
	};
	const addLanguage = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createLanguage`,
				{
					userId,
					...newLanguage,
				},
				{ withCredentials: true },
			);

			setUserLanguages([...userLanguages, response.data.language]);
			setNewLanguage({ language: "", proficiency: "Beginner" });
			setAddingLanguage(false);
		} catch (error) {
			console.error("Error adding language:", error);
		}
	};

	const removeLanguage = async (languageId) => {
		try {
			await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/deleteLanguage`, {
				params: { languageId },
				withCredentials: true,
			});
			setUserLanguages(userLanguages.filter((lang) => lang.id !== languageId));
		} catch (error) {
			console.error("Error removing language:", error);
		}
	};

	const addInterest = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createInterest`,
				{
					userId,
					name: newInterest,
				},
				{ withCredentials: true },
			);
			setUserInterests([...userInterests, response.data.interest]);
			setNewInterest("");
			setAddingInterest(false);
		} catch (error) {
			console.error("Error adding interest:", error);
		}
	};

	const removeInterest = async (interestId) => {
		try {
			await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/deleteInterest`, {
				params: { interestId },
				withCredentials: true,
			});
			setUserInterests(
				userInterests.filter((interest) => interest.id !== interestId),
			);
		} catch (error) {
			console.error("Error removing interest:", error);
		}
	};

	const addSocialLink = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createSocialMedia`,
				{
					userId,
					...newSocialLink,
				},
				{ withCredentials: true },
			);
			setUserSocialLinks([...userSocialLinks, response.data.socialMedia]);
			setNewSocialLink({ platform: "LinkedIn", url: "" });
			setAddingSocialLink(false);
		} catch (error) {
			console.error("Error adding social media link:", error);
		}
	};

	const removeSocialLink = async (linkId) => {
		try {
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/deleteSocialMedia`,
				{
					params: { socialMediaId: linkId },
					withCredentials: true,
				},
			);
			setUserSocialLinks(userSocialLinks.filter((link) => link.id !== linkId));
		} catch (error) {
			console.error("Error removing social media link:", error);
		}
	};
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllLanguage`, {
						params: { userId },
						withCredentials: true,
					})
					.then((response) => setUserLanguages(response.data.language));
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllInterest`, {
						params: { userId },
						withCredentials: true,
					})
					.then((response) => setUserInterests(response.data.interest));
				await axios
					.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllSocialMedia`, {
						params: { userId },
						withCredentials: true,
					})
					.then((response) => setUserSocialLinks(response.data.socialMedia));
			} catch (err) {
				console.error("Error fetching user Data:", err);
			}
		};
		fetchUserData();
	}, []);
	return (
		<div className="space-y-6">
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-textPrimary">Languages</h3>
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingLanguage(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				</div>
				{addingLanguage && (
					<div className="mb-4">
						<input
							type="text"
							value={newLanguage.language}
							onChange={(e) =>
								setNewLanguage({ ...newLanguage, language: e.target.value })
							}
							className="border border-gray-300 p-2 rounded-md w-full mb-2"
							placeholder="Language"
						/>
						<select
							value={newLanguage.proficiency}
							onChange={(e) =>
								setNewLanguage({ ...newLanguage, proficiency: e.target.value })
							}
							className="border border-gray-300 p-2 rounded-md w-full mb-2"
						>
							<option value="Beginner">Beginner</option>
							<option value="Intermediate">Intermediate</option>
							<option value="Proficient">Proficient</option>
						</select>
						<div className="flex">
							<button
								className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
								onClick={addLanguage}
							>
								Add
							</button>
							<button
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
								onClick={() => {
									setAddingLanguage(false);
									setNewLanguage({ language: "", proficiency: "Beginner" });
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
				<ul className="list-disc list-inside space-y-2">
					{userLanguages &&
						userLanguages.map((lang) => (
							<li
								key={lang.id}
								className="text-textSecondary flex items-center justify-between"
							>
								<span>
									{lang.language} - {lang.proficiency}
								</span>
								<button
									className="p-2 text-red-500 hover:text-red-700"
									onClick={() => removeLanguage(lang.id)}
								>
									<TrashIcon className="w-5 h-5" />
								</button>
							</li>
						))}
				</ul>
			</div>
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-textPrimary">Interests</h3>
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingInterest(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				</div>
				{addingInterest && (
					<div className="mb-4 flex">
						<input
							type="text"
							value={newInterest}
							onChange={(e) => setNewInterest(e.target.value)}
							className="border border-gray-300 p-2 rounded-md flex-grow mr-2"
							placeholder="Enter a new interest"
						/>
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
							onClick={addInterest}
						>
							Add
						</button>
						<button
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 ml-2"
							onClick={() => {
								setAddingInterest(false);
								setNewInterest("");
							}}
						>
							Cancel
						</button>
					</div>
				)}
				<div className="flex flex-wrap">
					{userInterests &&
						userInterests.map((interest) => (
							<div
								key={interest.id}
								className="bg-gray-200 text-gray-700 px-3 py-1 m-1 rounded-full flex items-center"
							>
								<span>{interest.name}</span>
								<button
									className="ml-2 text-red-500 hover:text-red-700"
									onClick={() => removeInterest(interest.id)}
								>
									<TrashIcon className="w-4 h-4" />
								</button>
							</div>
						))}
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-textPrimary">
						Social Media
					</h3>
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingSocialLink(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				</div>
				{addingSocialLink && (
					<div className="mb-4">
						<select
							value={newSocialLink.platform}
							onChange={(e) =>
								setNewSocialLink({ ...newSocialLink, platform: e.target.value })
							}
							className="border border-gray-300 p-2 rounded-md w-full mb-2"
						>
							{platformOptions.map((platform) => (
								<option key={platform} value={platform}>
									{platform}
								</option>
							))}
						</select>
						<input
							type="url"
							value={newSocialLink.url}
							onChange={(e) =>
								setNewSocialLink({ ...newSocialLink, url: e.target.value })
							}
							className="border border-gray-300 p-2 rounded-md w-full mb-2"
							placeholder="Profile URL"
						/>
						<div className="flex">
							<button
								className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
								onClick={addSocialLink}
							>
								Add
							</button>
							<button
								className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
								onClick={() => {
									setAddingSocialLink(false);
									setNewSocialLink({ platform: "LinkedIn", url: "" });
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				)}
				<div className="space-y-2">
					{userSocialLinks &&
						userSocialLinks.map((link) => (
							<div key={link.id} className="flex items-center justify-between">
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center space-x-2 text-textSecondary hover:text-primary"
								>
									<img
										src={platformIcons[`${link.platform}`]}
										alt={link.platform}
										className="w-6 h-6"
									/>
									<span>{link.platform}</span>
								</a>
								<button
									className="p-2 text-red-500 hover:text-red-700"
									onClick={() => removeSocialLink(link.id)}
								>
									<TrashIcon className="w-5 h-5" />
								</button>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
