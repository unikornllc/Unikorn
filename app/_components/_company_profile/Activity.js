import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon";
import SaveIcon from "@/app/_icons/SaveIcon";

const Activity = ({ activities = [], onUpdate }) => {
	const [localActivities, setLocalActivities] = useState(activities);
	const [editingIndex, setEditingIndex] = useState(null);
	const [tempActivity, setTempActivity] = useState({
		title: "",
		description: "",
	});
	const [isAdding, setIsAdding] = useState(false);

	// Start editing an existing activity
	const startEditing = (index) => {
		setEditingIndex(index);
		setTempActivity({ ...localActivities[index] });
	};

	// Cancel editing or adding
	const cancelEditing = () => {
		setEditingIndex(null);
		setTempActivity({ title: "", description: "" });
		setIsAdding(false);
	};

	// Save changes to an existing activity
	const saveActivity = async () => {
		const updatedActivities = [...localActivities];
		updatedActivities[editingIndex] = tempActivity;
		setLocalActivities(updatedActivities);
		setEditingIndex(null);
		setTempActivity({ title: "", description: "" });
		// Call onUpdate to update the backend and parent state
		onUpdate("activities", updatedActivities);
	};

	// Delete an activity
	const handleDelete = (index) => {
		const updatedActivities = localActivities.filter((_, i) => i !== index);
		setLocalActivities(updatedActivities);
		onUpdate("activities", updatedActivities);
	};

	// Start adding a new activity
	const handleAddClick = () => {
		setIsAdding(true);
		setTempActivity({ title: "", description: "" });
	};

	// Save the new activity
	const handleAddSubmit = () => {
		const updatedActivities = [...localActivities, tempActivity];
		setLocalActivities(updatedActivities);
		setIsAdding(false);
		setTempActivity({ title: "", description: "" });
		onUpdate("activities", updatedActivities);
	};

	// Handle input changes
	const handleChange = (field, value) => {
		setTempActivity((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Activities</h2>
			{localActivities && localActivities.length > 0 ? (
				localActivities.map((activity, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Title:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={tempActivity.title}
									onChange={(e) => handleChange("title", e.target.value)}
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
									value={tempActivity.description}
									onChange={(e) => handleChange("description", e.target.value)}
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
							{editingIndex === index ? (
								<>
									<button
										onClick={saveActivity}
										className="text-blue-500 underline mr-2"
									>
										<SaveIcon />
									</button>
									<button
										onClick={cancelEditing}
										className="text-red-500 underline"
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => startEditing(index)}
										className="text-blue-500 underline mr-2"
									>
										<EditIcon />
									</button>
									<button
										onClick={() => handleDelete(index)}
										className="text-red-500 underline"
									>
										<DeleteIcon />
									</button>
								</>
							)}
						</div>
					</div>
				))
			) : (
				<p className="text-gray-500">
					No activities available. Click "Add" to get started.
				</p>
			)}
			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Title:</span>
						<input
							type="text"
							value={tempActivity.title}
							onChange={(e) => handleChange("title", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Description:</span>
						<textarea
							value={tempActivity.description}
							onChange={(e) => handleChange("description", e.target.value)}
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
						<button onClick={cancelEditing} className="text-red-500 underline">
							Cancel
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
