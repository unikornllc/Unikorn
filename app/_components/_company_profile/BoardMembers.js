import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon.jsx";
import SaveIcon from "@/app/_icons/SaveIcon.jsx";
import React, { useState } from "react";

const BoardMembers = ({ members, onUpdate }) => {
	const [editingIndex, setEditingIndex] = useState(null);

	const handleChange = (index, value) => {
		const updatedMembers = [...members];
		updatedMembers[index] = value;
		onUpdate("board_members", updatedMembers);
	};

	const handleDelete = (index) => {
		const updatedMembers = members.filter((_, i) => i !== index);
		onUpdate("board_members", updatedMembers);
	};

	const toggleEdit = (index) => {
		setEditingIndex(editingIndex === index ? null : index);
	};

	const handleAdd = () => {
		onUpdate("board_members", [...members, ""]);
		setEditingIndex(members.length);
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Board Members</h2>
			{members.map((member, index) => (
				<div key={index} className="flex items-center mb-2">
					{editingIndex === index ? (
						<input
							type="text"
							value={member}
							onChange={(e) => handleChange(index, e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					) : (
						<span className="flex-grow mr-2">{member}</span>
					)}
					<button
						onClick={() => toggleEdit(index)}
						className="text-blue-500 underline mr-2"
					>
						{editingIndex === index ? <SaveIcon /> : <EditIcon />}
					</button>
					<button
						onClick={() => handleDelete(index)}
						className="text-red-500 underline"
					>
						<DeleteIcon />
					</button>
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
