import React, { useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
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

	const [newEducation, setNewEducation] = useState({
		degree: "NONE",
		institution: "",
	});

	const [editData, setEditData] = useState({
		degree: "NONE",
		institution: "",
	});

	const { updateItem } = useUpdateItem();


	const handleEditClick = (edu) => {
		setEditingEducationId(edu.id);
		setEditData({
			degree: edu.degree || "NONE",
			institution: edu.institution || "",
		});
	};

	const handleDeleteClick = (edu) => {
		setItemToDelete(edu);
		setShowDeleteDialog(true);
	};

	const addEducation = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createEducation`,
				{
					username,
					...newEducation,
				},
				{ withCredentials: true },
			);
			setEducations([...educations, response.data.education]);
			setNewEducation({ degree: "NONE", institution: "" });
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

			const updatedItem = await updateItem('education', educationId, editData);

			setEducations((prevEdus) =>
				prevEdus.map((edu) =>
					edu.id === educationId ? updatedItem : edu
				)
			);

			setEditingEducationId(null);
			setEditData({ degree: "NONE", institution: "" });
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
				<div className="mb-4">
					<select
						value={newEducation.degree}
						onChange={(e) =>
							setNewEducation({ ...newEducation, degree: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
					>
						{degrees.map((degree) => (
							<option key={degree} value={degree}>
								{degree}
							</option>
						))}
					</select>
					<input
						type="text"
						value={newEducation.institution}
						onChange={(e) =>
							setNewEducation({ ...newEducation, institution: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Institution"
					/>
					<div className="flex">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
							onClick={addEducation}
							disabled={loading}
						>
							Add
						</button>
						<button
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							onClick={() => {
								setAddingEducation(false);
								setNewEducation({ degree: "NONE", institution: "" });
							}}
							disabled={loading}
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{educations &&
				educations.map((edu) => (
					<div key={edu.id} className="mb-6">
						{editingEducationId === edu.id ? (
							<div className="border p-4 rounded-lg">
								<select
									value={editData.degree}
									onChange={(e) =>
										setEditData({ ...editData, degree: e.target.value })
									}
									className="border border-gray-300 p-2 rounded-md w-full mb-2"
								>
									{degrees.map((degree) => (
										<option key={degree} value={degree}>
											{degree}
										</option>
									))}
								</select>
								<input
									type="text"
									value={editData.institution}
									onChange={(e) =>
										setEditData({ ...editData, institution: e.target.value })
									}
									className="border border-gray-300 p-2 rounded-md w-full mb-2"
									placeholder="Institution"
								/>
								<div className="flex justify-between items-center">
									<DeleteButton
										onDelete={() => removeEducation(edu.id)}
										itemType="Education"
										loading={loading}
										size="small"
										className="ml-2"
									/>
									<div className="flex space-x-2">
										<button
											className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
											onClick={() => {
												setEditingEducationId(null);
												setEditData({ degree: "NONE", institution: "" });
											}}
											disabled={loading}
										>
											Cancel
										</button>
										<button
											className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
											onClick={() => updateEducation(edu.id)}
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
										{edu.institution}
									</h4>
									<p className="text-textSecondary">{edu.degree}</p>
								</div>
								{editable && (
									<button
										className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
										onClick={() => handleEditClick(edu)}
									>
										<PencilIcon className="w-5 h-5 text-gray-600" />
									</button>
								)}
							</div>
						)}
					</div>
				))}

		</div>
	);
};

export default Education;