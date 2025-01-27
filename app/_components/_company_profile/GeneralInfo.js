import React, { useState } from "react";
import EditIcon from "@/app/_icons/EditIcon";
import SaveIcon from "@/app/_icons/SaveIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import ExternalLink from "../ExternalLink";

const Company_Type = {
	Profit: "Profit",
	NonProfit: "NonProfit",
	Private: "Private",
	Public: "Public",
};

const GeneralInfo = ({ company, onUpdate }) => {
	const [editingField, setEditingField] = useState(null);
	const [tempValue, setTempValue] = useState("");

	const startEditing = (fieldName) => {
		setEditingField(fieldName);
		setTempValue(company[fieldName] || "");
	};

	const cancelEditing = () => {
		setEditingField(null);
		setTempValue("");
	};

	const saveField = () => {
		if (editingField !== null) {
			onUpdate(editingField, tempValue);
			setEditingField(null);
			setTempValue("");
		}
	};

	const handleChange = (e) => {
		const { type, checked, value } = e.target;
		setTempValue(type === "checkbox" ? checked : value);
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Prevent default form submission
			saveField();
		} else if (e.key === "Escape") {
			cancelEditing();
		}
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">General Information</h2>
			<form
				className="grid grid-cols-1 gap-4 sm:grid-cols-2"
				onSubmit={(e) => e.preventDefault()} // Prevent form default submission
			>
				{company.tier == "Hunter" ? (
					<label className="block font-medium w-1/3">
						Company tier is: <strong>Hunter</strong>
					</label>
				) : (
					<label className="block font-medium w-1/3">
						Company tier is: <strong>Holder</strong>
					</label>
				)}
				{[
					{ label: "Name", name: "name", type: "text" },
					{ label: "Email", name: "email", type: "email" },
					{ label: "Username", name: "username", type: "text" },
					{ label: "Description", name: "description", type: "text" },
					{ label: "Website", name: "website", type: "text" },
					{ label: "Founded", name: "founded", type: "date" },
					{ label: "HQ Location", name: "hqlocation", type: "text" },
					{ label: "Hunter", name: "hunter", type: "checkbox" },
					{ label: "Industry", name: "industry", type: "text" },
					{
						label: "Company Type",
						name: "type",
						type: "select",
						options: Object.values(Company_Type),
					},
				].map((field) => (
					<div key={field.name} className="flex items-center">
						<label className="block font-medium w-1/3">{field.label}</label>
						{editingField === field.name ? (
							field.type === "select" ? (
								<select
									name={field.name}
									value={tempValue}
									onChange={handleChange}
									onKeyDown={handleKeyDown}
									className="border rounded px-2 py-1 flex-grow mr-2"
								>
									{field.options.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							) : field.type === "checkbox" ? (
								<input
									type="checkbox"
									name={field.name}
									checked={tempValue}
									onChange={handleChange}
									onKeyDown={handleKeyDown}
									className="mr-2"
								/>
							) : (
								<input
									type={field.type}
									name={field.name}
									value={tempValue}
									onChange={handleChange}
									onKeyDown={handleKeyDown}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							)
						) : (
							<span className="flex-grow mr-2">
								{field.type === "checkbox" ? (
									company[field.name] ? (
										"Yes"
									) : (
										"No"
									)
								) : field.type === "select" ? (
									company[field.name] || "-"
								) : field.type === "date" ? (
									company[field.name] ? (
										new Date(company[field.name]).toLocaleDateString()
									) : (
										"-"
									)
								) : field.name === "website" ? (
									company[field.name] ? (
										<ExternalLink href={company[field.name]}>
											{company[field.name]}
										</ExternalLink>
									) : (
										"-"
									)
								) : (
									company[field.name] || "-"
								)}
							</span>
						)}
						{editingField === field.name ? (
							<>
								<button
									type="button"
									onClick={saveField}
									className="text-blue-500 underline"
								>
									<SaveIcon />
								</button>
								<button
									type="button"
									onClick={cancelEditing}
									className="text-red-500 underline ml-2"
								>
									<DeleteIcon />
								</button>
							</>
						) : (
							<button
								type="button"
								onClick={() => startEditing(field.name)}
								className="text-blue-500 underline"
							>
								<EditIcon />
							</button>
						)}
					</div>
				))}
			</form>
		</div>
	);
};

export default GeneralInfo;
