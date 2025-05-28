"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";

const Education = ({ username, educationList, editable }) => {
	const [educations, setEducations] = useState(educationList);
	const [addingEducation, setAddingEducation] = useState(false);
	const [editingEducationId, setEditingEducationId] = useState(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [loading, setLoading] = useState(false);

	const degrees = ["NONE", "BA", "BSc", "MA", "MSc", "MBA", "PhD"];

	const fieldsOfStudy = [
		"NONE",
		"Computer Science",
		"Engineering",
		"Business Administration",
		"Medicine",
		"Law",
		"Psychology",
		"Biology",
		"Chemistry",
		"Physics",
		"Mathematics",
		"Economics",
		"Finance",
		"Marketing",
		"Accounting",
		"Education",
		"Art",
		"Design",
		"Literature",
		"History",
		"Philosophy",
		"Political Science",
		"Sociology",
		"Anthropology",
		"Communications",
		"Journalism",
		"Other",
	];

	const [newEducation, setNewEducation] = useState({
		degree: "NONE",
		customDegree: "",
		fieldofStudy: "NONE",
		customFieldofStudy: "",
		institution: "",
		startDate: "",
		endDate: "",
	});

	const [editData, setEditData] = useState({
		degree: "NONE",
		customDegree: "",
		fieldofStudy: "NONE",
		customFieldofStudy: "",
		institution: "",
		startDate: "",
		endDate: "",
	});

	const { updateItem } = useUpdateItem();

	const handleEditClick = (edu) => {
		setEditingEducationId(edu.id);
		setEditData({
			degree: edu.degree || "NONE",
			customDegree: edu.customDegree || "",
			fieldofStudy: edu.fieldofStudy || "NONE",
			customFieldofStudy: edu.customFieldofStudy || "",
			institution: edu.institution || "",
			startDate: edu.startDate
				? new Date(edu.startDate).toISOString().split("T")[0]
				: "",
			endDate: edu.endDate
				? new Date(edu.endDate).toISOString().split("T")[0]
				: "",
		});
	};

	const handleDeleteClick = (edu) => {
		setItemToDelete(edu);
		setShowDeleteDialog(true);
	};

	const addEducation = async () => {
		try {
			setLoading(true);
			const educationData = {
				...newEducation,
				startDate: newEducation.startDate
					? new Date(newEducation.startDate)
					: null,
				endDate: newEducation.endDate ? new Date(newEducation.endDate) : null,
			};

			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createEducation`,
				{
					username,
					...educationData,
				},
				{ withCredentials: true },
			);
			setEducations([...educations, response.data.education]);
			setNewEducation({
				degree: "NONE",
				customDegree: "",
				fieldofStudy: "NONE",
				customFieldofStudy: "",
				institution: "",
				startDate: "",
				endDate: "",
			});
			setAddingEducation(false);
		} catch (error) {
			console.error("Error adding education:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateEducation = async (educationId) => {
		try {
			setLoading(true);

			const educationData = {
				...editData,
				startDate: editData.startDate ? new Date(editData.startDate) : null,
				endDate: editData.endDate ? new Date(editData.endDate) : null,
			};

			const updatedItem = await updateItem(
				"education",
				educationId,
				educationData,
			);

			setEducations((prevEdus) =>
				prevEdus.map((edu) => (edu.id === educationId ? updatedItem : edu)),
			);

			setEditingEducationId(null);
			setEditData({
				degree: "NONE",
				customDegree: "",
				fieldofStudy: "NONE",
				customFieldofStudy: "",
				institution: "",
				startDate: "",
				endDate: "",
			});
		} catch (error) {
			console.error("Error updating education:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeEducation = async (educationId) => {
		try {
			setLoading(true);
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteOneEducation`,
				{
					params: { educationId },
					withCredentials: true,
				},
			);
			setEducations(educations.filter((edu) => edu.id !== educationId));
		} catch (error) {
			console.error("Error removing education:", error);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
	};

	const getDegreeDisplay = (edu) => {
		if (edu.degree === "Other" && edu.customDegree) {
			return edu.customDegree;
		}
		return edu.degree !== "NONE" ? edu.degree : "";
	};

	const getFieldOfStudyDisplay = (edu) => {
		if (edu.fieldofStudy === "Other" && edu.customFieldofStudy) {
			return edu.customFieldofStudy;
		}
		return edu.fieldofStudy !== "NONE" ? edu.fieldofStudy : "";
	};

	const renderEducationForm = (data, setData, isEditing = false) => (
		<div className="space-y-4">
			{/* Degree Section */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Degree
				</label>
				<select
					value={data.degree}
					onChange={(e) => setData({ ...data, degree: e.target.value })}
					className="border border-gray-300 p-2 rounded-md w-full"
				>
					{degrees.map((degree) => (
						<option key={degree} value={degree}>
							{degree}
						</option>
					))}
				</select>
				{data.degree === "Other" && (
					<input
						type="text"
						value={data.customDegree}
						onChange={(e) => setData({ ...data, customDegree: e.target.value })}
						className="border border-gray-300 p-2 rounded-md w-full mt-2"
						placeholder="Enter custom degree"
					/>
				)}
			</div>

			{/* Field of Study Section */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Field of Study
				</label>
				<select
					value={data.fieldofStudy}
					onChange={(e) => setData({ ...data, fieldofStudy: e.target.value })}
					className="border border-gray-300 p-2 rounded-md w-full"
				>
					{fieldsOfStudy.map((field) => (
						<option key={field} value={field}>
							{field}
						</option>
					))}
				</select>
				{data.fieldofStudy === "Other" && (
					<input
						type="text"
						value={data.customFieldofStudy}
						onChange={(e) =>
							setData({ ...data, customFieldofStudy: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mt-2"
						placeholder="Enter custom field of study"
					/>
				)}
			</div>

			{/* Institution */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Institution *
				</label>
				<input
					type="text"
					value={data.institution}
					onChange={(e) => setData({ ...data, institution: e.target.value })}
					className="border border-gray-300 p-2 rounded-md w-full"
					placeholder="Institution name"
					required
				/>
			</div>

			{/* Dates Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Start Date (Optional)
					</label>
					<input
						type="date"
						value={data.startDate}
						onChange={(e) => setData({ ...data, startDate: e.target.value })}
						className="border border-gray-300 p-2 rounded-md w-full"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						End Date (Optional)
					</label>
					<input
						type="date"
						value={data.endDate}
						onChange={(e) => setData({ ...data, endDate: e.target.value })}
						className="border border-gray-300 p-2 rounded-md w-full"
					/>
				</div>
			</div>
		</div>
	);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">Education</h3>
				{editable && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingEducation(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>

			{editable && addingEducation && (
				<div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
					<h4 className="text-lg font-medium mb-4">Add Education</h4>
					{renderEducationForm(newEducation, setNewEducation)}
					<div className="flex justify-end space-x-2 mt-4">
						<button
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							onClick={() => {
								setAddingEducation(false);
								setNewEducation({
									degree: "NONE",
									customDegree: "",
									fieldofStudy: "NONE",
									customFieldofStudy: "",
									institution: "",
									startDate: "",
									endDate: "",
								});
							}}
							disabled={loading}
						>
							Cancel
						</button>
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
							onClick={addEducation}
							disabled={loading || !newEducation.institution}
						>
							{loading ? "Adding..." : "Add Education"}
						</button>
					</div>
				</div>
			)}

			{educations &&
				educations.map((edu) => (
					<div key={edu.id} className="mb-6">
						{editingEducationId === edu.id ? (
							<div className="border p-4 rounded-lg bg-gray-50">
								<h4 className="text-lg font-medium mb-4">Edit Education</h4>
								{renderEducationForm(editData, setEditData, true)}
								<div className="flex justify-between items-center mt-4">
									<DeleteButton
										onDelete={() => removeEducation(edu.id)}
										itemType="Education"
										loading={loading}
										size="small"
									/>
									<div className="flex space-x-2">
										<button
											className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
											onClick={() => {
												setEditingEducationId(null);
												setEditData({
													degree: "NONE",
													customDegree: "",
													fieldofStudy: "NONE",
													customFieldofStudy: "",
													institution: "",
													startDate: "",
													endDate: "",
												});
											}}
											disabled={loading}
										>
											Cancel
										</button>
										<button
											className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
											onClick={() => updateEducation(edu.id)}
											disabled={loading || !editData.institution}
										>
											{loading ? "Saving..." : "Save"}
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="flex justify-between items-start p-4 border border-gray-200 rounded-lg">
								<div className="flex-1">
									<h4 className="text-lg font-semibold text-textPrimary">
										{edu.institution}
									</h4>
									<div className="mt-1 space-y-1">
										{getDegreeDisplay(edu) && (
											<p className="text-textSecondary">
												<span className="font-medium">Degree:</span>{" "}
												{getDegreeDisplay(edu)}
											</p>
										)}
										{getFieldOfStudyDisplay(edu) && (
											<p className="text-textSecondary">
												<span className="font-medium">Field of Study:</span>{" "}
												{getFieldOfStudyDisplay(edu)}
											</p>
										)}
										{(edu.startDate || edu.endDate) && (
											<p className="text-textSecondary text-sm">
												{formatDate(edu.startDate)}
												{edu.startDate && edu.endDate && " - "}
												{edu.endDate
													? formatDate(edu.endDate)
													: edu.startDate && "Present"}
											</p>
										)}
									</div>
								</div>
								{editable && (
									<button
										className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 ml-4"
										onClick={() => handleEditClick(edu)}
									>
										<PencilIcon className="w-5 h-5 text-gray-600" />
									</button>
								)}
							</div>
						)}
					</div>
				))}

			{(!educations || educations.length === 0) && (
				<div className="text-center py-8 text-gray-500">
					<p>No education entries added yet.</p>
					{editable && (
						<button
							className="mt-2 text-primary hover:text-secondary underline"
							onClick={() => setAddingEducation(true)}
						>
							Add your first education entry
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default Education;
