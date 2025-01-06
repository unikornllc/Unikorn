import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon.jsx";
import SaveIcon from "@/app/_icons/SaveIcon.jsx";

const Advisors = ({ advisors = [], onUpdate }) => {
	const [localAdvisors, setLocalAdvisors] = useState(advisors);
	const [editingIndex, setEditingIndex] = useState(null);
	const [tempValue, setTempValue] = useState("");

	const startEditing = (index) => {
		setEditingIndex(index);
		setTempValue(localAdvisors[index]);
	};

	const cancelEditing = () => {
		setEditingIndex(null);
		setTempValue("");
	};

	const saveAdvisor = () => {
		const updatedAdvisors = [...localAdvisors];
		updatedAdvisors[editingIndex] = tempValue;
		setLocalAdvisors(updatedAdvisors);
		setEditingIndex(null);
		setTempValue("");
		// Update the backend and parent state
		onUpdate("advisors", updatedAdvisors);
	};

	const handleDelete = (index) => {
		const updatedAdvisors = localAdvisors.filter((_, i) => i !== index);
		setLocalAdvisors(updatedAdvisors);
		// Update the backend and parent state
		onUpdate("advisors", updatedAdvisors);
	};

	const handleAdd = () => {
		const updatedAdvisors = [...localAdvisors, ""];
		setLocalAdvisors(updatedAdvisors);
		setEditingIndex(updatedAdvisors.length - 1);
		setTempValue("");
	};

	const handleChange = (e) => {
		setTempValue(e.target.value);
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Advisors</h2>
			{localAdvisors.map((advisor, index) => (
				<div key={index} className="flex items-center mb-2">
					{editingIndex === index ? (
						<input
							type="text"
							value={tempValue}
							onChange={handleChange}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					) : (
						<span className="flex-grow mr-2">{advisor}</span>
					)}
					{editingIndex === index ? (
						<>
							<button
								onClick={saveAdvisor}
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

export default Advisors;
