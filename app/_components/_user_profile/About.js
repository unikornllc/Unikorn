import React, { useState, useRef, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { set } from "react-hook-form";

const About = ({ username, aboutList, editable }) => {
	const [about, setAbout] = useState(aboutList);
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSave = async () => {
		try {
			setLoading(true);
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/updateUser`,
				{ username, description: about.description },
				{
					withCredentials: true,
				},
			);
		} catch (error) {
			console.error("Error removing certification:", error);
		} finally {
			setLoading(false);
		}
		setEditing(false);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6 relative">
			<div className="absolute top-4 right-4">
				{editable && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setEditing(!editing)}
					>
						<PencilIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>
			<h3 className="text-2xl font-semibold text-textPrimary mb-4">About</h3>
			{editable && editing ? (
				<div>
					<textarea
						value={about.description}
						onChange={(e) =>
							setAbout({ ...about, description: e.target.value })
						}
						rows="5"
						className="w-full border border-gray-300 p-2 rounded-md"
					></textarea>
					<div className="mt-4 flex">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
							onClick={handleSave}
							disabled={loading}
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
				<p className="text-textSecondary">{about.description}</p>
			)}
		</div>
	);
};

export default About;
