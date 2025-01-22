import React, { useEffect, useState } from "react";
import axios from "axios";

const CalendlySettings = ({ user }) => {
	const { calendlyIntegration } = user;
	const [visibility, setVisibility] = useState(
		calendlyIntegration.calendlyVisibility || "PUBLIC",
	);
	const [allowedIndustries, setAllowedIndustries] = useState(
		calendlyIntegration.allowedIndustries || [],
	);
	const [minYears, setMinYears] = useState(
		calendlyIntegration.minYearsOfOperation || 0,
	);
	const [allowedRoles, setAllowedRoles] = useState(
		calendlyIntegration.allowedRoles || [],
	);

	const handleSave = async () => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/calendly/settings`,
				{
					visibility,
					allowedIndustries,
					minYearsOfOperation: minYears,
					allowedRoles,
				},
				{
					withCredentials: true,
				},
			);
		} catch (error) {
			console.error("Error updating Calendly settings:", error);
		}
	};

	return (
		<div>
			<div className="space-y-4">
				<div>
					<label className="block text-gray-700 mb-1">Visibility</label>
					<select
						value={visibility}
						onChange={(e) => setVisibility(e.target.value)}
						className="border border-gray-300 p-2 rounded-md w-full"
					>
						<option value="PUBLIC">Public</option>
						<option value="PRO_USERS">PRO Users</option>
						<option value="INVESTORS">Investors</option>
						<option value="ENTREPRENEURS">Entrepreneurs</option>
						<option value="CUSTOM">Custom</option>
					</select>
				</div>
				{/* Additional fields for custom filters */}
				{visibility === "CUSTOM" && (
					<div>
						<div>
							<label className="block text-gray-700 mb-1">
								Allowed Industries
							</label>
							<input
								type="text"
								value={allowedIndustries.join(", ")}
								onChange={(e) =>
									setAllowedIndustries(
										e.target.value.split(",").map((s) => s.trim()),
									)
								}
								className="border border-gray-300 p-2 rounded-md w-full"
								placeholder="e.g., Technology, Finance"
							/>
						</div>
						<div>
							<label className="block text-gray-700 mb-1">
								Minimum Years of Operation
							</label>
							<input
								type="number"
								value={minYears}
								onChange={(e) => setMinYears(parseInt(e.target.value))}
								className="border border-gray-300 p-2 rounded-md w-full"
								placeholder="e.g., 2"
							/>
						</div>
						<div>
							<label className="block text-gray-700 mb-1">Allowed Roles</label>
							<input
								type="text"
								value={allowedRoles.join(", ")}
								onChange={(e) =>
									setAllowedRoles(
										e.target.value
											.split(",")
											.map((s) => s.trim().toUpperCase()),
									)
								}
								className="border border-gray-300 p-2 rounded-md w-full"
								placeholder="e.g., INVESTOR, ENTREPRENEUR"
							/>
						</div>
					</div>
				)}
				<button
					className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
					onClick={handleSave}
				>
					Save
				</button>
			</div>
		</div>
	);
};

export default CalendlySettings;
