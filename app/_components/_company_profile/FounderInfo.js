import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import SaveIcon from "@/app/_icons/SaveIcon";
import React, { useState } from "react";

const FounderInfo = ({ founders = [], onUpdate }) => {
	const [editingIndex, setEditingIndex] = useState(null);
	const [newFounder, setNewFounder] = useState({
		name: "",
		role: "",
		crunch_base_link: "",
	});
	const [isAdding, setIsAdding] = useState(false);

	const handleChange = (index, field, value) => {
		const updatedFounders = [...founders];
		updatedFounders[index] = { ...updatedFounders[index], [field]: value };
		onUpdate("founders", updatedFounders);
	};

	const handleDelete = (index) => {
		const updatedFounders = founders.filter((_, i) => i !== index);
		onUpdate("founders", updatedFounders);
	};

	const toggleEdit = (index) => {
		setEditingIndex(editingIndex === index ? null : index);
	};

	const handleAddClick = () => {
		setIsAdding(true);
	};

	const handleAddSubmit = () => {
		const updatedFounders = [...(founders || []), newFounder];
		onUpdate("founders", updatedFounders);
		setNewFounder({ name: "", role: "", crunch_base_link: "" });
		setIsAdding(false);
	};

	const handleNewFounderChange = (field, value) => {
		setNewFounder({ ...newFounder, [field]: value });
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Founders</h2>
			{founders && founders.length > 0 ? (
				founders.map((founder, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Name:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={founder.name}
									onChange={(e) => handleChange(index, "name", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">{founder.name || "-"}</span>
							)}
						</div>
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Role:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={founder.role}
									onChange={(e) => handleChange(index, "role", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">{founder.role || "-"}</span>
							)}
						</div>
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">CrunchBase Link:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={founder.crunch_base_link}
									onChange={(e) =>
										handleChange(index, "crunch_base_link", e.target.value)
									}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<a
									href={founder.crunch_base_link}
									className="flex-grow mr-2 text-blue-500 underline"
									target="_blank"
									rel="noopener noreferrer"
								>
									{founder.crunch_base_link || "-"}
								</a>
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
					No founders available. Click "Add Founder" to get started.
				</p>
			)}

			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Name:</span>
						<input
							type="text"
							value={newFounder.name}
							onChange={(e) => handleNewFounderChange("name", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Role:</span>
						<input
							type="text"
							value={newFounder.role}
							onChange={(e) => handleNewFounderChange("role", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">CrunchBase Link:</span>
						<input
							type="text"
							value={newFounder.crunch_base_link}
							onChange={(e) =>
								handleNewFounderChange("crunch_base_link", e.target.value)
							}
							className="border rounded px-2 py-1 flex-grow mr-2"
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

export default FounderInfo;
