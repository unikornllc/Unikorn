"use client";

import { useState } from "react";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Plus, X } from "lucide-react";

export default function UserCertifications({ user, isOwnProfile }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedCertifications, setEditedCertifications] = useState(
		user.certificationsCourses,
	);

	const handleSave = async () => {
		// In a real app, send a PUT request to update the user data
		// await fetch(`/api/user/${user.id}/certifications`, { method: 'PUT', body: JSON.stringify(editedCertifications) })
		setIsEditing(false);
	};

	const handleAddCertification = () => {
		setEditedCertifications([
			...editedCertifications,
			{ title: "", institution: "", completion_date: "", focus_area: "" },
		]);
	};

	const handleRemoveCertification = (index) => {
		setEditedCertifications(editedCertifications.filter((_, i) => i !== index));
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">Certifications & Courses</h2>
				{isOwnProfile &&
					(isEditing ? (
						<div>
							<Button onClick={handleSave} className="mr-2">
								Save
							</Button>
							<Button variant="outline" onClick={() => setIsEditing(false)}>
								Cancel
							</Button>
						</div>
					) : (
						<Button onClick={() => setIsEditing(true)}>Edit</Button>
					))}
			</div>
			{isEditing ? (
				<div className="space-y-4">
					{editedCertifications.map((cert, index) => (
						<div key={index} className="border p-4 rounded-md relative">
							<button
								onClick={() => handleRemoveCertification(index)}
								className="absolute top-2 right-2 text-red-500 hover:text-red-700"
							>
								<X size={20} />
							</button>
							<Input
								value={cert.title}
								onChange={(e) => {
									const newCertifications = [...editedCertifications];
									newCertifications[index].title = e.target.value;
									setEditedCertifications(newCertifications);
								}}
								placeholder="Title"
								className="mb-2"
							/>
							<Input
								value={cert.institution}
								onChange={(e) => {
									const newCertifications = [...editedCertifications];
									newCertifications[index].institution = e.target.value;
									setEditedCertifications(newCertifications);
								}}
								placeholder="Institution"
								className="mb-2"
							/>
							<Input
								type="date"
								value={cert.completion_date}
								onChange={(e) => {
									const newCertifications = [...editedCertifications];
									newCertifications[index].completion_date = e.target.value;
									setEditedCertifications(newCertifications);
								}}
								className="mb-2"
							/>
							<Input
								value={cert.focus_area}
								onChange={(e) => {
									const newCertifications = [...editedCertifications];
									newCertifications[index].focus_area = e.target.value;
									setEditedCertifications(newCertifications);
								}}
								placeholder="Focus Area"
							/>
						</div>
					))}
					<Button onClick={handleAddCertification}>
						<Plus size={20} className="mr-2" /> Add Certification/Course
					</Button>
				</div>
			) : (
				<div className="space-y-2">
					{user.certificationsCourses.map((cert, index) => (
						<div key={index}>
							<p>
								<strong>{cert.title}</strong> - {cert.institution}
							</p>
							<p>
								Completed: {new Date(cert.completion_date).toLocaleDateString()}
							</p>
							<p>Focus Area: {cert.focus_area}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
