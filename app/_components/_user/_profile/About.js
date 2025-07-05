"use client";

import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { User, FileText } from "lucide-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Textarea } from "@/app/_components/_ui/Textarea";
import axios from "axios";
import { useToast } from "@/app/_components/_hooks/useToast";

const About = ({ username, aboutList, editable }) => {
	const [about, setAbout] = useState(aboutList);
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const maxCharacters = 600;
	const { toast } = useToast();

	const handleSave = async () => {
		if (!about.description.trim()) {
			toast({
				title: "Error",
				description: "Description cannot be empty",
				variant: "destructive",
			});
			return;
		}

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
				description: "Description updated successfully",
				variant: "success",
			});
			setEditing(false);
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
	};

	const handleCancel = () => {
		setAbout(aboutList);
		setEditing(false);
	};

	const isEmpty = !about.description || about.description.trim() === "";

	return (
		<Card className="shadow-sm hover:shadow-md transition-shadow">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-xl">
						<User className="h-5 w-5 text-blue-500" />
						About
					</CardTitle>
					{editable && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setEditing(!editing)}
							className="h-8 w-8 p-0"
						>
							<PencilIcon className="w-4 h-4" />
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent>
				{editable && editing ? (
					<div className="space-y-4">
						<div>
							<Textarea
								value={about.description}
								onChange={(e) =>
									setAbout({
										...about,
										description: e.target.value.slice(0, maxCharacters),
									})
								}
								rows={6}
								className="resize-none"
								placeholder="Tell others about yourself, your background, interests, and what makes you unique..."
							/>
							<div className="flex justify-between items-center mt-2">
								<p className="text-sm text-gray-500">
									{about.description.length}/{maxCharacters} characters
								</p>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleCancel}
										disabled={loading}
									>
										Cancel
									</Button>
									<Button size="sm" onClick={handleSave} disabled={loading}>
										{loading ? "Saving..." : "Save"}
									</Button>
								</div>
							</div>
						</div>
					</div>
				) : (
					<div>
						{isEmpty ? (
							<div className="text-center py-8">
								<FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">
									No description yet
								</h3>
								<p className="text-gray-500 mb-4">
									{editable
										? "Add a description to tell others about yourself"
										: "This user hasn't added a description yet"}
								</p>
								{editable && (
									<Button onClick={() => setEditing(true)}>
										Add Description
									</Button>
								)}
							</div>
						) : (
							<div className="prose prose-gray max-w-none">
								<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
									{about.description}
								</p>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default About;
