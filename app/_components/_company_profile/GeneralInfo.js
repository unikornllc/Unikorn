import EditIcon from "@/app/_icons/EditIcon";
import SaveIcon from "@/app/_icons/SaveIcon";
import React, { useState } from "react";

const Company_Type = {
	Profit: "Profit",
	NonProfit: "NonProfit",
	Private: "Private",
	Public: "Public",
};

const GeneralInfo = ({ company, onUpdate }) => {
	const [editingField, setEditingField] = useState(null);

	const handleChange = (e) => {
		const { name, type, checked, value } = e.target;

		if (type === "checkbox") {
			// If it's a checkbox, set the value to true or false
			onUpdate(name, checked);
		} else {
			onUpdate(name, value);
		}
	};

	const toggleEdit = (field) => {
		setEditingField(editingField === field ? null : field);
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">General Information</h2>
			<form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
						name: "companyType",
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
									value={company[field.name] || ""}
									onChange={handleChange}
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
									checked={company[field.name] || false}
									onChange={handleChange}
									className="mr-2"
								/>
							) : (
								<input
									type={field.type}
									name={field.name}
									value={company[field.name] || ""}
									onChange={handleChange}
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
								) : field.name === "website" ? (
									<a
										href={company[field.name]}
										className="text-blue-500 underline"
									>
										{company[field.name]}
									</a>
								) : (
									company[field.name] || "-"
								)}
							</span>
						)}
						<button
							type="button"
							onClick={() => toggleEdit(field.name)}
							className="text-blue-500 underline"
						>
							{editingField === field.name ? <SaveIcon /> : <EditIcon />}
						</button>
					</div>
				))}
			</form>
		</div>
	);
};

export default GeneralInfo;
