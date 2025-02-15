import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const Certifications = ({ username, certificationList, editable }) => {
	const [certs, setCerts] = useState(certificationList);
	const [addingCert, setAddingCert] = useState(false);
	const [newCert, setNewCert] = useState({
		title: "",
		institution: "",
		completion_date: "",
		focus_area: "",
	});

	const addCertification = async () => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createCertificationsCourses`,
				{
					username,
					...newCert,
				},
				{ withCredentials: true },
			);
			setCerts([...certs, response.data.certificationsCourses]);
			setNewCert({
				title: "",
				institution: "",
				completion_date: "",
				focus_area: "",
			});
			setAddingCert(false);
		} catch (error) {
			console.error("Error adding certification:", error);
		}
	};

	const removeCertification = async (certId) => {
		try {
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deleteCertificationsCourses`,
				{
					params: { certificationsCourseId: certId },
					withCredentials: true,
				},
			);
			setCerts(certs.filter((cert) => cert.id !== certId));
		} catch (error) {
			console.error("Error removing certification:", error);
		}
	};

	// useEffect(() => {
	// 	const fetchUserCertifications = async () => {
	// 		try {
	// 			await axios
	// 				.get(
	// 					`${process.env.NEXT_PUBLIC_SERVER}/getAllCertificationsCourses`,
	// 					{
	// 						params: { username },
	// 						withCredentials: true,
	// 					},
	// 				)
	// 				.then((response) => setCerts(response.data.certificationsCourses));
	// 		} catch (err) {
	// 			console.error("Error fetching user Certifications:", err);
	// 		}
	// 	};
	// 	fetchUserCertifications();
	// }, []);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">
					Certifications & Courses
				</h3>
				{editable && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingCert(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>
			{editable && addingCert && (
				<div className="mb-4">
					<input
						type="text"
						value={newCert.title}
						onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Title"
					/>
					<input
						type="text"
						value={newCert.institution}
						onChange={(e) =>
							setNewCert({ ...newCert, institution: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Institution"
					/>
					<input
						type="date"
						value={newCert.completion_date}
						onChange={(e) =>
							setNewCert({ ...newCert, completion_date: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Completion Date"
					/>
					<input
						type="text"
						value={newCert.focus_area}
						onChange={(e) =>
							setNewCert({ ...newCert, focus_area: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Focus Area"
					/>
					<div className="flex">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
							onClick={addCertification}
						>
							Add
						</button>
						<button
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							onClick={() => {
								setAddingCert(false);
								setNewCert({
									title: "",
									institution: "",
									completion_date: "",
									focus_area: "",
								});
							}}
						>
							Cancel
						</button>
					</div>
				</div>
			)}
			{certs &&
				certs.map((cert) => (
					<div key={cert.id} className="mb-6 flex justify-between items-start">
						<div>
							<h4 className="text-lg font-semibold text-textPrimary">
								{cert.title}
							</h4>
							<p className="text-textSecondary">{cert.institution}</p>
							<p className="text-sm text-gray-500">
								Completed on{" "}
								{new Date(cert.completion_date).toLocaleDateString()}
							</p>
							<p className="text-textSecondary mt-2">
								Focus Area: {cert.focus_area}
							</p>
						</div>
						{editable && (
							<button
								className="p-2 text-red-500 hover:text-red-700"
								onClick={() => removeCertification(cert.id)}
							>
								<TrashIcon className="w-5 h-5" />
							</button>
						)}
					</div>
				))}
		</div>
	);
};

export default Certifications;
