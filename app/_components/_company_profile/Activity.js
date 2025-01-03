import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import SaveIcon from "@/app/_icons/SaveIcon";

const Activity = ({ activities = [], onUpdate }) => {
	const [editingIndex, setEditingIndex] = useState(null);
	const [newActivity, setNewActivity] = useState({
		title: "",
		description: "",
	});
	const [isAdding, setIsAdding] = useState(false);

	const handleChange = (index, field, value) => {
		const updatedActivities = [...activities];
		updatedActivities[index] = { ...updatedActivities[index], [field]: value };
		onUpdate && onUpdate("activities", updatedActivities);
	};

	const handleDelete = (index) => {
		const updatedActivities = activities.filter((_, i) => i !== index);
		onUpdate && onUpdate("activities", updatedActivities);
	};

	const toggleEdit = (index) => {
		setEditingIndex(editingIndex === index ? null : index);
	};

	const handleAddClick = () => {
		setIsAdding(true);
	};

	const handleAddSubmit = () => {
		const updatedActivities = [...activities, newActivity];
		onUpdate && onUpdate("activities", updatedActivities);
		setNewActivity({ title: "", description: "" });
		setIsAdding(false);
	};

	const handleNewActivityChange = (field, value) => {
		setNewActivity({ ...newActivity, [field]: value });
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Activities</h2>
			{activities && activities.length > 0 ? (
				activities.map((activity, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Title:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={activity.title}
									onChange={(e) => handleChange(index, "title", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">{activity.title || "-"}</span>
							)}
						</div>
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Description:</span>
							{editingIndex === index ? (
								<textarea
									value={activity.description}
									onChange={(e) =>
										handleChange(index, "description", e.target.value)
									}
									className="border rounded px-2 py-1 flex-grow mr-2"
									rows={4}
								/>
							) : (
								<span className="flex-grow mr-2">
									{activity.description || "-"}
								</span>
							)}
						</div>
						<div className="flex justify-end">
							<button
								onClick={() => toggleEdit(index)}
								className="text-blue-500 underline mr-2"
							>
								{editingIndex === index ? "Save" : "Edit"}
							</button>
							<button
								onClick={() => handleDelete(index)}
								className="text-red-500 underline"
							>
								<DeleteIcon />
							</button>
						</div>
					</div>
				))
			) : (
				<p className="text-gray-500">
					No activities available. Click "Add Activity" to get started.
				</p>
			)}
			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Title:</span>
						<input
							type="text"
							value={newActivity.title}
							onChange={(e) => handleNewActivityChange("title", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Description:</span>
						<textarea
							value={newActivity.description}
							onChange={(e) =>
								handleNewActivityChange("description", e.target.value)
							}
							className="border rounded px-2 py-1 flex-grow mr-2"
							rows={4}
						/>
					</div>
					<div className="flex justify-end">
						<button
							onClick={handleAddSubmit}
							className="text-blue-500 underline mr-2"
						>
							<SaveIcon />
						</button>
						<button
							onClick={() => setIsAdding(false)}
							className="text-red-500 underline"
						>
							<DeleteIcon />
						</button>
					</div>
				</div>
			)}
			{!isAdding && (
				<div className="text-right">
					<button
						onClick={handleAddClick}
						className="mt-2 px-4 py-2 text-black rounded"
					>
						<AddIcon />
					</button>
				</div>
			)}
		</div>
	);
};

export default Activity;
