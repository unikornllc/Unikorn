"use client";

import React, { useState, useEffect } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon.jsx";
import SaveIcon from "@/app/_icons/SaveIcon.jsx";
import ExternalLink from "../ExternalLink";

const KeyEmployees = ({ employees = [], onUpdate }) => {
	const [localEmployees, setLocalEmployees] = useState(employees);
	const [editingIndex, setEditingIndex] = useState(null);
	const [tempEmployee, setTempEmployee] = useState({
		name: "",
		role: "",
	});
	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		if (JSON.stringify(localEmployees) !== JSON.stringify(employees)) {
			setLocalEmployees(employees);
		}
	}, [employees]);

	const startEditing = (index) => {
		setEditingIndex(index);
		setTempEmployee({ ...localEmployees[index] });
	};

	const cancelEditing = () => {
		setEditingIndex(null);
		setTempEmployee({ name: "", role: "" });
		setIsAdding(false);
	};

	const saveEmployee = () => {
		const updatedEmployees = [...localEmployees];
		updatedEmployees[editingIndex] = tempEmployee;
		setLocalEmployees(updatedEmployees);
		setEditingIndex(null);
		setTempEmployee({ name: "", role: "" });
		onUpdate("key_employees", updatedEmployees);
	};

	const handleDelete = (index) => {
		const updatedEmployees = localEmployees.filter((_, i) => i !== index);
		setLocalEmployees(updatedEmployees);
		onUpdate("key_employees", updatedEmployees);
	};

	const handleAddClick = () => {
		setIsAdding(true);
		setTempEmployee({ name: "", role: "" });
	};

	const handleAddSubmit = () => {
		const updatedEmployees = [...localEmployees, tempEmployee];
		setLocalEmployees(updatedEmployees);
		setIsAdding(false);
		setTempEmployee({ name: "", role: "" });
		onUpdate("key_employees", updatedEmployees);
	};

	const handleChange = (field, value) => {
		setTempEmployee((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Key Employees</h2>
			{localEmployees && localEmployees.length > 0 ? (
				localEmployees.map((employee, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Name:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={tempEmployee.name}
									onChange={(e) => handleChange("name", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">{employee.name || "-"}</span>
							)}
						</div>
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Role:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={tempEmployee.role}
									onChange={(e) => handleChange("role", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">{employee.role || "-"}</span>
							)}
						</div>
						<div className="flex justify-end">
							{editingIndex === index ? (
								<>
									<button
										onClick={saveEmployee}
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
					No key employees available. Click "Add" to get started.
				</p>
			)}

			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Name:</span>
						<input
							type="text"
							value={tempEmployee.name}
							onChange={(e) => handleChange("name", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Role:</span>
						<input
							type="text"
							value={tempEmployee.role}
							onChange={(e) => handleChange("role", e.target.value)}
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

export default KeyEmployees;
