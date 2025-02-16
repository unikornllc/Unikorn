import React, { useState } from "react";
import axios from "axios";

const PersonalInfo = ({ user }) => {
	const [editing, setEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name,
		email: user.email,
	});

	const handleSave = async () => {
		// try {
		// 	await axios.put(`/api/users/${user.id}`, formData);
		// 	setEditing(false);
		// } catch (error) {
		// 	console.error("Error updating personal info:", error);
		// }
		setEditing(false);
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold text-textPrimary mb-4">
				Personal Information
			</h2>
			{editing ? (
				<div className="space-y-4">
					<div>
						<label className="block text-gray-700">Name</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className="border border-gray-300 p-2 rounded-md w-full"
						/>
					</div>
					<div>
						<label className="block text-gray-700">Email</label>
						<input
							type="email"
							value={formData.email}
							onChange={(e) =>
								setFormData({ ...formData, email: e.target.value })
							}
							className="border border-gray-300 p-2 rounded-md w-full"
						/>
					</div>
					<div className="flex space-x-4">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
							onClick={handleSave}
						>
							Save
						</button>
						<button
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							onClick={() => setEditing(false)}
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div>
					<p className="text-gray-700 mb-2">
						<strong>Name:</strong> {user.name}
					</p>
					<p className="text-gray-700 mb-4">
						<strong>Email:</strong> {user.email}
					</p>
					<button
						className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
						onClick={() => setEditing(true)}
					>
						Edit
					</button>
				</div>
			)}
		</div>
	);
};

export default PersonalInfo;
