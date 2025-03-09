import React, { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";

import { useToast } from "@/app/_components/_hooks/useToast";

const About = ({ username, aboutList, editable }) => {
	const [about, setAbout] = useState(aboutList);
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const maxCharacters = 600;
	const { toast } = useToast();
	const handleSave = async () => {
		try {
			setLoading(true);
			await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/updateUser`,
				{ description: about.description },
				{
					withCredentials: true,
				},
			);
			toast({
				title: "Success",
				description: `Description updated successfully`,
				variant: "success",
			});
		} catch (error) {
			toast({
				title: "Failed",
				description:
					error.response?.data?.message || "An error occurred while updating",
				variant: "destructive",
			});
			console.error("Error updating Description:", error);
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
							setAbout({
								...about,
								description: e.target.value.slice(0, maxCharacters),
							})
						}
						rows="5"
						className="w-full border border-gray-300 p-2 rounded-md"
					></textarea>
					<p className="text-sm text-gray-500 mt-1">
						{about.description.length}/{maxCharacters} characters
					</p>
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
