import React, { useState } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";

const Expertise = ({ username, expertiseList, editable }) => {
	const [expertise, setExpertise] = useState(expertiseList);
	const [newSkill, setNewSkill] = useState("");
	const [addingSkill, setAddingSkill] = useState(false);
	const [editingSkillId, setEditingSkillId] = useState(null);
	const [editSkillData, setEditSkillData] = useState("");
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [itemToDelete, setItemToDelete] = useState(null);
	const [loading, setLoading] = useState(false);

	const { updateItem } = useUpdateItem();


	const handleEditClick = (skill) => {
		setEditingSkillId(skill.id);
		setEditSkillData(skill.field);
	};

	const handleDeleteClick = (skill) => {
		setItemToDelete(skill);
		setShowDeleteDialog(true);
	};

	const addSkill = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createExpertise`,
				{
					username,
					field: newSkill,
				},
				{ withCredentials: true },
			);
			setExpertise([...expertise, response.data.expertise]);
			setNewSkill("");
			setAddingSkill(false);
		} catch (error) {
			console.error("Error adding skill:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateSkill = async (skillId) => {
		try {
			setLoading(true);
			const updatedItem = await updateItem('expertise', skillId, { field: editSkillData });

			setExpertise((prevSkills) =>
				prevSkills.map((skill) =>
					skill.id === skillId ? updatedItem : skill
				)
			);

			setEditingSkillId(null);
			setEditSkillData("");
		} catch (error) {
			console.error("Error updating skill:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeSkill = async (skillId) => {
		try {
			setLoading(true);
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteOneExpertise`,
				{
					params: { expertiseId: skillId },
					withCredentials: true,
				},
			);
			setExpertise(expertise.filter((skill) => skill.id !== skillId));
			// setShowDeleteDialog(false);
			// setItemToDelete(null);
		} catch (error) {
			console.error("Error removing skill:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">
					Skills & Expertise
				</h3>
				{editable && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingSkill(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>

			{editable && addingSkill && (
				<div className="mb-4 flex">
					<input
						type="text"
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
						className="border border-gray-300 p-2 rounded-md flex-grow mr-2"
						placeholder="Enter a new skill"
					/>
					<button
						className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
						onClick={addSkill}
						disabled={loading}
					>
						Add
					</button>
					<button
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 ml-2"
						onClick={() => {
							setAddingSkill(false);
							setNewSkill("");
						}}
						disabled={loading}
					>
						Cancel
					</button>
				</div>
			)}

			<div className="flex flex-wrap">
				{expertise &&
					expertise.map((exp) => (
						<div key={exp.id}>
							{editingSkillId === exp.id ? (
								<div className="mb-2 flex items-center space-x-2">
									<input
										type="text"
										value={editSkillData}
										onChange={(e) => setEditSkillData(e.target.value)}
										className="border border-gray-300 p-2 rounded-md"
										placeholder="Skill"
									/>
									<div className="flex space-x-2">
										<DeleteButton
											onDelete={() => removeSkill(exp.id)}
											itemType="skill"
											loading={loading}
											size="small"
											className="ml-2"
										/>
										<button
											className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
											onClick={() => {
												setEditingSkillId(null);
												setEditSkillData("");
											}}
											disabled={loading}
										>
											Cancel
										</button>
										<button
											className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
											onClick={() => updateSkill(exp.id)}
											disabled={loading}
										>
											Save
										</button>
									</div>
								</div>
							) : (
								<div className="bg-gray-200 text-gray-700 px-3 py-1 m-1 rounded-full flex items-center">
									<span>{exp.field}</span>
									{editable && (
										<div className="flex ml-2">
											<button
												className="p-1 rounded-full bg-gray-300 hover:bg-gray-400 mr-1"
												onClick={() => handleEditClick(exp)}
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
	);
};

export default Expertise;