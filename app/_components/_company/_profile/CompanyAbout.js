"use client";

import { useState } from "react";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Textarea } from "@/app/_components/_ui/Textarea";

export default function CompanyAbout({ company, isOwnProfile }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedAbout, setEditedAbout] = useState({
		description: company.description,
		website: company.website,
		founded: company.founded,
		type: company.type,
		hqLocation: company.hqLocation,
		industry: company.industry,
	});

	const handleSave = async () => {
		// In a real app, send a PUT request to update the company data
		// await fetch(`/api/company/${company.id}/about`, { method: 'PUT', body: JSON.stringify(editedAbout) })
		setIsEditing(false);
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-2xl font-bold">About</h2>
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
					<Textarea
						value={editedAbout.description}
						onChange={(e) =>
							setEditedAbout({ ...editedAbout, description: e.target.value })
						}
						placeholder="Company description"
					/>
					<Input
						value={editedAbout.website}
						onChange={(e) =>
							setEditedAbout({ ...editedAbout, website: e.target.value })
						}
						placeholder="Website"
					/>
					<Input
						type="date"
						value={editedAbout.founded}
						onChange={(e) =>
							setEditedAbout({ ...editedAbout, founded: e.target.value })
						}
					/>
					<Input
						value={editedAbout.type}
						onChange={(e) =>
							setEditedAbout({ ...editedAbout, type: e.target.value })
						}
						placeholder="Company type"
					/>
					<Input
						value={editedAbout.hqLocation}
						onChange={(e) =>
							setEditedAbout({ ...editedAbout, hqLocation: e.target.value })
						}
						placeholder="HQ Location"
					/>
					<Input
						value={editedAbout.industry}
						onChange={(e) =>
							setEditedAbout({ ...editedAbout, industry: e.target.value })
						}
						placeholder="Industry"
					/>
				</div>
			) : (
				<div className="space-y-2">
					<p>{company.description}</p>
					<p>
						<strong>Website:</strong>{" "}
						<a
							href={company.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:underline"
						>
							{company.website}
						</a>
					</p>
					<p>
						<strong>Founded:</strong>{" "}
						{new Date(company.founded).toLocaleDateString()}
					</p>
					<p>
						<strong>Type:</strong> {company.type}
					</p>
					<p>
						<strong>HQ Location:</strong> {company.hqLocation}
					</p>
					<p>
						<strong>Industry:</strong> {company.industry}
					</p>
				</div>
			)}
		</div>
	);
}
