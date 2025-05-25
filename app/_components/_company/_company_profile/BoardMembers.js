import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon";
import SaveIcon from "@/app/_icons/SaveIcon";

const BoardMembers = ({ members, onUpdate }) => {
	// Local state to handle board members within the component
	const [localMembers, setLocalMembers] = useState(members || []);
	const [editingIndex, setEditingIndex] = useState(null);
	const [tempValue, setTempValue] = useState("");

	const startEditing = (index) => {
		setEditingIndex(index);
		setTempValue(localMembers[index]);
	};

	const cancelEditing = () => {
		setEditingIndex(null);
		setTempValue("");
	};

	const saveMember = (index) => {
		const updatedMembers = [...localMembers];
		updatedMembers[index] = tempValue;
		setLocalMembers(updatedMembers);
		setEditingIndex(null);
		setTempValue("");
		// Update the backend and parent state
		onUpdate("boardMembers", updatedMembers);
	};

	const handleDelete = (index) => {
		const updatedMembers = localMembers.filter((_, i) => i !== index);
		setLocalMembers(updatedMembers);
		// Update the backend and parent state
		onUpdate("boardMembers", updatedMembers);
	};

	const handleAdd = () => {
		const newMembers = [...localMembers, ""];
		setLocalMembers(newMembers);
		setEditingIndex(newMembers.length - 1);
		setTempValue("");
	};

	const handleChange = (e) => {
		setTempValue(e.target.value);
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Board Members</h2>
			{localMembers.map((member, index) => (
				<div key={index} className="flex items-center mb-2">
					{editingIndex === index ? (
						<input
							type="text"
							value={tempValue}
							onChange={handleChange}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					) : (
						<span className="flex-grow mr-2">{member}</span>
					)}
					{editingIndex === index ? (
						<>
							<button
								onClick={() => saveMember(index)}
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
			))}
			<div className="text-right">
				<button
					onClick={handleAdd}
					className="mt-2 px-4 py-2 text-black rounded"
				>
					<AddIcon />
				</button>
			</div>
		</div>
	);
};

export default BoardMembers;
