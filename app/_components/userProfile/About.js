import React, { useState, useRef, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const About = ({ user, userId }) => {
	const [editing, setEditing] = useState(false);
	const [description, setDescription] = useState(user.description);

	const handleSave = async () => {
		try {
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/updateUser`,
				{ userId, description },
				{
					withCredentials: true,
				},
			);
		} catch (error) {
			console.error("Error removing certification:", error);
		}
		setEditing(false);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6 relative">
			<div className="absolute top-4 right-4">
				<button
					className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
					onClick={() => setEditing(!editing)}
				>
					<PencilIcon className="w-5 h-5 text-gray-600" />
				</button>
			</div>
			<h3 className="text-2xl font-semibold text-textPrimary mb-4">About</h3>
			{editing ? (
				<>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows="5"
						className="w-full border border-gray-300 p-2 rounded-md"
					></textarea>
					<div className="mt-4 flex">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
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
				</>
			) : (
				<p className="text-textSecondary">{description}</p>
			)}
		</div>
	);
};

export default About;
