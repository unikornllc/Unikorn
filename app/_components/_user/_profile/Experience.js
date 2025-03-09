import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { Switch } from "@/app/_components/_ui/Switch";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";

const Experience = ({
	username,
	corporateExperienceList,
	startupExperienceList,
	editable,
}) => {
	const [activeTab, setActiveTab] = useState("Corporate");

	const [corporateExperiences, setCorporateExperiences] = useState(
		corporateExperienceList,
	);
	const [addingCorporateExp, setAddingCorporateExp] = useState(false);
	const [newCorporateExp, setNewCorporateExp] = useState({
		jobTitle: "",
		companyName: "",
		startDate: "",
		endDate: "",
		responsibilities: "",
	});

	const [startupExperiences, setStartupExperiences] = useState(
		startupExperienceList,
	);
	const [addingStartupExp, setAddingStartupExp] = useState(false);
	const [newStartupExp, setNewStartupExp] = useState({
		startupName: "",
		role: "",
		description: "",
	});
	const [editingCorporateId, setEditingCorporateId] = useState(null);
	const [editingStartupId, setEditingStartupId] = useState(null);
	const [editData, setEditData] = useState({
		jobTitle: "",
		companyName: "",
		startDate: "",
		endDate: "",
		responsibilities: "",
		// for startup
		startupName: "",
		role: "",
		description: "",
	});

	const { updateItem } = useUpdateItem();

	const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
	const [isEditCurrentlyWorking, setIsEditCurrentlyWorking] = useState(false);

	const [loading, setLoading] = useState(false);

	const addCorporateExperience = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createCorporateExperience`,
				{
					username,
					...newCorporateExp,
				},
				{ withCredentials: true },
			);
			setCorporateExperiences((prevExps) => [
				...prevExps,
				response.data.corporateExperience,
			]);
			setNewCorporateExp({
				jobTitle: "",
				companyName: "",
				startDate: "",
				endDate: "",
				responsibilities: "",
			});
			setAddingCorporateExp(false);
		} catch (error) {
			console.error("Error adding corporate experience:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeCorporateExperience = async (experienceId) => {
		try {
			setLoading(true);
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteCorporateExperience`,
				{
					params: { corporateExperienceId: experienceId },
					withCredentials: true,
				},
			);
			setCorporateExperiences(
				corporateExperiences.filter((exp) => exp.id !== experienceId),
			);
		} catch (error) {
			console.error("Error removing corporate experience:", error);
		} finally {
			setLoading(false);
		}
	};
	const updateCorporateExperience = async (experienceId) => {
		try {
			setLoading(true);
			const experienceData = {
				...editData,
				endDate: isEditCurrentlyWorking ? null : editData.endDate,
				id: experienceId,
			};
			// const response = await axios.put(
			// 	`${process.env.NEXT_PUBLIC_SERVER}/api/updateCorporateExperience`,
			// 	{
			// 		username,
			// 		...experienceData,
			// 		id: experienceId,
			// 	},
			// 	{ withCredentials: true }
			// );
			const updatedItem = await updateItem(
				"corporateExperience",
				experienceId,
				experienceData,
			);

			setCorporateExperiences((prevExps) =>
				prevExps.map((exp) => (exp.id === experienceId ? updatedItem : exp)),
			);

			setEditingCorporateId(null);
			setEditData({});
			setIsEditCurrentlyWorking(false);
		} catch (error) {
			console.error("Error updating corporate experience:", error);
		} finally {
			setLoading(false);
		}
	};

	const addStartupExperience = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createStartupExperience`,
				{
					username,
					...newStartupExp,
				},
				{ withCredentials: true },
			);
			setStartupExperiences((prevExps) => [
				...prevExps,
				response.data.startupExperience,
			]);
			console.log();
			setNewStartupExp({
				startupName: "",
				role: "",
				description: "",
			});
			setAddingStartupExp(false);
		} catch (error) {
			console.error("Error adding startup experience:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeStartupExperience = async (experienceId) => {
		try {
			setLoading(true);
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteStartupExperience`,
				{
					params: { startupExperienceId: experienceId },
					withCredentials: true,
				},
			);
			setStartupExperiences(
				startupExperiences.filter((exp) => exp.id !== experienceId),
			);
		} catch (error) {
			console.error("Error removing startup experience:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateStartupExperience = async (experienceId) => {
		try {
			setLoading(true);
			// const response = await axios.put(
			// 	`${process.env.NEXT_PUBLIC_SERVER}/api/updateStartupExperience`,
			// 	{
			// 		username,
			// 		...editData,
			// 		id: experienceId,
			// 	},
			// 	{ withCredentials: true }
			// );
			const updatedItem = await updateItem(
				"startupExperience",
				experienceId,
				editData,
			);
			setStartupExperiences((prevExps) =>
				prevExps.map((exp) => (exp.id === experienceId ? updatedItem : exp)),
			);

			setEditingStartupId(null);
			setEditData({});
		} catch (error) {
			console.error("Error updating startup experience:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleEditClick = (exp, type) => {
		if (type === "corporate") {
			setEditingCorporateId(exp.id);
			setEditData({
				jobTitle: exp.jobTitle || "",
				companyName: exp.companyName || "",
				startDate: exp.startDate || "",
				endDate: exp.endDate || "",
				responsibilities: exp.responsibilities || "",
			});
			if (!exp.endDate) {
				setIsEditCurrentlyWorking(true);
			}
		} else {
			setEditingStartupId(exp.id);
			setEditData({
				startupName: exp.startupName || "",
				role: exp.role || "",
				description: exp.description || "",
			});
		}
	};
	const handleCancelEdit = (type) => {
		if (type === "corporate") {
			setEditingCorporateId(null);
			setEditData({
				jobTitle: "",
				companyName: "",
				startDate: "",
				endDate: "",
				responsibilities: "",
			});
			setIsEditCurrentlyWorking(false);
		} else {
			setEditingStartupId(null);
			setEditData({
				startupName: "",
				role: "",
				description: "",
			});
		}
	};

	const formatDateForInput = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).toISOString().split("T")[0];
	};

	// useEffect(() => {
	// 	const fetchUserExperiences = async () => {
	// 		try {
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllCorporateExperience`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => {
	// 					// console.log(response.data.corporateExperience);
	// 					setCorporateExperiences(response.data.corporateExperience);
	// 				});
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllStartupExperience`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => {
	// 					// console.log(response.data.startupExperience);
	// 					setStartupExperiences(response.data.startupExperience);
	// 				});
	// 		} catch (err) {
	// 			console.error("Error fetching user Experiences:", err);
	// 		}
	// 	};
	// 	fetchUserExperiences();
	// }, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">Experience</h3>
				<div className="flex space-x-4">
					{editable && activeTab === "Corporate" && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingCorporateExp(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
					{editable && activeTab === "Startup" && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingStartupExp(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
				</div>
			</div>
			<div className="mb-4 border-b border-gray-200">
				<button
					className={`mr-4 pb-2 ${
						activeTab === "Corporate"
							? "border-b-2 border-primary text-primary font-semibold"
							: "text-gray-600"
					}`}
					onClick={() => setActiveTab("Corporate")}
				>
					Corporate
				</button>
				<button
					className={`pb-2 ${
						activeTab === "Startup"
							? "border-b-2 border-primary text-primary font-semibold"
							: "text-gray-600"
					}`}
					onClick={() => setActiveTab("Startup")}
				>
					Startup
				</button>
			</div>

			{activeTab === "Corporate" && (
				<div>
					{editable && addingCorporateExp && (
						<div className="mb-6">
							<input
								type="text"
								value={newCorporateExp.jobTitle}
								onChange={(e) =>
									setNewCorporateExp({
										...newCorporateExp,
										jobTitle: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Job Title"
							/>
							<input
								type="text"
								value={newCorporateExp.companyName}
								onChange={(e) =>
									setNewCorporateExp({
										...newCorporateExp,
										companyName: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Company Name"
							/>
							<div className="flex flex-col space-y-2 mb-2">
								<div className="flex items-center space-x-2">
									<Switch
										checked={isCurrentlyWorking}
										onCheckedChange={(checked) => {
											setIsCurrentlyWorking(checked);
											if (checked) {
												setNewCorporateExp({
													...newCorporateExp,
													endDate: "",
												});
											}
										}}
									/>
									<label className="text-sm text-gray-600">
										I am currently working here
									</label>
								</div>
								<div className="flex space-x-2">
									<input
										type="date"
										value={formatDateForInput(newCorporateExp.startDate)}
										onChange={(e) =>
											setNewCorporateExp({
												...newCorporateExp,
												startDate: e.target.value,
											})
										}
										className="border border-gray-300 p-2 rounded-md w-1/2"
										placeholder="Start Date"
									/>
									<input
										type="date"
										value={formatDateForInput(newCorporateExp.endDate)}
										onChange={(e) =>
											setNewCorporateExp({
												...newCorporateExp,
												endDate: e.target.value,
											})
										}
										className="border border-gray-300 p-2 rounded-md w-1/2"
										placeholder="End Date"
										disabled={isCurrentlyWorking}
									/>
								</div>
							</div>
							<textarea
								value={newCorporateExp.responsibilities}
								onChange={(e) =>
									setNewCorporateExp({
										...newCorporateExp,
										responsibilities: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Responsibilities"
								rows={4}
							></textarea>
							<div className="flex">
								<button
									className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
									onClick={addCorporateExperience}
									disabled={loading}
								>
									Add
								</button>
								<button
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
									onClick={() => {
										setAddingCorporateExp(false);
										setNewCorporateExp({
											jobTitle: "",
											companyName: "",
											startDate: "",
											endDate: "",
											responsibilities: "",
										});
									}}
									disabled={loading}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{corporateExperiences &&
						corporateExperiences.map((exp, index) => (
							<div key={exp.id || `exp-${index}`} className="mb-6">
								{editingCorporateId === exp.id ? (
									<div className="border p-4 rounded-lg">
										<input
											type="text"
											value={editData.jobTitle || ""}
											onChange={(e) =>
												setEditData({ ...editData, jobTitle: e.target.value })
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Job Title"
										/>
										<input
											type="text"
											value={editData.companyName}
											onChange={(e) =>
												setEditData({
													...editData,
													companyName: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Company Name"
										/>
										<div className="flex flex-col space-y-2 mb-2">
											<div className="flex items-center space-x-2">
												<Switch
													checked={isEditCurrentlyWorking}
													onCheckedChange={(checked) => {
														setIsEditCurrentlyWorking(checked);
														if (checked) {
															setEditData({
																...editData,
																endDate: "",
															});
														}
													}}
												/>
												<label className="text-sm text-gray-600">
													I am currently working here
												</label>
											</div>
											<div className="flex space-x-2">
												<input
													type="date"
													value={formatDateForInput(editData.startDate) || ""}
													onChange={(e) =>
														setEditData({
															...editData,
															startDate: e.target.value,
														})
													}
													className="border border-gray-300 p-2 rounded-md w-1/2"
												/>
												<input
													type="date"
													value={formatDateForInput(editData.endDate) || ""}
													onChange={(e) =>
														setEditData({
															...editData,
															endDate: e.target.value,
														})
													}
													className="border border-gray-300 p-2 rounded-md w-1/2"
													disabled={isEditCurrentlyWorking}
												/>
											</div>
										</div>
										<textarea
											value={editData.responsibilities}
											onChange={(e) =>
												setEditData({
													...editData,
													responsibilities: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											rows={4}
										/>
										<div className="flex justify-between items-center">
											<DeleteButton
												onDelete={() => removeCorporateExperience(exp.id)}
												itemType="Corporate Experience"
												loading={loading}
												size="small"
												className="ml-2"
											/>
											<div className="flex space-x-2">
												<button
													className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
													onClick={() => setEditingCorporateId(null)}
												>
													Cancel
												</button>
												<button
													className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
													onClick={() => updateCorporateExperience(exp.id)}
													disabled={loading}
												>
													Save
												</button>
											</div>
										</div>
									</div>
								) : (
									<div className="flex justify-between items-start">
										<div>
											<h4 className="text-lg font-semibold text-textPrimary">
												{exp.jobTitle}
											</h4>
											<p className="text-textSecondary">{exp.companyName}</p>
											<p className="text-sm text-gray-500">
												{new Date(exp.startDate).toLocaleDateString()} -{" "}
												{exp.endDate
													? new Date(exp.endDate).toLocaleDateString()
													: "Present"}
											</p>
											<p className="text-textSecondary mt-2">
												{exp.responsibilities}
											</p>
										</div>
										{editable && (
											<button
												className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
												onClick={() => handleEditClick(exp, "corporate")}
											>
												<PencilIcon className="w-5 h-5 text-gray-600" />
											</button>
										)}
									</div>
								)}
							</div>
						))}
				</div>
			)}
			{activeTab === "Startup" && (
				<div>
					{editable && addingStartupExp && (
						<div className="mb-6">
							<input
								type="text"
								value={newStartupExp.role}
								onChange={(e) =>
									setNewStartupExp({
										...newStartupExp,
										role: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Role"
							/>
							<input
								type="text"
								value={newStartupExp.startupName}
								onChange={(e) =>
									setNewStartupExp({
										...newStartupExp,
										startupName: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Startup Name"
							/>
							<textarea
								value={newStartupExp.description}
								onChange={(e) =>
									setNewStartupExp({
										...newStartupExp,
										description: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Description"
								rows={4}
							></textarea>
							<div className="flex">
								<button
									className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
									onClick={addStartupExperience}
									disabled={loading}
								>
									Add
								</button>
								<button
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
									onClick={() => {
										setAddingStartupExp(false);
										setNewStartupExp({
											startupName: "",
											role: "",
											description: "",
										});
									}}
									disabled={loading}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{startupExperiences &&
						startupExperiences.map((exp, index) => (
							<div key={exp.id || `exp-${index}`} className="mb-6">
								{editingStartupId === exp.id ? (
									<div className="border p-4 rounded-lg">
										<input
											type="text"
											value={editData.role}
											onChange={(e) =>
												setEditData({ ...editData, role: e.target.value })
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Role"
										/>
										<input
											type="text"
											value={editData.startupName}
											onChange={(e) =>
												setEditData({
													...editData,
													startupName: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Startup Name"
										/>
										<textarea
											value={editData.description}
											onChange={(e) =>
												setEditData({
													...editData,
													description: e.target.value,
												})
											}
											className="border border-gray-300 p-2 rounded-md w-full mb-2"
											placeholder="Description"
											rows={4}
										/>
										<div className="flex justify-between items-center">
											<DeleteButton
												onDelete={() => removeStartupExperience(exp.id)}
												itemType="Corporate Experience"
												loading={loading}
												size="small"
												className="ml-2"
											/>
											<div className="flex space-x-2">
												<button
													className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
													onClick={() => setEditingStartupId(null)}
												>
													Cancel
												</button>
												<button
													className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
													onClick={() => updateStartupExperience(exp.id)}
													disabled={loading}
												>
													Save
												</button>
											</div>
										</div>
									</div>
								) : (
									<div className="flex justify-between items-start">
										<div>
											<h4 className="text-lg font-semibold text-textPrimary">
												{exp.role}
											</h4>
											<p className="text-textSecondary">{exp.startupName}</p>
											<p className="text-textSecondary mt-2">
												{exp.description}
											</p>
										</div>
										{editable && (
											<button
												className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
												onClick={() => handleEditClick(exp, "startup")}
											>
												<PencilIcon className="w-5 h-5 text-gray-600" />
											</button>
										)}
									</div>
								)}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default Experience;
