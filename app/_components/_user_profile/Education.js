import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { set } from "react-hook-form";

const Education = ({ username, educationList, editable }) => {
	const [educations, setEducations] = useState(educationList);
	const [addingEducation, setAddingEducation] = useState(false);
	const [newEducation, setNewEducation] = useState({
		degree: "NONE",
		institution: "",
	});
	const degrees = ["NONE", "BA", "BSc", "MA", "MSc", "MBA", "PhD"];
	const [loading, setLoading] = useState(false);

	const addEducation = async () => {
		try {
			setLoading(true);
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createEducation`,
				{
					username,
					...newEducation,
				},
				{ withCredentials: true },
			);
			setEducations([...educations, response.data.education]);
			setNewEducation({ degree: "", institution: "" });
			setAddingEducation(false);
		} catch (error) {
			console.error("Error adding education:", error);
		} finally {
			setLoading(false);
		}
	};

	const removeEducation = async (educationId) => {
		try {
			setLoading(true);
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteOneEducation`,
				{
					params: { educationId },
					withCredentials: true,
				},
			);
			setEducations(educations.filter((edu) => edu.id !== educationId));
		} catch (error) {
			console.error("Error removing education:", error);
		} finally {
			setLoading(false);
		}
	};

	// useEffect(() => {
	// 	const fetchUserEducation = async () => {
	// 		try {
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllEducation`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => setEducations(response.data.education));
	// 		} catch (err) {
	// 			console.error("Error fetching user Education:", err);
	// 		}
	// 	};
	// 	fetchUserEducation();
	// }, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">Education</h3>
				{editable && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingEducation(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>
			{editable && addingEducation && (
				<div className="mb-4">
					<select
						value={newEducation.degree}
						onChange={(e) =>
							setNewEducation({ ...newEducation, degree: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
					>
						{degrees.map((degree) => (
							<option key={degree} value={degree}>
								{degree}
							</option>
						))}
					</select>
					<input
						type="text"
						value={newEducation.institution}
						onChange={(e) =>
							setNewEducation({ ...newEducation, institution: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Institution"
					/>
					<div className="flex">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
							onClick={addEducation}
							disabled={loading}
						>
							Add
						</button>
						<button
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							onClick={() => {
								setAddingEducation(false);
								setNewEducation({ degree: "", institution: "" });
							}}
							disabled={loading}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
			{educations &&
				educations.map((edu) => (
					<div key={edu.id} className="mb-6 flex justify-between items-start">
						<div>
							<h4 className="text-lg font-semibold text-textPrimary">
								{edu.institution}
							</h4>
							<p className="text-textSecondary">{edu.degree}</p>
						</div>
						{editable && (
							<button
								className="p-2 text-red-500 hover:text-red-700"
								onClick={() => removeEducation(edu.id)}
							>
								<TrashIcon className="w-5 h-5" />
							</button>
						)}
					</div>
				))}
		</div>
	);
};

export default Education;
