"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Card, CardContent } from "@/app/_components/_ui/Card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import { AlertCircle } from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/app/_components/_ui/Alert";
import { useToast } from "@/app/_components/_hooks/useToast";
import ProfileHeader from "@/app/_components/_shared/_profile/ProfileHeader";
import EditableSection from "@/app/_components/_company/_profile/EditableSection";

export default function CompanyProfileEdit({ company, onSave, onCancel }) {
	const [editedCompany, setEditedCompany] = useState(company);
	const [activeTab, setActiveTab] = useState("about");
	const [error, setError] = useState(null);
	const { toast } = useToast();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditedCompany((prevCompany) => ({ ...prevCompany, [name]: value }));
	};

	const handleSave = async () => {
		try {
			await onSave(editedCompany);
			setError(null);
			toast({
				title: "Profile Updated",
				description: "Your company profile has been successfully updated.",
				duration: 3000,
			});
		} catch (err) {
			setError("Failed to save changes. Please try again.");
			toast({
				title: "Error",
				description: "Failed to update profile. Please try again.",
				variant: "destructive",
				duration: 3000,
			});
		}
	};

	const handleSectionEdit = (section, index, field, value) => {
		setEditedCompany((prevCompany) => {
			const newSection = [...prevCompany[section]];
			newSection[index] = { ...newSection[index], [field]: value };
			return { ...prevCompany, [section]: newSection };
		});
	};

	const handleSectionAdd = (section) => {
		setEditedCompany((prevCompany) => ({
			...prevCompany,
			[section]: [...prevCompany[section], {}],
		}));
	};

	const handleSectionDelete = (section, index) => {
		setEditedCompany((prevCompany) => ({
			...prevCompany,
			[section]: prevCompany[section].filter((_, i) => i !== index),
		}));
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="max-w-4xl mx-auto"
		>
			<Card className="overflow-hidden">
				<ProfileHeader
					profile={editedCompany}
					isEditing={true}
					onSave={handleSave}
					onInputChange={handleInputChange}
				/>
				<CardContent className="p-6">
					{error && (
						<Alert variant="destructive" className="mb-4">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
						<TabsList className="grid w-full grid-cols-6 mb-8">
							<TabsTrigger value="about">About</TabsTrigger>
							<TabsTrigger value="products">Products</TabsTrigger>
							<TabsTrigger value="team">Team</TabsTrigger>
							<TabsTrigger value="financials">Financials</TabsTrigger>
							<TabsTrigger value="activities">Activities</TabsTrigger>
							<TabsTrigger value="files">Files</TabsTrigger>
						</TabsList>
						<TabsContent value="about">
							<EditableSection
								title="About"
								items={[editedCompany]}
								onEdit={(_, field, value) =>
									handleInputChange({ target: { name: field, value } })
								}
								fields={[
									{
										name: "description",
										label: "Description",
										type: "textarea",
									},
									{ name: "industry", label: "Industry", type: "text" },
									{ name: "founded", label: "Founded", type: "date" },
									{
										name: "type",
										label: "Company Type",
										type: "select",
										options: ["Profit", "NonProfit", "Private", "Public"],
									},
									{ name: "hqLocation", label: "Headquarters", type: "text" },
									{
										name: "tier",
										label: "Company Tier",
										type: "select",
										options: ["Hunter", "Holder"],
									},
								]}
							/>
						</TabsContent>
						<TabsContent value="products">
							<EditableSection
								title="Products"
								items={editedCompany.productInformation}
								onAdd={() => handleSectionAdd("productInformation")}
								onDelete={(index) =>
									handleSectionDelete("productInformation", index)
								}
								onEdit={(index, field, value) =>
									handleSectionEdit("productInformation", index, field, value)
								}
								fields={[
									{ name: "product", label: "Product Name", type: "text" },
									{ name: "market", label: "Market", type: "text" },
									{
										name: "partnerships",
										label: "Partnerships",
										type: "array",
									},
								]}
							/>
						</TabsContent>
						<TabsContent value="team">
							<EditableSection
								title="Founders"
								items={editedCompany.founders}
								onAdd={() => handleSectionAdd("founders")}
								onDelete={(index) => handleSectionDelete("founders", index)}
								onEdit={(index, field, value) =>
									handleSectionEdit("founders", index, field, value)
								}
								fields={[
									{ name: "name", label: "Name", type: "text" },
									{ name: "role", label: "Role", type: "text" },
									{
										name: "crunchBaseLink",
										label: "Crunchbase Link",
										type: "url",
									},
								]}
							/>
							<EditableSection
								title="Key Employees"
								items={editedCompany.keyEmployees}
								onAdd={() => handleSectionAdd("keyEmployees")}
								onDelete={(index) => handleSectionDelete("keyEmployees", index)}
								onEdit={(index, field, value) =>
									handleSectionEdit("keyEmployees", index, field, value)
								}
								fields={[
									{ name: "name", label: "Name", type: "text" },
									{ name: "role", label: "Role", type: "text" },
								]}
							/>
							<EditableSection
								title="Board Members"
								items={editedCompany.boardMembers.map((member) => ({
									name: member,
								}))}
								onAdd={() => handleSectionAdd("boardMembers")}
								onDelete={(index) => handleSectionDelete("boardMembers", index)}
								onEdit={(index, field, value) => {
									const newBoardMembers = [...editedCompany.boardMembers];
									newBoardMembers[index] = value;
									setEditedCompany((prev) => ({
										...prev,
										boardMembers: newBoardMembers,
									}));
								}}
								fields={[{ name: "name", label: "Name", type: "text" }]}
							/>
							<EditableSection
								title="Advisors"
								items={editedCompany.advisors.map((advisor) => ({
									name: advisor,
								}))}
								onAdd={() => handleSectionAdd("advisors")}
								onDelete={(index) => handleSectionDelete("advisors", index)}
								onEdit={(index, field, value) => {
									const newAdvisors = [...editedCompany.advisors];
									newAdvisors[index] = value;
									setEditedCompany((prev) => ({
										...prev,
										advisors: newAdvisors,
									}));
								}}
								fields={[{ name: "name", label: "Name", type: "text" }]}
							/>
						</TabsContent>
						<TabsContent value="financials">
							<EditableSection
								title="Financial Information"
								items={[editedCompany.financials]}
								onEdit={(_, field, value) =>
									handleSectionEdit("financials", 0, field, value)
								}
								fields={[
									{ name: "revenue", label: "Revenue", type: "text" },
									{ name: "profit", label: "Profit", type: "text" },
									{ name: "valuation", label: "Valuation", type: "text" },
									{ name: "cash_on_hand", label: "Cash on Hand", type: "text" },
								]}
							/>
							<EditableSection
								title="Fundraising"
								items={editedCompany.raisingFunds}
								onAdd={() => handleSectionAdd("raising_Funds")}
								onDelete={(index) =>
									handleSectionDelete("raising_Funds", index)
								}
								onEdit={(index, field, value) =>
									handleSectionEdit("raising_Funds", index, field, value)
								}
								fields={[
									{ name: "round_name", label: "Round Name", type: "text" },
									{
										name: "target_amount",
										label: "Target Amount",
										type: "text",
									},
									{
										name: "raised_amount",
										label: "Raised Amount",
										type: "text",
									},
									{
										name: "status",
										label: "Status",
										type: "select",
										options: ["Open", "Closed", "In Progress"],
									},
								]}
							/>
						</TabsContent>
						<TabsContent value="activities">
							<EditableSection
								title="Activities"
								items={editedCompany.activities}
								onAdd={() => handleSectionAdd("activities")}
								onDelete={(index) => handleSectionDelete("activities", index)}
								onEdit={(index, field, value) =>
									handleSectionEdit("activities", index, field, value)
								}
								fields={[
									{ name: "title", label: "Title", type: "text" },
									{
										name: "description",
										label: "Description",
										type: "textarea",
									},
								]}
							/>
						</TabsContent>
						<TabsContent value="files">
							<EditableSection
								title="Company Files"
								items={editedCompany.company_file}
								onAdd={() => handleSectionAdd("company_file")}
								onDelete={(index) => handleSectionDelete("company_file", index)}
								onEdit={(index, field, value) =>
									handleSectionEdit("company_file", index, field, value)
								}
								fields={[
									{ name: "fileName", label: "File Name", type: "text" },
									{ name: "filePath", label: "File Path", type: "text" },
									{ name: "fileType", label: "File Type", type: "text" },
								]}
							/>
						</TabsContent>
					</Tabs>
					<div className="mt-6 flex justify-end space-x-2">
						<Button onClick={onCancel} variant="outline">
							Cancel
						</Button>
						<Button onClick={handleSave}>Save Changes</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
