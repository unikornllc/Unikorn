import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const Expertise = ({ username, expertiseList, editable }) => {
	const [expertise, setExpertise] = useState(expertiseList);
	const [newSkill, setNewSkill] = useState("");
	const [addingSkill, setAddingSkill] = useState(false);

	const addSkill = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createExpertise`,
				{
					username,
					field: newSkill,
				},
				{ withCredentials: true },
			);
			setExpertise([...expertise, response.data.expertise]);
			setNewSkill("");
			setAddingSkill(false);
		} catch (error) {
			console.error("Error adding skill:", error);
		}
	};

	const removeSkill = async (skillId) => {
		try {
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/deleteOneExpertise`,
				{
					params: { expertiseId: skillId },
					withCredentials: true,
				},
			);
			setExpertise(expertise.filter((skill) => skill.id !== skillId));
		} catch (error) {
			console.error("Error removing skill:", error);
		}
	};

	// useEffect(() => {
	// 	const fetchUserExpertise = async () => {
	// 		try {
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllExpertise`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => setExpertise(response.data.expertise));
	// 		} catch (err) {
	// 			console.error("Error fetching user Expertise:", err);
	// 		}
	// 	};
	// 	fetchUserExpertise();
	// }, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">
					Skills & Expertise
				</h3>
				{editable && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingSkill(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>
			{editable && addingSkill && (
				<div className="mb-4 flex">
					<input
						type="text"
						value={newSkill}
						onChange={(e) => setNewSkill(e.target.value)}
						className="border border-gray-300 p-2 rounded-md flex-grow mr-2"
						placeholder="Enter a new skill"
					/>
					<button
						className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
						onClick={addSkill}
					>
						Add
					</button>
					<button
						className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 ml-2"
						onClick={() => {
							setAddingSkill(false);
							setNewSkill("");
						}}
					>
						Cancel
					</button>
				</div>
			)}
			<div className="flex flex-wrap">
				{expertise &&
					expertise.map((exp) => (
						<div
							key={exp.id}
							className="bg-gray-200 text-gray-700 px-3 py-1 m-1 rounded-full flex items-center"
						>
							<span>{exp.field}</span>
							{editable && (
								<button
									className="ml-2 text-red-500 hover:text-red-700"
									onClick={() => removeSkill(exp.id)}
								>
									<TrashIcon className="w-4 h-4" />
								</button>
							)}
						</div>
					))}
			</div>
		</div>
	);
};

export default Expertise;
