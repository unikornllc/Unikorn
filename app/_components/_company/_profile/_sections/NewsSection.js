"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import { Plus, Edit, Award, Newspaper, Calendar, Trash2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogTrigger,
} from "@/app/_components/_ui/Dialog";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { formatDate } from "@/app/_utils/utils";

import { updateCompany } from "@/app/_utils/_api/companyAPIs";

export default function NewsSection({ company, isOwner }) {
	const [activities, setActivities] = useState(company.activities || []);
	const [isAddingActivity, setIsAddingActivity] = useState(false);
	const [isEditingActivity, setIsEditingActivity] = useState(false);
	const [selectedActivity, setSelectedActivity] = useState(null);
	const [newActivity, setNewActivity] = useState({
		title: "",
		description: "",
	});
	const [editActivity, setEditActivity] = useState({
		id: "",
		title: "",
		description: "",
	});

	const handleAddActivity = async () => {
		if (!newActivity.title || !newActivity.description) return;

		const activity = {
			id: Date.now().toString(),
			title: newActivity.title,
			description: newActivity.description,
			companyId: company.id,
			date: new Date(),
		};

		const updatedActivities = [activity, ...activities];
		setActivities(updatedActivities);
		await updateCompany({ activities: updatedActivities });
		setNewActivity({ title: "", description: "" });
		setIsAddingActivity(false);
	};

	const handleEditActivity = (activity) => {
		setEditActivity({
			id: activity.id,
			title: activity.title,
			description: activity.description,
		});
		setSelectedActivity(activity);
		setIsEditingActivity(true);
	};

	const handleSaveEditActivity = async () => {
		if (!editActivity.title || !editActivity.description) return;

		const updatedActivity = {
			...selectedActivity,
			title: editActivity.title,
			description: editActivity.description,
		};

		const updatedActivities = activities.map((activity) =>
			activity.id === updatedActivity.id ? updatedActivity : activity,
		);

		setActivities(updatedActivities);
		await updateCompany({ activities: updatedActivities });
		setIsEditingActivity(false);
	};

	const handleDeleteActivity = async (id) => {
		const updatedActivities = activities.filter(
			(activity) => activity.id !== id,
		);
		setActivities(updatedActivities);
		await updateCompany({ activities: updatedActivities });
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>News & Activities</CardTitle>
						<CardDescription>
							Latest updates from {company.name}
						</CardDescription>
					</div>
					{isOwner && (
						<Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm">
									<Plus className="h-4 w-4 mr-2" />
									Add Activity
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Activity</DialogTitle>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="title">Title</Label>
										<Input
											id="title"
											value={newActivity.title}
											onChange={(e) =>
												setNewActivity({
													...newActivity,
													title: e.target.value,
												})
											}
											placeholder="Activity title"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="description">Description</Label>
										<Textarea
											id="description"
											value={newActivity.description}
											onChange={(e) =>
												setNewActivity({
													...newActivity,
													description: e.target.value,
												})
											}
											placeholder="Activity description"
											className="min-h-[100px]"
										/>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setIsAddingActivity(false)}
									>
										Cancel
									</Button>
									<Button onClick={handleAddActivity}>Add Activity</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					)}
				</CardHeader>
				<CardContent>
					<div className="space-y-8">
						{activities.length > 0 ? (
							activities.map((activity) => (
								<div key={activity.id} className="flex gap-4">
									<div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
										<Award className="h-6 w-6" />
									</div>
									<div className="space-y-2 flex-1">
										<h3 className="font-medium text-lg">{activity.title}</h3>
										<p className="text-gray-600">{activity.description}</p>
										<div className="flex items-center text-sm text-gray-500">
											<Calendar className="h-4 w-4 mr-1" />
											<span>{formatDate(activity.date || new Date())}</span>
										</div>
										{isOwner && (
											<div className="flex gap-2 pt-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEditActivity(activity)}
												>
													<Edit className="h-3.5 w-3.5 mr-1" />
													Edit
												</Button>
												<Button
													variant="outline"
													size="sm"
													className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
													onClick={() => handleDeleteActivity(activity.id)}
												>
													<Trash2 className="h-3.5 w-3.5 mr-1" />
													Delete
												</Button>
											</div>
										)}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-12 text-gray-500">
								<Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-400" />
								<p className="text-lg font-medium mb-2">
									No news or activities yet
								</p>
								<p className="mb-6">
									Stay tuned for updates from {company.name}
								</p>
								{isOwner && (
									<Button
										variant="outline"
										onClick={() => setIsAddingActivity(true)}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Your First Activity
									</Button>
								)}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Edit Activity Dialog */}
			<Dialog open={isEditingActivity} onOpenChange={setIsEditingActivity}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Activity</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="edit-title">Title</Label>
							<Input
								id="edit-title"
								value={editActivity.title}
								onChange={(e) =>
									setEditActivity({ ...editActivity, title: e.target.value })
								}
								placeholder="Activity title"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-description">Description</Label>
							<Textarea
								id="edit-description"
								value={editActivity.description}
								onChange={(e) =>
									setEditActivity({
										...editActivity,
										description: e.target.value,
									})
								}
								placeholder="Activity description"
								className="min-h-[100px]"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditingActivity(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveEditActivity}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
