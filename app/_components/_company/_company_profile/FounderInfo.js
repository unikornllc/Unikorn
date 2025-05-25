"use client";

import React, { useState, useEffect } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon";
import SaveIcon from "@/app/_icons/SaveIcon";
import ExternalLink from "../../ExternalLink";

const FounderInfo = ({ founders = [], onUpdate }) => {
	const [localFounders, setLocalFounders] = useState(founders);
	const [editingIndex, setEditingIndex] = useState(null);
	const [tempFounder, setTempFounder] = useState({
		name: "",
		role: "",
		crunchBaseLink: "",
	});
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		if (JSON.stringify(localFounders) !== JSON.stringify(founders)) {
			setLocalFounders(founders);
		}
	}, [founders]);

	const startEditing = (index) => {
		setEditingIndex(index);
		setTempFounder({ ...localFounders[index] });
	};

	const cancelEditing = () => {
		setEditingIndex(null);
		setTempFounder({ name: "", role: "", crunchBaseLink: "" });
		setIsAdding(false);
	};

	const saveFounder = () => {
		const updatedFounders = [...localFounders];
		updatedFounders[editingIndex] = tempFounder;
		setLocalFounders(updatedFounders);
		setEditingIndex(null);
		setTempFounder({ name: "", role: "", crunchBaseLink: "" });
		onUpdate("founders", updatedFounders);
	};

	const handleDelete = (index) => {
		const updatedFounders = localFounders.filter((_, i) => i !== index);
		setLocalFounders(updatedFounders);
		onUpdate("founders", updatedFounders);
	};

	const handleAddClick = () => {
		setIsAdding(true);
		setTempFounder({ name: "", role: "", crunchBaseLink: "" });
	};

	const handleAddSubmit = () => {
		const updatedFounders = [...localFounders, tempFounder];
		setLocalFounders(updatedFounders);
		setIsAdding(false);
		setTempFounder({ name: "", role: "", crunchBaseLink: "" });
		onUpdate("founders", updatedFounders);
	};

	const handleChange = (field, value) => {
		setTempFounder((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Founders</h2>
			{localFounders && localFounders.length > 0 ? (
				localFounders.map((founder, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Name:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={tempFounder.name}
									onChange={(e) => handleChange("name", e.target.value)}
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
									value={tempFounder.role}
									onChange={(e) => handleChange("role", e.target.value)}
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
									value={tempFounder.crunchBaseLink}
									onChange={(e) =>
										handleChange("crunchBaseLink", e.target.value)
									}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : founder.crunchBaseLink ? (
								<ExternalLink
									href={
										founder.crunchBaseLink.startsWith("http://") ||
										founder.crunchBaseLink.startsWith("https://")
											? founder.crunchBaseLink
											: `https://${founder.crunchBaseLink}`
									}
									className="flex-grow mr-2 text-blue-500 underline"
								>
									{founder.crunchBaseLink}
								</ExternalLink>
							) : (
								<span className="flex-grow mr-2">-</span>
							)}
						</div>
						<div className="flex justify-end">
							{editingIndex === index ? (
								<>
									<button
										onClick={saveFounder}
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
					No founders available. Click "Add" to get started.
				</p>
			)}

			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Name:</span>
						<input
							type="text"
							value={tempFounder.name}
							onChange={(e) => handleChange("name", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Role:</span>
						<input
							type="text"
							value={tempFounder.role}
							onChange={(e) => handleChange("role", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">CrunchBase Link:</span>
						<input
							type="text"
							value={tempFounder.crunchBaseLink}
							onChange={(e) => handleChange("crunchBaseLink", e.target.value)}
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

export default FounderInfo;
