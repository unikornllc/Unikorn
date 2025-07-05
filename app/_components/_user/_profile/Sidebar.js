"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Globe, Heart, MessageCircle } from "lucide-react";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Badge } from "@/app/_components/_ui/Badge";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";
import { useToast } from "@/app/_components/_hooks/useToast";

const Sidebar = ({
	username,
	languageList,
	interestList,
	socialMediaList,
	editable,
}) => {
	const [userLanguages, setUserLanguages] = useState(languageList || []);
	const [addingLanguage, setAddingLanguage] = useState(false);
	const [newLanguage, setNewLanguage] = useState({
		language: "",
		proficiency: "Beginner",
	});

	const [userInterests, setUserInterests] = useState(interestList || []);
	const [addingInterest, setAddingInterest] = useState(false);
	const [newInterest, setNewInterest] = useState("");

	const [userSocialLinks, setUserSocialLinks] = useState(socialMediaList || []);
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
	const { toast } = useToast();

	const addLanguage = async () => {
		if (!newLanguage.language.trim()) {
			toast({
				title: "Error",
				description: "Please enter a language",
				variant: "destructive",
			});
			return;
		}

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
			toast({
				title: "Success",
				description: "Language added successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to add language",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Language removed successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to remove language",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Language updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update language",
				variant: "destructive",
			});
		} finally {
			setLoading({ ...loading, language: false });
		}
	};

	const addInterest = async () => {
		if (!newInterest.trim()) {
			toast({
				title: "Error",
				description: "Please enter an interest",
				variant: "destructive",
			});
			return;
		}

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
			toast({
				title: "Success",
				description: "Interest added successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: error.response?.data?.message || "Failed to add interest",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Interest removed successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to remove interest",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Interest updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update interest",
				variant: "destructive",
			});
		} finally {
			setLoading({ ...loading, interest: false });
		}
	};

	const addSocialLink = async () => {
		if (!newSocialLink.url.trim()) {
			toast({
				title: "Error",
				description: "Please enter a URL",
				variant: "destructive",
			});
			return;
		}

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
			toast({
				title: "Success",
				description: "Social media link added successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description:
					error.response?.data?.message || "Failed to add social media link",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Social media link removed successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to remove social media link",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Social media link updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update social media link",
				variant: "destructive",
			});
		} finally {
			setLoading({ ...loading, socialMedia: false });
		}
	};

	const getProficiencyColor = (proficiency) => {
		switch (proficiency) {
			case "Proficient":
				return "bg-green-100 text-green-700";
			case "Intermediate":
				return "bg-yellow-100 text-yellow-700";
			default:
				return "bg-blue-100 text-blue-700";
		}
	};

	return (
		<div className="space-y-6">
			{/* Languages Section */}
			<Card className="shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="pb-3">
					<div className="flex justify-between items-center">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Globe className="h-5 w-5 text-blue-500" />
							Languages
						</CardTitle>
						{editable && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setAddingLanguage(true)}
								className="h-8 w-8 p-0"
							>
								<PlusIcon className="w-4 h-4" />
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{editable && addingLanguage && (
						<div className="mb-4 space-y-3 p-3 bg-blue-50 rounded-lg">
							<Input
								type="text"
								value={newLanguage.language}
								onChange={(e) =>
									setNewLanguage({ ...newLanguage, language: e.target.value })
								}
								placeholder="Language"
							/>
							<select
								value={newLanguage.proficiency}
								onChange={(e) =>
									setNewLanguage({
										...newLanguage,
										proficiency: e.target.value,
									})
								}
								className="w-full border border-gray-300 p-2 rounded-md"
							>
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">Intermediate</option>
								<option value="Proficient">Proficient</option>
							</select>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={addLanguage}
									disabled={loading.language}
								>
									{loading.language ? "Adding..." : "Add"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setAddingLanguage(false);
										setNewLanguage({ language: "", proficiency: "Beginner" });
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

					{userLanguages.length === 0 && !addingLanguage ? (
						<div className="text-center py-6">
							<Globe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
							<p className="text-gray-500 text-sm">
								{editable ? "Add languages you speak" : "No languages listed"}
							</p>
							{editable && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setAddingLanguage(true)}
									className="mt-2"
								>
									Add Language
								</Button>
							)}
						</div>
					) : (
						<div className="space-y-3">
							{userLanguages.map((lang) => (
								<div key={lang.id}>
									{editingLanguageId === lang.id ? (
										<div className="p-3 border rounded-lg space-y-3">
											<Input
												type="text"
												value={editLanguageData.language}
												onChange={(e) =>
													setEditLanguageData({
														...editLanguageData,
														language: e.target.value,
													})
												}
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
												className="w-full border border-gray-300 p-2 rounded-md"
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
												/>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
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
													</Button>
													<Button
														size="sm"
														onClick={() => updateLanguage(lang.id)}
														disabled={loading.language}
													>
														{loading.language ? "Saving..." : "Save"}
													</Button>
												</div>
											</div>
										</div>
									) : (
										<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<div className="flex items-center gap-3">
												<span className="font-medium text-gray-900">
													{lang.language}
												</span>
												<Badge
													className={getProficiencyColor(lang.proficiency)}
												>
													{lang.proficiency}
												</Badge>
											</div>
											{editable && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleEditLanguageClick(lang)}
													className="h-8 w-8 p-0"
												>
													<PencilIcon className="w-4 h-4" />
												</Button>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Interests Section */}
			<Card className="shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="pb-3">
					<div className="flex justify-between items-center">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Heart className="h-5 w-5 text-red-500" />
							Interests
						</CardTitle>
						{editable && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setAddingInterest(true)}
								className="h-8 w-8 p-0"
							>
								<PlusIcon className="w-4 h-4" />
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{editable && addingInterest && (
						<div className="mb-4 p-3 bg-red-50 rounded-lg">
							<div className="flex gap-2">
								<Input
									type="text"
									value={newInterest}
									onChange={(e) => setNewInterest(e.target.value)}
									placeholder="Enter an interest"
									className="flex-grow"
								/>
								<Button
									size="sm"
									onClick={addInterest}
									disabled={loading.interest}
								>
									{loading.interest ? "Adding..." : "Add"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setAddingInterest(false);
										setNewInterest("");
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

					{userInterests.length === 0 && !addingInterest ? (
						<div className="text-center py-6">
							<Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
							<p className="text-gray-500 text-sm">
								{editable
									? "Add your interests and hobbies"
									: "No interests listed"}
							</p>
							{editable && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setAddingInterest(true)}
									className="mt-2"
								>
									Add Interest
								</Button>
							)}
						</div>
					) : (
						<div className="flex flex-wrap gap-2">
							{userInterests.map((interest) => (
								<div key={interest.id}>
									{editingInterestId === interest.id ? (
										<div className="flex items-center gap-2 p-2 border rounded-lg bg-white">
											<Input
												type="text"
												value={editInterestData}
												onChange={(e) => setEditInterestData(e.target.value)}
												className="w-32"
												size="sm"
											/>
											<div className="flex gap-1">
												<DeleteButton
													onDelete={() => removeInterest(interest.id)}
													itemType="Interest"
													loading={loading.interest}
													size="small"
												/>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setEditingInterestId(null);
														setEditInterestData("");
													}}
													disabled={loading.interest}
													className="h-6 px-2 text-xs"
												>
													Cancel
												</Button>
												<Button
													size="sm"
													onClick={() => updateInterest(interest.id)}
													disabled={loading.interest}
													className="h-6 px-2 text-xs"
												>
													{loading.interest ? "..." : "Save"}
												</Button>
											</div>
										</div>
									) : (
										<Badge
											variant="secondary"
											className="bg-red-100 text-red-700 hover:bg-red-200 cursor-pointer group relative"
											onClick={() =>
												editable && handleEditInterestClick(interest)
											}
										>
											<span>{interest.name}</span>
											{editable && (
												<PencilIcon className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
											)}
										</Badge>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Social Media Section */}
			<Card className="shadow-sm hover:shadow-md transition-shadow">
				<CardHeader className="pb-3">
					<div className="flex justify-between items-center">
						<CardTitle className="flex items-center gap-2 text-lg">
							<MessageCircle className="h-5 w-5 text-purple-500" />
							Social Media
						</CardTitle>
						{editable && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setAddingSocialLink(true)}
								className="h-8 w-8 p-0"
							>
								<PlusIcon className="w-4 h-4" />
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					{editable && addingSocialLink && (
						<div className="mb-4 space-y-3 p-3 bg-purple-50 rounded-lg">
							<select
								value={newSocialLink.platform}
								onChange={(e) =>
									setNewSocialLink({
										...newSocialLink,
										platform: e.target.value,
									})
								}
								className="w-full border border-gray-300 p-2 rounded-md"
							>
								{platformOptions.map((platform) => (
									<option key={platform} value={platform}>
										{platform}
									</option>
								))}
							</select>
							<Input
								type="url"
								value={newSocialLink.url}
								onChange={(e) =>
									setNewSocialLink({ ...newSocialLink, url: e.target.value })
								}
								placeholder="Profile URL"
							/>
							<div className="flex gap-2">
								<Button
									size="sm"
									onClick={addSocialLink}
									disabled={loading.socialMedia}
								>
									{loading.socialMedia ? "Adding..." : "Add"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => {
										setAddingSocialLink(false);
										setNewSocialLink({ platform: "LinkedIn", url: "" });
									}}
								>
									Cancel
								</Button>
							</div>
						</div>
					)}

					{userSocialLinks.length === 0 && !addingSocialLink ? (
						<div className="text-center py-6">
							<MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
							<p className="text-gray-500 text-sm">
								{editable
									? "Add your social media profiles"
									: "No social media links"}
							</p>
							{editable && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setAddingSocialLink(true)}
									className="mt-2"
								>
									Add Social Link
								</Button>
							)}
						</div>
					) : (
						<div className="space-y-3">
							{userSocialLinks.map((link) => (
								<div key={link.id}>
									{editingSocialId === link.id ? (
										<div className="p-3 border rounded-lg space-y-3">
											<select
												value={editSocialData.platform}
												onChange={(e) =>
													setEditSocialData({
														...editSocialData,
														platform: e.target.value,
													})
												}
												className="w-full border border-gray-300 p-2 rounded-md"
											>
												{platformOptions.map((platform) => (
													<option key={platform} value={platform}>
														{platform}
													</option>
												))}
											</select>
											<Input
												type="url"
												value={editSocialData.url}
												onChange={(e) =>
													setEditSocialData({
														...editSocialData,
														url: e.target.value,
													})
												}
												placeholder="Profile URL"
											/>
											<div className="flex justify-between items-center">
												<DeleteButton
													onDelete={() => removeSocialLink(link.id)}
													itemType="Social Media"
													loading={loading.socialMedia}
													size="small"
												/>
												<div className="flex gap-2">
													<Button
														variant="outline"
														size="sm"
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
													</Button>
													<Button
														size="sm"
														onClick={() => updateSocialLink(link.id)}
														disabled={loading.socialMedia}
													>
														{loading.socialMedia ? "Saving..." : "Save"}
													</Button>
												</div>
											</div>
										</div>
									) : (
										<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
											<a
												href={link.url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
											>
												<img
													src={
														platformIcons[link.platform] || "/placeholder.svg"
													}
													alt={link.platform}
													className="w-6 h-6 rounded"
												/>
												<span className="font-medium">{link.platform}</span>
											</a>
											{editable && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleEditSocialClick(link)}
													className="h-8 w-8 p-0"
												>
													<PencilIcon className="w-4 h-4" />
												</Button>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default Sidebar;
