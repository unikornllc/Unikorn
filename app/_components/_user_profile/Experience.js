import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const Experience = ({
	username,
	corporateExperienceList,
	startupExperienceList,
	editable,
}) => {
	const [activeTab, setActiveTab] = useState("Corporate");

	const [corporateExperiences, setCorporateExperiences] = useState(
		corporateExperienceList,
	);
	const [addingCorporateExp, setAddingCorporateExp] = useState(false);
	const [newCorporateExp, setNewCorporateExp] = useState({
		job_title: "",
		company_name: "",
		start_date: "",
		end_date: "",
		responsibilities: "",
	});

	const [startupExperiences, setStartupExperiences] = useState(
		startupExperienceList,
	);
	const [addingStartupExp, setAddingStartupExp] = useState(false);
	const [newStartupExp, setNewStartupExp] = useState({
		startup_name: "",
		role: "",
		description: "",
	});

	const addCorporateExperience = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createCorporateExperience`,
				{
					username,
					...newCorporateExp,
				},
				{ withCredentials: true },
			);
			setCorporateExperiences((prevExps) => [
				...prevExps,
				response.data.corporateExperience,
			]);
			setNewCorporateExp({
				job_title: "",
				company_name: "",
				start_date: "",
				end_date: "",
				responsibilities: "",
			});
			setAddingCorporateExp(false);
		} catch (error) {
			console.error("Error adding corporate experience:", error);
		}
	};

	const removeCorporateExperience = async (experienceId) => {
		try {
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/deleteCorporateExperience`,
				{
					params: { corporateExperienceId: experienceId },
					withCredentials: true,
				},
			);
			setCorporateExperiences(
				corporateExperiences.filter((exp) => exp.id !== experienceId),
			);
		} catch (error) {
			console.error("Error removing corporate experience:", error);
		}
	};

	const addStartupExperience = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/createStartupExperience`,
				{
					username,
					...newStartupExp,
				},
				{ withCredentials: true },
			);
			setStartupExperiences((prevExps) => [
				...prevExps,
				response.data.startupExperience,
			]);
			console.log();
			setNewStartupExp({
				startup_name: "",
				role: "",
				description: "",
			});
			setAddingStartupExp(false);
		} catch (error) {
			console.error("Error adding startup experience:", error);
		}
	};

	const removeStartupExperience = async (experienceId) => {
		try {
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/deleteStartupExperience`,
				{
					params: { startupExperienceId: experienceId },
					withCredentials: true,
				},
			);
			setStartupExperiences(
				startupExperiences.filter((exp) => exp.id !== experienceId),
			);
		} catch (error) {
			console.error("Error removing startup experience:", error);
		}
	};

	// useEffect(() => {
	// 	const fetchUserExperiences = async () => {
	// 		try {
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllCorporateExperience`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => {
	// 					// console.log(response.data.corporateExperience);
	// 					setCorporateExperiences(response.data.corporateExperience);
	// 				});
	// 			await axios
	// 				.get(`${process.env.NEXT_PUBLIC_SERVER}/getAllStartupExperience`, {
	// 					params: { username },
	// 					withCredentials: true,
	// 				})
	// 				.then((response) => {
	// 					// console.log(response.data.startupExperience);
	// 					setStartupExperiences(response.data.startupExperience);
	// 				});
	// 		} catch (err) {
	// 			console.error("Error fetching user Experiences:", err);
	// 		}
	// 	};
	// 	fetchUserExperiences();
	// }, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">Experience</h3>
				<div className="flex space-x-4">
					{editable && activeTab === "Corporate" && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingCorporateExp(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
					{editable && activeTab === "Startup" && (
						<button
							className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
							onClick={() => setAddingStartupExp(true)}
						>
							<PlusIcon className="w-5 h-5 text-gray-600" />
						</button>
					)}
				</div>
			</div>
			<div className="mb-4 border-b border-gray-200">
				<button
					className={`mr-4 pb-2 ${
						activeTab === "Corporate"
							? "border-b-2 border-primary text-primary font-semibold"
							: "text-gray-600"
					}`}
					onClick={() => setActiveTab("Corporate")}
				>
					Corporate
				</button>
				<button
					className={`pb-2 ${
						activeTab === "Startup"
							? "border-b-2 border-primary text-primary font-semibold"
							: "text-gray-600"
					}`}
					onClick={() => setActiveTab("Startup")}
				>
					Startup
				</button>
			</div>

			{activeTab === "Corporate" && (
				<div>
					{editable && addingCorporateExp && (
						<div className="mb-6">
							<input
								type="text"
								value={newCorporateExp.job_title}
								onChange={(e) =>
									setNewCorporateExp({
										...newCorporateExp,
										job_title: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Job Title"
							/>
							<input
								type="text"
								value={newCorporateExp.company_name}
								onChange={(e) =>
									setNewCorporateExp({
										...newCorporateExp,
										company_name: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Company Name"
							/>
							<div className="flex space-x-2 mb-2">
								<input
									type="date"
									value={newCorporateExp.start_date}
									onChange={(e) =>
										setNewCorporateExp({
											...newCorporateExp,
											start_date: e.target.value,
										})
									}
									className="border border-gray-300 p-2 rounded-md w-1/2"
									placeholder="Start Date"
								/>
								<input
									type="date"
									value={newCorporateExp.end_date}
									onChange={(e) =>
										setNewCorporateExp({
											...newCorporateExp,
											end_date: e.target.value,
										})
									}
									className="border border-gray-300 p-2 rounded-md w-1/2"
									placeholder="End Date"
								/>
							</div>
							<textarea
								value={newCorporateExp.responsibilities}
								onChange={(e) =>
									setNewCorporateExp({
										...newCorporateExp,
										responsibilities: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Responsibilities"
								rows={4}
							></textarea>
							<div className="flex">
								<button
									className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
									onClick={addCorporateExperience}
								>
									Add
								</button>
								<button
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
									onClick={() => {
										setAddingCorporateExp(false);
										setNewCorporateExp({
											job_title: "",
											company_name: "",
											start_date: "",
											end_date: "",
											responsibilities: "",
										});
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{corporateExperiences &&
						corporateExperiences.map((exp, index) => (
							<div
								key={exp.id || `exp-${index}`}
								className="mb-6 flex justify-between items-start"
							>
								<div>
									<h4 className="text-lg font-semibold text-textPrimary">
										{exp.job_title}
									</h4>
									<p className="text-textSecondary">{exp.company_name}</p>
									<p className="text-sm text-gray-500">
										{new Date(exp.start_date).toLocaleDateString()} -{" "}
										{exp.end_date
											? new Date(exp.end_date).toLocaleDateString()
											: "Present"}
									</p>
									<p className="text-textSecondary mt-2">
										{exp.responsibilities}
									</p>
								</div>
								{editable && (
									<button
										className="p-2 text-red-500 hover:text-red-700"
										onClick={() => removeCorporateExperience(exp.id)}
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								)}
							</div>
						))}
				</div>
			)}
			{activeTab === "Startup" && (
				<div>
					{editable && addingStartupExp && (
						<div className="mb-6">
							<input
								type="text"
								value={newStartupExp.role}
								onChange={(e) =>
									setNewStartupExp({
										...newStartupExp,
										role: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Role"
							/>
							<input
								type="text"
								value={newStartupExp.startup_name}
								onChange={(e) =>
									setNewStartupExp({
										...newStartupExp,
										startup_name: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Startup Name"
							/>
							<textarea
								value={newStartupExp.description}
								onChange={(e) =>
									setNewStartupExp({
										...newStartupExp,
										description: e.target.value,
									})
								}
								className="border border-gray-300 p-2 rounded-md w-full mb-2"
								placeholder="Description"
								rows={4}
							></textarea>
							<div className="flex">
								<button
									className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
									onClick={addStartupExperience}
								>
									Add
								</button>
								<button
									className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
									onClick={() => {
										setAddingStartupExp(false);
										setNewStartupExp({
											startup_name: "",
											role: "",
											description: "",
										});
									}}
								>
									Cancel
								</button>
							</div>
						</div>
					)}
					{startupExperiences &&
						startupExperiences.map((exp, index) => (
							<div
								key={exp.id || `exp-${index}`}
								className="mb-6 flex justify-between items-start"
							>
								<div>
									<h4 className="text-lg font-semibold text-textPrimary">
										{exp.role}
									</h4>
									<p className="text-textSecondary">{exp.startup_name}</p>
									<p className="text-textSecondary mt-2">{exp.description}</p>
								</div>
								{editable && (
									<button
										className="p-2 text-red-500 hover:text-red-700"
										onClick={() => removeStartupExperience(exp.id)}
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								)}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default Experience;
