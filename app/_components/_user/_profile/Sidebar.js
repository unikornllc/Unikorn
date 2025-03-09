import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";

const Sidebar = ({
	username,
	languageList,
	interestList,
	socialMediaList,
	editable,
}) => {
	const [userLanguages, setUserLanguages] = useState(languageList);
	const [addingLanguage, setAddingLanguage] = useState(false);
	const [newLanguage, setNewLanguage] = useState({
		language: "",
		proficiency: "Beginner",
	});

	const [userInterests, setUserInterests] = useState(interestList);
	const [addingInterest, setAddingInterest] = useState(false);
	const [newInterest, setNewInterest] = useState("");

	const [userSocialLinks, setUserSocialLinks] = useState(socialMediaList);
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

	const [editingLanguageId, setEditingLanguageId] = useState(null);
	const [editLanguageData, setEditLanguageData] = useState({
		language: "",
		proficiency: "Beginner",
	});
	const [editingInterestId, setEditingInterestId] = useState(null);
	const [editInterestData, setEditInterestData] = useState("");

	const [editingSocialId, setEditingSocialId] = useState(null);
	const [editSocialData, setEditSocialData] = useState({
		platform: "LinkedIn",
		url: "",
	});

	const [loading, setLoading] = useState({
		language: false,
		interest: false,
		socialMedia: false,
	});

	const { updateItem } = useUpdateItem();

	const addLanguage = async () => {
		try {
			setLoading({ ...loading, language: true });
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createLanguage`,
				{
					username,
					...newLanguage,
				},
				{ withCredentials: true },
			);

			setUserLanguages([...userLanguages, response.data.language]);
			setNewLanguage({ language: "", proficiency: "Beginner" });
			setAddingLanguage(false);
		} catch (error) {
			console.error("Error adding language:", error);
		} finally {
			setLoading({ ...loading, language: false });
		}
	};

	const removeLanguage = async (languageId) => {
		try {
			setLoading({ ...loading, language: true });
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteLanguage`,
				{
					params: { languageId },
					withCredentials: true,
				},
			);
			setUserLanguages(userLanguages.filter((lang) => lang.id !== languageId));
		} catch (error) {
			console.error("Error removing language:", error);
		} finally {
			setLoading({ ...loading, language: false });
		}
	};

	const handleEditLanguageClick = (lang) => {
		setEditingLanguageId(lang.id);
		setEditLanguageData({
			language: lang.language || "",
			proficiency: lang.proficiency || "Beginner",
		});
	};

	const updateLanguage = async (languageId) => {
		try {
			setLoading({ ...loading, language: true });

			const updatedItem = await updateItem(
				"language",
				languageId,
				editLanguageData,
			);

			setUserLanguages((prevLangs) =>
				prevLangs.map((lang) => (lang.id === languageId ? updatedItem : lang)),
			);

			setEditingLanguageId(null);
			setEditLanguageData({ language: "", proficiency: "Beginner" });
		} catch (error) {
			console.error("Error updating language:", error);
		} finally {
			setLoading({ ...loading, language: false });
		}
	};

	const addInterest = async () => {
		try {
			setLoading({ ...loading, interest: true });
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createInterest`,
				{
					username,
					name: newInterest,
				},
				{ withCredentials: true },
			);
			setUserInterests([...userInterests, response.data.interest]);
			setNewInterest("");
			setAddingInterest(false);
		} catch (error) {
			console.error("Error adding interest:", error);
		} finally {
			setLoading({ ...loading, interest: false });
		}
	};

	const removeInterest = async (interestId) => {
		try {
			setLoading({ ...loading, interest: true });
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteInterest`,
				{
					params: { interestId },
					withCredentials: true,
				},
			);
			setUserInterests(
				userInterests.filter((interest) => interest.id !== interestId),
			);
		} catch (error) {
			console.error("Error removing interest:", error);
		} finally {
			setLoading({ ...loading, interest: false });
		}
	};
	const handleEditInterestClick = (interest) => {
		setEditingInterestId(interest.id);
		setEditInterestData(interest.name);
	};

	const updateInterest = async (interestId) => {
		try {
			setLoading({ ...loading, interest: true });
			console.log(editInterestData);
			const updatedItem = await updateItem("interest", interestId, {
				name: editInterestData,
			});

			setUserInterests((prevInterests) =>
				prevInterests.map((interest) =>
					interest.id === interestId ? updatedItem : interest,
				),
			);

			setEditingInterestId(null);
			setEditInterestData("");
		} catch (error) {
			console.error("Error updating interest:", error);
		} finally {
			setLoading({ ...loading, interest: false });
		}
	};

	const addSocialLink = async () => {
		try {
			setLoading({ ...loading, socialMedia: true });
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createSocialMedia`,
				{
					username,
					...newSocialLink,
				},
				{ withCredentials: true },
			);
			setUserSocialLinks([...userSocialLinks, response.data.socialMedia]);
			setNewSocialLink({ platform: "LinkedIn", url: "" });
			setAddingSocialLink(false);
		} catch (error) {
			console.error("Error adding social media link:", error);
		} finally {
			setLoading({ ...loading, socialMedia: false });
		}
	};

	const removeSocialLink = async (linkId) => {
		try {
			setLoading({ ...loading, socialMedia: true });
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteSocialMedia`,
				{
					params: { socialMediaId: linkId },
					withCredentials: true,
				},
			);
			setUserSocialLinks(userSocialLinks.filter((link) => link.id !== linkId));
		} catch (error) {
			console.error("Error removing social media link:", error);
		} finally {
			setLoading({ ...loading, socialMedia: false });
		}
	};

	const handleEditSocialClick = (social) => {
		setEditingSocialId(social.id);
		setEditSocialData({
			platform: social.platform || "LinkedIn",
			url: social.url || "",
		});
	};

	const updateSocialLink = async (socialId) => {
		try {
			setLoading({ ...loading, socialMedia: true });
			const updatedItem = await updateItem(
				"socialMedia",
				socialId,
				editSocialData,
			);

			setUserSocialLinks((prevLinks) =>
				prevLinks.map((link) => (link.id === socialId ? updatedItem : link)),
			);

			setEditingSocialId(null);
			setEditSocialData({ platform: "LinkedIn", url: "" });
		} catch (error) {
			console.error("Error updating social media link:", error);
		} finally {
			setLoading({ ...loading, socialMedia: false });
		}
	};
	// useEffect(() => {
	// 	const fetchUserData = async () => {
	// 		try {
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllLanguage`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => setUserLanguages(response.data.language));
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllInterest`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => setUserInterests(response.data.interest));
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllSocialMedia`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => setUserSocialLinks(response.data.socialMedia));
	// 		} catch (err) {
	// 			console.error("Error fetching user Data:", err);
	// 		}
	// 	};
	// 	fetchUserData();
	// }, []);

	return (
		<div className="space-y-6">
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-textPrimary">Languages</h3>
					{editable && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingLanguage(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
				</div>
				{editable && addingLanguage && (
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
								disabled={loading.language}
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
							<li key={lang.id} className="list-none">
								{editingLanguageId === lang.id ? (
									<div className="border p-4 rounded-lg">
										<input
											type="text"
											value={editLanguageData.language}
											onChange={(e) =>
												setEditLanguageData({
													...editLanguageData,
													language: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Language"
										/>
										<select
											value={editLanguageData.proficiency}
											onChange={(e) =>
												setEditLanguageData({
													...editLanguageData,
													proficiency: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
										>
											<option value="Beginner">Beginner</option>
											<option value="Intermediate">Intermediate</option>
											<option value="Proficient">Proficient</option>
										</select>
										<div className="flex justify-between items-center">
											<DeleteButton
												onDelete={() => removeLanguage(lang.id)}
												itemType="Language"
												loading={loading.language}
												size="small"
												className="ml-2"
											/>
											<div className="flex space-x-2">
												<button
													className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
													onClick={() => {
														setEditingLanguageId(null);
														setEditLanguageData({
															language: "",
															proficiency: "Beginner",
														});
													}}
													disabled={loading.language}
												>
													Cancel
												</button>
												<button
													className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
													onClick={() => updateLanguage(lang.id)}
													disabled={loading.language}
												>
													Save
												</button>
											</div>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between">
										<span>
											{lang.language} - {lang.proficiency}
										</span>
										{editable && (
											<button
												className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
												onClick={() => handleEditLanguageClick(lang)}
											>
												<PencilIcon className="w-5 h-5 text-gray-600" />
											</button>
										)}
									</div>
								)}
							</li>
						))}
				</ul>
			</div>
			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-textPrimary">Interests</h3>
					{editable && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingInterest(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
				</div>

				{editable && addingInterest && (
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
							disabled={loading.interest}
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
							<div key={interest.id}>
								{editingInterestId === interest.id ? (
									<div className="mb-2 flex items-center space-x-2">
										<input
											type="text"
											value={editInterestData}
											onChange={(e) => setEditInterestData(e.target.value)}
											className="border border-gray-300 p-2 rounded-md"
											placeholder="Interest"
										/>
										<div className="flex space-x-2">
											<DeleteButton
												onDelete={() => removeInterest(interest.id)}
												itemType="Interest"
												loading={loading.interest}
												size="small"
												className="ml-2"
											/>
											<button
												className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
												onClick={() => {
													setEditingInterestId(null);
													setEditInterestData("");
												}}
												disabled={loading.interest}
											>
												Cancel
											</button>
											<button
												className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
												onClick={() => updateInterest(interest.id)}
												disabled={loading.interest}
											>
												Save
											</button>
										</div>
									</div>
								) : (
									<div className="bg-gray-200 text-gray-700 px-3 py-1 m-1 rounded-full flex items-center">
										<span>{interest.name}</span>
										{editable && (
											<div className="flex ml-2">
												<button
													className="p-1 rounded-full bg-gray-300 hover:bg-gray-400 mr-1"
													onClick={() => handleEditInterestClick(interest)}
												>
													<PencilIcon className="w-3 h-3 text-gray-600" />
												</button>
											</div>
										)}
									</div>
								)}
							</div>
						))}
				</div>
			</div>

			<div className="bg-white p-6 rounded-lg shadow">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-textPrimary">
						Social Media
					</h3>
					{editable && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingSocialLink(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
				</div>

				{editable && addingSocialLink && (
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
								disabled={loading.socialMedia}
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
							<div key={link.id}>
								{editingSocialId === link.id ? (
									<div className="border p-4 rounded-lg">
										<select
											value={editSocialData.platform}
											onChange={(e) =>
												setEditSocialData({
													...editSocialData,
													platform: e.target.value,
												})
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
											value={editSocialData.url}
											onChange={(e) =>
												setEditSocialData({
													...editSocialData,
													url: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Profile URL"
										/>
										<div className="flex justify-between items-center">
											<DeleteButton
												onDelete={() => removeSocialLink(link.id)}
												itemType="Social Media"
												loading={loading.socialMedia}
												size="small"
												className="ml-2"
											/>
											<div className="flex space-x-2">
												<button
													className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
													onClick={() => {
														setEditingSocialId(null);
														setEditSocialData({
															platform: "LinkedIn",
															url: "",
														});
													}}
													disabled={loading.socialMedia}
												>
													Cancel
												</button>
												<button
													className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
													onClick={() => updateSocialLink(link.id)}
													disabled={loading.socialMedia}
												>
													Save
												</button>
											</div>
										</div>
									</div>
								) : (
									<div className="flex items-center justify-between">
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
										{editable && (
											<button
												className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
												onClick={() => handleEditSocialClick(link)}
											>
												<PencilIcon className="w-5 h-5 text-gray-600" />
											</button>
										)}
									</div>
								)}
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
