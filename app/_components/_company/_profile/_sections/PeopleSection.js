"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/app/_components/_ui/Tabs";
import { Button } from "@/app/_components/_ui/Button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import { Label } from "@/app/_components/_ui/Label";
import { Input } from "@/app/_components/_ui/Input";
import { Plus, Edit, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";

export default function PeopleSection({ company, isOwner, updateCompany }) {
	const [activeTab, setActiveTab] = useState("leadership");
	const [isAddingPerson, setIsAddingPerson] = useState(false);
	const [isEditingPerson, setIsEditingPerson] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState(null);

	// Mock data for employees
	const [employees, setEmployees] = useState([
		{
			id: "1",
			name: "Jane Smith",
			role: "Software Engineer",
			avatar: "/placeholder.svg",
		},
		{
			id: "2",
			name: "John Doe",
			role: "Product Manager",
			avatar: "/placeholder.svg",
		},
		{
			id: "3",
			name: "Emily Johnson",
			role: "UX Designer",
			avatar: "/placeholder.svg",
		},
		{
			id: "4",
			name: "Michael Brown",
			role: "Marketing Specialist",
			avatar: "/placeholder.svg",
		},
	]);

	// Mock data for investors
	const [investors, setInvestors] = useState([
		{
			id: "1",
			name: "Sequoia Capital",
			role: "Lead Investor",
			avatar: "/placeholder.svg",
		},
		{
			id: "2",
			name: "Andreessen Horowitz",
			role: "Investor",
			avatar: "/placeholder.svg",
		},
		{
			id: "3",
			name: "Y Combinator",
			role: "Accelerator",
			avatar: "/placeholder.svg",
		},
	]);

	const [newPerson, setNewPerson] = useState({
		name: "",
		role: "Founder",
		crunchBaseLink: "",
	});

	const [editPerson, setEditPerson] = useState({
		id: "",
		name: "",
		role: "",
		crunchBaseLink: "",
	});

	const handleAddPerson = () => {
		if (!newPerson.name) return;

		const person = {
			id: Date.now().toString(),
			name: newPerson.name,
			role: newPerson.role,
			crunchBaseLink: newPerson.crunchBaseLink,
			companyId: company.id,
		};

		const updatedPersonnel = [...(company.personnel || []), person];
		updateCompany({ personnel: updatedPersonnel });
		setNewPerson({ name: "", role: "Founder", crunchBaseLink: "" });
		setIsAddingPerson(false);
	};

	const handleEditPerson = (person) => {
		setEditPerson({
			id: person.id,
			name: person.name,
			role: person.role,
			crunchBaseLink: person.crunchBaseLink || "",
		});
		setSelectedPerson(person);
		setIsEditingPerson(true);
	};

	const handleSaveEditPerson = () => {
		if (!editPerson.name) return;

		const updatedPerson = {
			id: editPerson.id,
			name: editPerson.name,
			role: editPerson.role,
			crunchBaseLink: editPerson.crunchBaseLink,
			companyId: company.id,
		};

		const updatedPersonnel = company.personnel.map((p) =>
			p.id === updatedPerson.id ? updatedPerson : p,
		);

		updateCompany({ personnel: updatedPersonnel });
		setIsEditingPerson(false);
	};

	const handleDeletePerson = (id) => {
		const updatedPersonnel = company.personnel.filter((p) => p.id !== id);
		updateCompany({ personnel: updatedPersonnel });
	};

	const handleAddEmployee = () => {
		// In a real app, this would open a dialog to add an employee
		const newEmployee = {
			id: Date.now().toString(),
			name: "New Employee",
			role: "Role",
			avatar: "/placeholder.svg",
		};

		setEmployees([...employees, newEmployee]);
	};

	const handleAddInvestor = () => {
		// In a real app, this would open a dialog to add an investor
		const newInvestor = {
			id: Date.now().toString(),
			name: "New Investor",
			role: "Investor",
			avatar: "/placeholder.svg",
		};

		setInvestors([...investors, newInvestor]);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>People</CardTitle>
						<CardDescription>
							Leadership, employees, and investors
						</CardDescription>
					</div>
					{isOwner && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsAddingPerson(true)}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Person
						</Button>
					)}
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<h3 className="text-2xl font-bold text-purple-600">
										{company.personnel?.length || 0}
									</h3>
									<p className="text-sm text-gray-500 mt-1">Leadership Team</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<h3 className="text-2xl font-bold text-purple-600">
										{employees.length}
									</h3>
									<p className="text-sm text-gray-500 mt-1">Employees</p>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<h3 className="text-2xl font-bold text-purple-600">
										{investors.length}
									</h3>
									<p className="text-sm text-gray-500 mt-1">Investors</p>
								</div>
							</CardContent>
						</Card>
					</div>

					<Tabs
						defaultValue="leadership"
						value={activeTab}
						onValueChange={setActiveTab}
					>
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="leadership">Leadership</TabsTrigger>
							<TabsTrigger value="employees">Employees</TabsTrigger>
							<TabsTrigger value="investors">Investors</TabsTrigger>
						</TabsList>

						<TabsContent value="leadership" className="pt-6">
							{company.personnel && company.personnel.length > 0 ? (
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{company.personnel.map((person) => (
										<Card key={person.id}>
											<CardContent className="p-6">
												<div className="flex items-center gap-4">
													<Avatar className="h-16 w-16">
														<AvatarImage
															src="/placeholder.svg"
															alt={person.name}
														/>
														<AvatarFallback>
															{person.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div className="flex-1">
														<h3 className="font-medium text-lg">
															{person.name}
														</h3>
														<p className="text-sm text-gray-500">
															{person.role}
														</p>
														{person.crunchBaseLink && (
															<Link
																href={person.crunchBaseLink}
																target="_blank"
																className="text-xs text-blue-600 hover:underline flex items-center mt-1"
															>
																View on CrunchBase
																<ExternalLink className="h-3 w-3 ml-1" />
															</Link>
														)}
													</div>
													{isOwner && (
														<div className="flex flex-col gap-2">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => handleEditPerson(person)}
															>
																<Edit className="h-4 w-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
																onClick={() => handleDeletePerson(person.id)}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													)}
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							) : (
								<div className="text-center py-8 text-gray-500">
									<p>No leadership team members added yet</p>
									{isOwner && (
										<Button
											variant="outline"
											className="mt-4"
											onClick={() => setIsAddingPerson(true)}
										>
											<Plus className="h-4 w-4 mr-2" />
											Add Team Member
										</Button>
									)}
								</div>
							)}
						</TabsContent>

						<TabsContent value="employees" className="pt-6">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-medium">Company Employees</h3>
								{isOwner && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleAddEmployee}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Employee
									</Button>
								)}
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{employees.map((employee) => (
									<Card key={employee.id}>
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<Avatar className="h-12 w-12">
													<AvatarImage
														src={employee.avatar || "/placeholder.svg"}
														alt={employee.name}
													/>
													<AvatarFallback>
														{employee.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<h3 className="font-medium">{employee.name}</h3>
													<p className="text-sm text-gray-500">
														{employee.role}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>

						<TabsContent value="investors" className="pt-6">
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-medium">Company Investors</h3>
								{isOwner && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleAddInvestor}
									>
										<Plus className="h-4 w-4 mr-2" />
										Add Investor
									</Button>
								)}
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{investors.map((investor) => (
									<Card key={investor.id}>
										<CardContent className="p-6">
											<div className="flex items-center gap-4">
												<Avatar className="h-12 w-12">
													<AvatarImage
														src={investor.avatar || "/placeholder.svg"}
														alt={investor.name}
													/>
													<AvatarFallback>
														{investor.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div>
													<h3 className="font-medium">{investor.name}</h3>
													<p className="text-sm text-gray-500">
														{investor.role}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Add Person Dialog */}
			<Dialog open={isAddingPerson} onOpenChange={setIsAddingPerson}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Team Member</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="person-name" className="text-right">
								Name
							</Label>
							<Input
								id="person-name"
								value={newPerson.name}
								onChange={(e) =>
									setNewPerson({ ...newPerson, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="person-role" className="text-right">
								Role
							</Label>
							<select
								id="person-role"
								value={newPerson.role}
								onChange={(e) =>
									setNewPerson({ ...newPerson, role: e.target.value })
								}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Founder">Founder</option>
								<option value="Advisor">Advisor</option>
								<option value="BoardMember">Board Member</option>
								<option value="KeyEmployee">Key Employee</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="person-crunchbase" className="text-right">
								CrunchBase Link
							</Label>
							<Input
								id="person-crunchbase"
								value={newPerson.crunchBaseLink}
								onChange={(e) =>
									setNewPerson({ ...newPerson, crunchBaseLink: e.target.value })
								}
								placeholder="https://crunchbase.com/person/name"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddingPerson(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddPerson}>Add Person</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Person Dialog */}
			<Dialog open={isEditingPerson} onOpenChange={setIsEditingPerson}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Team Member</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-person-name" className="text-right">
								Name
							</Label>
							<Input
								id="edit-person-name"
								value={editPerson.name}
								onChange={(e) =>
									setEditPerson({ ...editPerson, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-person-role" className="text-right">
								Role
							</Label>
							<select
								id="edit-person-role"
								value={editPerson.role}
								onChange={(e) =>
									setEditPerson({ ...editPerson, role: e.target.value })
								}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Founder">Founder</option>
								<option value="Advisor">Advisor</option>
								<option value="BoardMember">Board Member</option>
								<option value="KeyEmployee">Key Employee</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="edit-person-crunchbase" className="text-right">
								CrunchBase Link
							</Label>
							<Input
								id="edit-person-crunchbase"
								value={editPerson.crunchBaseLink}
								onChange={(e) =>
									setEditPerson({
										...editPerson,
										crunchBaseLink: e.target.value,
									})
								}
								placeholder="https://crunchbase.com/person/name"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditingPerson(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveEditPerson}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
