"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/app/_components/_hooks/useToast";
import PersonnelGrid from "../../_company_profile/PersonnelGrid";
import PersonnelModal from "./PersonnelModal";
import axios from "axios";

export default function PersonnelDashboard({ personnelData = [] }) {
	const { toast } = useToast();
	const [personnel, setPersonnel] = useState(personnelData);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentPersonnel, setCurrentPersonnel] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	const handleAddPersonnel = () => {
		setCurrentPersonnel(null);
		setIsEditing(false);
		setIsModalOpen(true);
	};

	const handleEditPersonnel = (person) => {
		setCurrentPersonnel(person);
		setIsEditing(true);
		setIsModalOpen(true);
	};

	const removePersonnel = async (personnelId) => {
		try {
			setIsLoading(true);
			await axios.delete(
				`${process.env.NEXT_PUBLIC_SERVER}/api/deletePersonnel`,
				{
					params: { personnelId },
					withCredentials: true,
				},
			);
			setPersonnel(personnel.filter((person) => person.id !== personnelId));
		} catch (error) {
			console.error("Error removing personnel:", error);
		} finally {
			setIsLoading(false);
		}
	};
	const handleSavePersonnel = async (formData) => {
		try {
			setIsLoading(true);
			if (isEditing) {
				await axios
					.put(
						`${process.env.NEXT_PUBLIC_SERVER}/api/updatePersonnel`,
						{ formData },
						{
							withCredentials: true,
						},
					)
					.then((res) => {
						setPersonnel(
							personnel.map((p) => (p.id === formData.id ? formData : p)),
						);
						// toast({
						// 	title: "Success",
						// 	description: "Personnel updated successfully",
						// });
					});
			} else {
				await axios
					.put(
						`${process.env.NEXT_PUBLIC_SERVER}/api/updatePersonnel`,
						{ formData },
						{
							withCredentials: true,
						},
					)
					.then((res) => {
						setPersonnel([...personnel, res.data.personnel]);
						// toast({
						// 	title: "Success",
						// 	description: "Personnel added successfully",
						// });
					});
			}
			setIsModalOpen(false);
		} catch (err) {
			console.error("Failed to save personnel:", err);
			// toast({
			// 	title: "Error",
			// 	description: `Failed to ${isEditing ? "update" : "add"} personnel. Please try again.`,
			// 	variant: "destructive",
			// });
			setIsModalOpen(false);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading && personnel.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
				<p className="text-muted-foreground">Loading personnel...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-10">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold mb-6">Company Personnel</h1>
				<button
					onClick={handleAddPersonnel}
					className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors"
					aria-label="Add personnel"
				>
					<Plus className="h-5 w-5" />
				</button>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
					{error}
				</div>
			)}

			{!isLoading && personnel.length === 0 ? (
				<div className="text-center py-16 px-4 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
					<div className="flex flex-col items-center">
						<div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-primary"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
								<circle cx="9" cy="7" r="4"></circle>
								<path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
								<path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
							</svg>
						</div>
						<h3 className="text-lg font-medium mb-2">No Personnel Added Yet</h3>
						<p className="text-gray-500 mb-6 max-w-md">
							Start building your company profile by adding key team members,
							founders, advisors, and board members.
						</p>
						<button
							onClick={handleAddPersonnel}
							className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
						>
							<Plus className="h-5 w-5 mr-2" />
							Add Your First Team Member
						</button>
					</div>
				</div>
			) : (
				<PersonnelGrid personnel={personnel} onEdit={handleEditPersonnel} />
			)}

			<PersonnelModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={handleSavePersonnel}
				removePersonnel={removePersonnel}
				personnel={currentPersonnel}
				isEditing={isEditing}
			/>
		</div>
	);
}
