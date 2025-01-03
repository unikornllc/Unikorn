import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon.jsx";
import SaveIcon from "@/app/_icons/SaveIcon.jsx";
import React, { useState } from "react";

const Advisors = ({ advisors, onUpdate }) => {
	const [editingIndex, setEditingIndex] = useState(null);

	const handleChange = (index, value) => {
		const updatedAdvisors = [...advisors];
		updatedAdvisors[index] = value;
		onUpdate("advisors", updatedAdvisors);
	};

	const handleDelete = (index) => {
		const updatedAdvisors = members.filter((_, i) => i !== index);
		onUpdate("advisors", updatedAdvisors);
	};

	const toggleEdit = (index) => {
		setEditingIndex(editingIndex === index ? null : index);
	};

	const handleAdd = () => {
		onUpdate("advisors", [...advisors, ""]);
		setEditingIndex(advisors.length);
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Advisors</h2>
			{advisors.map((advisor, index) => (
				<div key={index} className="flex items-center mb-2">
					{editingIndex === index ? (
						<input
							type="text"
							value={advisor}
							onChange={(e) => handleChange(index, e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					) : (
						<span className="flex-grow mr-2">{advisor}</span>
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

export default Advisors;
