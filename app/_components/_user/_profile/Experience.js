"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Briefcase, Building2 } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { Badge } from "@/app/_components/_ui/Badge";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { Switch } from "@/app/_components/_ui/Switch";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";
import { useToast } from "@/app/_components/_hooks/useToast";

const Experience = ({
	username,
	corporateExperienceList,
	startupExperienceList,
	editable,
}) => {
	const [activeTab, setActiveTab] = useState("Corporate");
	const [corporateExperiences, setCorporateExperiences] = useState(
		corporateExperienceList || [],
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
		startupExperienceList || [],
	);
	const [addingStartupExp, setAddingStartupExp] = useState(false);
	const [newStartupExp, setNewStartupExp] = useState({
		startupName: "",
		role: "",
		startDate: "",
		endDate: "",
		description: "",
	});

	const [editingCorporateId, setEditingCorporateId] = useState(null);
	const [editingStartupId, setEditingStartupId] = useState(null);
	const [editData, setEditData] = useState({});

	const { updateItem } = useUpdateItem();
	const { toast } = useToast();

	const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);
	const [isEditCurrentlyWorking, setIsEditCurrentlyWorking] = useState(false);
	const [isCurrentlyWorkingStartup, setIsCurrentlyWorkingStartup] =
		useState(false);
	const [isEditCurrentlyWorkingStartup, setIsEditCurrentlyWorkingStartup] =
		useState(false);

	const [loading, setLoading] = useState(false);

	const addCorporateExperience = async () => {
		if (
			!newCorporateExp.jobTitle ||
			!newCorporateExp.companyName ||
			!newCorporateExp.startDate
		) {
			toast({
				title: "Error",
				description: "Please fill in all required fields",
				variant: "destructive",
			});
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createCorporateExperience`,
				{
					username,
					...newCorporateExp,
					endDate: isCurrentlyWorking ? null : newCorporateExp.endDate,
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
			setIsCurrentlyWorking(false);
			toast({
				title: "Success",
				description: "Corporate experience added successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description:
					error.response?.data?.message || "Failed to add experience",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Experience deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete experience",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Experience updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update experience",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const addStartupExperience = async () => {
		if (!newStartupExp.role || !newStartupExp.startupName) {
			toast({
				title: "Error",
				description: "Please fill in all required fields",
				variant: "destructive",
			});
			return;
		}

		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createStartupExperience`,
				{
					username,
					...newStartupExp,
					endDate: isCurrentlyWorkingStartup ? null : newStartupExp.endDate,
				},
				{ withCredentials: true },
			);
			setStartupExperiences((prevExps) => [
				...prevExps,
				response.data.startupExperience,
			]);
			setNewStartupExp({
				startupName: "",
				role: "",
				startDate: "",
				endDate: "",
				description: "",
			});
			setAddingStartupExp(false);
			setIsCurrentlyWorkingStartup(false);
			toast({
				title: "Success",
				description: "Startup experience added successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description:
					error.response?.data?.message || "Failed to add experience",
				variant: "destructive",
			});
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
			toast({
				title: "Success",
				description: "Experience deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete experience",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const updateStartupExperience = async (experienceId) => {
		try {
			setLoading(true);
			const experienceData = {
				...editData,
				startDate: editData.startupStartDate,
				endDate: isEditCurrentlyWorkingStartup ? null : editData.startupEndDate,
				id: experienceId,
			};
			const updatedItem = await updateItem(
				"startupExperience",
				experienceId,
				experienceData,
			);
			setStartupExperiences((prevExps) =>
				prevExps.map((exp) => (exp.id === experienceId ? updatedItem : exp)),
			);

			setEditingStartupId(null);
			setEditData({});
			setIsEditCurrentlyWorkingStartup(false);
			toast({
				title: "Success",
				description: "Experience updated successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update experience",
				variant: "destructive",
			});
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
				startupStartDate: exp.startDate || "",
				startupEndDate: exp.endDate || "",
				description: exp.description || "",
			});
			if (!exp.endDate) {
				setIsEditCurrentlyWorkingStartup(true);
			}
		}
	};

	const formatDateForInput = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).toISOString().split("T")[0];
	};

	const formatDateForDisplay = (dateString) => {
		if (!dateString) return "Present";
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			year: "numeric",
		});
	};

	const hasExperience =
		corporateExperiences.length > 0 || startupExperiences.length > 0;

	return (
		<Card className="shadow-sm hover:shadow-md transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex justify-between items-center">
					<CardTitle className="flex items-center gap-2 text-xl">
						<Briefcase className="h-5 w-5 text-blue-500" />
						Experience
					</CardTitle>
					{editable && (
						<div className="flex gap-2">
							{activeTab === "Corporate" && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setAddingCorporateExp(true)}
									className="h-8"
								>
									<PlusIcon className="w-4 h-4 mr-1" />
									Add Corporate
								</Button>
							)}
							{activeTab === "Startup" && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => setAddingStartupExp(true)}
									className="h-8"
								>
									<PlusIcon className="w-4 h-4 mr-1" />
									Add Startup
								</Button>
							)}
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{/* Tab Navigation */}
				<div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
					<button
						className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
							activeTab === "Corporate"
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
						onClick={() => setActiveTab("Corporate")}
					>
						<Building2 className="h-4 w-4 inline mr-2" />
						Corporate ({corporateExperiences.length})
					</button>
					<button
						className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
							activeTab === "Startup"
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-600 hover:text-gray-900"
						}`}
						onClick={() => setActiveTab("Startup")}
					>
						<Briefcase className="h-4 w-4 inline mr-2" />
						Startup ({startupExperiences.length})
					</button>
				</div>

				{!hasExperience && !editable ? (
					<div className="text-center py-8">
						<Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							No experience listed
						</h3>
						<p className="text-gray-500">
							This user hasn't added any work experience yet
						</p>
					</div>
				) : (
					<div>
						{activeTab === "Corporate" && (
							<div>
								{/* Add Corporate Experience Form */}
								{editable && addingCorporateExp && (
									<Card className="mb-6 border-blue-200 bg-blue-50">
										<CardContent className="p-4 space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<Input
													type="text"
													value={newCorporateExp.jobTitle}
													onChange={(e) =>
														setNewCorporateExp({
															...newCorporateExp,
															jobTitle: e.target.value,
														})
													}
													placeholder="Job Title *"
												/>
												<Input
													type="text"
													value={newCorporateExp.companyName}
													onChange={(e) =>
														setNewCorporateExp({
															...newCorporateExp,
															companyName: e.target.value,
														})
													}
													placeholder="Company Name *"
												/>
											</div>

											<div className="flex items-center space-x-2 mb-4">
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
												<label className="text-sm text-gray-700">
													I currently work here
												</label>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Start Date *
													</label>
													<Input
														type="date"
														value={formatDateForInput(
															newCorporateExp.startDate,
														)}
														onChange={(e) =>
															setNewCorporateExp({
																...newCorporateExp,
																startDate: e.target.value,
															})
														}
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														End Date
													</label>
													<Input
														type="date"
														value={formatDateForInput(newCorporateExp.endDate)}
														onChange={(e) =>
															setNewCorporateExp({
																...newCorporateExp,
																endDate: e.target.value,
															})
														}
														disabled={isCurrentlyWorking}
													/>
												</div>
											</div>

											<Textarea
												value={newCorporateExp.responsibilities}
												onChange={(e) =>
													setNewCorporateExp({
														...newCorporateExp,
														responsibilities: e.target.value,
													})
												}
												placeholder="Describe your responsibilities and achievements..."
												rows={4}
											/>

											<div className="flex gap-2">
												<Button
													onClick={addCorporateExperience}
													disabled={loading}
													size="sm"
												>
													{loading ? "Adding..." : "Add Experience"}
												</Button>
												<Button
													variant="outline"
													onClick={() => {
														setAddingCorporateExp(false);
														setNewCorporateExp({
															jobTitle: "",
															companyName: "",
															startDate: "",
															endDate: "",
															responsibilities: "",
														});
														setIsCurrentlyWorking(false);
													}}
													disabled={loading}
													size="sm"
												>
													Cancel
												</Button>
											</div>
										</CardContent>
									</Card>
								)}

								{/* Corporate Experience List */}
								{corporateExperiences.length === 0 && !addingCorporateExp ? (
									<div className="text-center py-8">
										<Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No corporate experience
										</h3>
										<p className="text-gray-500 mb-4">
											{editable
												? "Add your corporate work experience"
												: "No corporate experience listed"}
										</p>
										{editable && (
											<Button onClick={() => setAddingCorporateExp(true)}>
												Add Corporate Experience
											</Button>
										)}
									</div>
								) : (
									<div className="space-y-4">
										{corporateExperiences.map((exp, index) => (
											<Card
												key={exp.id || `exp-${index}`}
												className="border-l-4 border-l-blue-500"
											>
												{editingCorporateId === exp.id ? (
													<CardContent className="p-4 space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<Input
																type="text"
																value={editData.jobTitle || ""}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		jobTitle: e.target.value,
																	})
																}
																placeholder="Job Title"
															/>
															<Input
																type="text"
																value={editData.companyName}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		companyName: e.target.value,
																	})
																}
																placeholder="Company Name"
															/>
														</div>

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
															<label className="text-sm text-gray-700">
																I currently work here
															</label>
														</div>

														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<Input
																type="date"
																value={
																	formatDateForInput(editData.startDate) || ""
																}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		startDate: e.target.value,
																	})
																}
															/>
															<Input
																type="date"
																value={
																	formatDateForInput(editData.endDate) || ""
																}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		endDate: e.target.value,
																	})
																}
																disabled={isEditCurrentlyWorking}
															/>
														</div>

														<Textarea
															value={editData.responsibilities || ""}
															onChange={(e) =>
																setEditData({
																	...editData,
																	responsibilities: e.target.value,
																})
															}
															placeholder="Responsibilities"
															rows={4}
														/>

														<div className="flex justify-between items-center">
															<DeleteButton
																onDelete={() =>
																	removeCorporateExperience(exp.id)
																}
																itemType="Corporate Experience"
																loading={loading}
																size="small"
															/>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => setEditingCorporateId(null)}
																>
																	Cancel
																</Button>
																<Button
																	size="sm"
																	onClick={() =>
																		updateCorporateExperience(exp.id)
																	}
																	disabled={loading}
																>
																	{loading ? "Saving..." : "Save"}
																</Button>
															</div>
														</div>
													</CardContent>
												) : (
													<CardContent className="p-4">
														<div className="flex justify-between items-start">
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-2">
																	<h4 className="text-lg font-semibold text-gray-900">
																		{exp.jobTitle}
																	</h4>
																	{!exp.endDate && (
																		<Badge
																			variant="secondary"
																			className="bg-green-100 text-green-700"
																		>
																			Current
																		</Badge>
																	)}
																</div>
																<p className="text-blue-600 font-medium mb-2">
																	{exp.companyName}
																</p>
																<p className="text-sm text-gray-500 mb-3">
																	{formatDateForDisplay(exp.startDate)} -{" "}
																	{formatDateForDisplay(exp.endDate)}
																</p>
																{exp.responsibilities && (
																	<p className="text-gray-700 leading-relaxed">
																		{exp.responsibilities}
																	</p>
																)}
															</div>
															{editable && (
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleEditClick(exp, "corporate")
																	}
																	className="h-8 w-8 p-0"
																>
																	<PencilIcon className="w-4 h-4" />
																</Button>
															)}
														</div>
													</CardContent>
												)}
											</Card>
										))}
									</div>
								)}
							</div>
						)}

						{activeTab === "Startup" && (
							<div>
								{/* Add Startup Experience Form */}
								{editable && addingStartupExp && (
									<Card className="mb-6 border-purple-200 bg-purple-50">
										<CardContent className="p-4 space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<Input
													type="text"
													value={newStartupExp.role}
													onChange={(e) =>
														setNewStartupExp({
															...newStartupExp,
															role: e.target.value,
														})
													}
													placeholder="Role *"
												/>
												<Input
													type="text"
													value={newStartupExp.startupName}
													onChange={(e) =>
														setNewStartupExp({
															...newStartupExp,
															startupName: e.target.value,
														})
													}
													placeholder="Startup Name *"
												/>
											</div>

											<div className="flex items-center space-x-2 mb-4">
												<Switch
													checked={isCurrentlyWorkingStartup}
													onCheckedChange={(checked) => {
														setIsCurrentlyWorkingStartup(checked);
														if (checked) {
															setNewStartupExp({
																...newStartupExp,
																endDate: "",
															});
														}
													}}
												/>
												<label className="text-sm text-gray-700">
													I currently work here
												</label>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Start Date
													</label>
													<Input
														type="date"
														value={formatDateForInput(newStartupExp.startDate)}
														onChange={(e) =>
															setNewStartupExp({
																...newStartupExp,
																startDate: e.target.value,
															})
														}
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														End Date
													</label>
													<Input
														type="date"
														value={formatDateForInput(newStartupExp.endDate)}
														onChange={(e) =>
															setNewStartupExp({
																...newStartupExp,
																endDate: e.target.value,
															})
														}
														disabled={isCurrentlyWorkingStartup}
													/>
												</div>
											</div>

											<Textarea
												value={newStartupExp.description}
												onChange={(e) =>
													setNewStartupExp({
														...newStartupExp,
														description: e.target.value,
													})
												}
												placeholder="Describe your role and achievements..."
												rows={4}
											/>

											<div className="flex gap-2">
												<Button
													onClick={addStartupExperience}
													disabled={loading}
													size="sm"
												>
													{loading ? "Adding..." : "Add Experience"}
												</Button>
												<Button
													variant="outline"
													onClick={() => {
														setAddingStartupExp(false);
														setNewStartupExp({
															startupName: "",
															role: "",
															startDate: "",
															endDate: "",
															description: "",
														});
														setIsCurrentlyWorkingStartup(false);
													}}
													disabled={loading}
													size="sm"
												>
													Cancel
												</Button>
											</div>
										</CardContent>
									</Card>
								)}

								{/* Startup Experience List */}
								{startupExperiences.length === 0 && !addingStartupExp ? (
									<div className="text-center py-8">
										<Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">
											No startup experience
										</h3>
										<p className="text-gray-500 mb-4">
											{editable
												? "Add your startup work experience"
												: "No startup experience listed"}
										</p>
										{editable && (
											<Button onClick={() => setAddingStartupExp(true)}>
												Add Startup Experience
											</Button>
										)}
									</div>
								) : (
									<div className="space-y-4">
										{startupExperiences.map((exp, index) => (
											<Card
												key={exp.id || `exp-${index}`}
												className="border-l-4 border-l-purple-500"
											>
												{editingStartupId === exp.id ? (
													<CardContent className="p-4 space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<Input
																type="text"
																value={editData.role}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		role: e.target.value,
																	})
																}
																placeholder="Role"
															/>
															<Input
																type="text"
																value={editData.startupName}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		startupName: e.target.value,
																	})
																}
																placeholder="Startup Name"
															/>
														</div>

														<div className="flex items-center space-x-2">
															<Switch
																checked={isEditCurrentlyWorkingStartup}
																onCheckedChange={(checked) => {
																	setIsEditCurrentlyWorkingStartup(checked);
																	if (checked) {
																		setEditData({
																			...editData,
																			startupEndDate: "",
																		});
																	}
																}}
															/>
															<label className="text-sm text-gray-700">
																I currently work here
															</label>
														</div>

														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<Input
																type="date"
																value={
																	formatDateForInput(
																		editData.startupStartDate,
																	) || ""
																}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		startupStartDate: e.target.value,
																	})
																}
															/>
															<Input
																type="date"
																value={
																	formatDateForInput(editData.startupEndDate) ||
																	""
																}
																onChange={(e) =>
																	setEditData({
																		...editData,
																		startupEndDate: e.target.value,
																	})
																}
																disabled={isEditCurrentlyWorkingStartup}
															/>
														</div>

														<Textarea
															value={editData.description}
															onChange={(e) =>
																setEditData({
																	...editData,
																	description: e.target.value,
																})
															}
															placeholder="Description"
															rows={4}
														/>

														<div className="flex justify-between items-center">
															<DeleteButton
																onDelete={() => removeStartupExperience(exp.id)}
																itemType="Startup Experience"
																loading={loading}
																size="small"
															/>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	size="sm"
																	onClick={() => setEditingStartupId(null)}
																>
																	Cancel
																</Button>
																<Button
																	size="sm"
																	onClick={() =>
																		updateStartupExperience(exp.id)
																	}
																	disabled={loading}
																>
																	{loading ? "Saving..." : "Save"}
																</Button>
															</div>
														</div>
													</CardContent>
												) : (
													<CardContent className="p-4">
														<div className="flex justify-between items-start">
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-2">
																	<h4 className="text-lg font-semibold text-gray-900">
																		{exp.role}
																	</h4>
																	{!exp.endDate && (
																		<Badge
																			variant="secondary"
																			className="bg-green-100 text-green-700"
																		>
																			Current
																		</Badge>
																	)}
																</div>
																<p className="text-purple-600 font-medium mb-2">
																	{exp.startupName}
																</p>
																{exp.startDate && (
																	<p className="text-sm text-gray-500 mb-3">
																		{formatDateForDisplay(exp.startDate)} -{" "}
																		{formatDateForDisplay(exp.endDate)}
																	</p>
																)}
																{exp.description && (
																	<p className="text-gray-700 leading-relaxed">
																		{exp.description}
																	</p>
																)}
															</div>
															{editable && (
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleEditClick(exp, "startup")
																	}
																	className="h-8 w-8 p-0"
																>
																	<PencilIcon className="w-4 h-4" />
																</Button>
															)}
														</div>
													</CardContent>
												)}
											</Card>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default Experience;
