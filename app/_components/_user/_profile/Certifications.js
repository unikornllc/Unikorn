import React, { useState, useRef, useEffect } from "react";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import { useUpdateItem } from "@/app/_components/_hooks/useUpdateItem";

const Certifications = ({ username, certificationList, editable }) => {
	const [certs, setCerts] = useState(certificationList);
	const [addingCert, setAddingCert] = useState(false);
	const [editingCertId, setEditingCertId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [editData, setEditData] = useState({});

	const { updateItem } = useUpdateItem();

	const [newCert, setNewCert] = useState({
		title: "",
		institution: "",
		completionDate: "",
		focusArea: "",
	});

	const formatDateForInput = (dateString) => {
		if (!dateString) return "";
		return new Date(dateString).toISOString().split("T")[0];
	};

	const handleEditClick = (cert) => {
		setEditingCertId(cert.id);
		setEditData(cert);
	};

	const addCertification = async () => {
		try {
			setLoading(true);
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
				completionDate: "",
				focusArea: "",
			});
			setAddingCert(false);
		} catch (error) {
			console.error("Error adding certification:", error);
		} finally {
			setLoading(false);
		}
	};
	const removeCertification = async (certId) => {
		try {
			setLoading(true);
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
		} finally {
			setLoading(false);
		}
	};
	const updateCertification = async (certId) => {
		try {
			setLoading(true);
			const updatedItem = await updateItem(
				"certificationsCourses",
				certId,
				editData,
			);

			setCerts((prevCerts) =>
				prevCerts.map((cert) => (cert.id === certId ? updatedItem : cert)),
			);

			setEditingCertId(null);
			setEditData({});
		} catch (error) {
			console.error("Error updating certification:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelEdit = () => {
		setEditingCertId(null);
		setEditData({});
	};

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
						value={formatDateForInput(newCert.completionDate)}
						onChange={(e) =>
							setNewCert({ ...newCert, completionDate: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Completion Date"
					/>
					<input
						type="text"
						value={newCert.focusArea}
						onChange={(e) =>
							setNewCert({ ...newCert, focusArea: e.target.value })
						}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						placeholder="Focus Area"
					/>
					<div className="flex">
						<button
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
							onClick={addCertification}
							disabled={loading}
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
									completionDate: "",
									focusArea: "",
								});
							}}
							disabled={loading}
						>
							Cancel
						</button>
					</div>
				</div>
			)}

			{certs &&
				certs.map((cert) => (
					<div key={cert.id} className="mb-6">
						{editingCertId === cert.id ? (
							<div className="border p-4 rounded-lg">
								<input
									type="text"
									value={editData.title}
									onChange={(e) =>
										setEditData({ ...editData, title: e.target.value })
									}
									className="border border-gray-300 p-2 rounded-md w-full mb-2"
									placeholder="Title"
								/>
								<input
									type="text"
									value={editData.institution}
									onChange={(e) =>
										setEditData({ ...editData, institution: e.target.value })
									}
									className="border border-gray-300 p-2 rounded-md w-full mb-2"
									placeholder="Institution"
								/>
								<input
									type="date"
									value={formatDateForInput(editData.completionDate)}
									onChange={(e) =>
										setEditData({ ...editData, completionDate: e.target.value })
									}
									className="border border-gray-300 p-2 rounded-md w-full mb-2"
								/>
								<input
									type="text"
									value={editData.focusArea}
									onChange={(e) =>
										setEditData({ ...editData, focusArea: e.target.value })
									}
									className="border border-gray-300 p-2 rounded-md w-full mb-2"
									placeholder="Focus Area"
								/>
								<div className="flex justify-between items-center">
									<DeleteButton
										onDelete={() => removeCertification(cert.id)}
										itemType="Certification"
										loading={loading}
										size="small"
										className="ml-2"
									/>
									<div className="flex space-x-2">
										<button
											className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
											onClick={handleCancelEdit}
											disabled={loading}
										>
											Cancel
										</button>
										<button
											className="px-3 py-1 bg-primary text-white rounded hover:bg-secondary"
											onClick={() => updateCertification(cert.id)}
											disabled={loading}
										>
											Save
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="flex justify-between items-start">
								<div>
									<h4 className="text-lg font-semibold text-textPrimary">
										{cert.title}
									</h4>
									<p className="text-textSecondary">{cert.institution}</p>
									<p className="text-sm text-gray-500">
										Completed on{" "}
										{new Date(cert.completionDate).toLocaleDateString()}
									</p>
									<p className="text-textSecondary mt-2">
										Focus Area: {cert.focusArea}
									</p>
								</div>
								{editable && (
									<button
										className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
										onClick={() => handleEditClick(cert)}
									>
										<PencilIcon className="w-5 h-5 text-gray-600" />
									</button>
								)}
							</div>
						)}
					</div>
				))}
		</div>
	);
};

export default Certifications;
