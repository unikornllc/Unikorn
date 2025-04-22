"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Search, User, Loader2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/app/_components/_ui/Dialog";
import { Button } from "@/app/_components/_ui/Button";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/_ui/Select";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/app/_components/_ui/Avatar";
import { useToast } from "@/app/_components/_hooks/useToast";
import DeleteButton from "@/app/_components/_ui/DeleteButton";
import axios from "axios";

export default function PersonnelModal({
	isOpen,
	onClose,
	onSave,
	removePersonnel,
	personnel,
	isEditing,
}) {
	const { toast } = useToast();
	const [formData, setFormData] = useState({
		id: "",
		name: "",
		role: "KeyEmployee",
		crunchBaseLink: "",
		userId: null,
		user: null,
	});

	const [searchTerm, setSearchTerm] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const dropdownRef = useRef(null);
	const observerRef = useRef(null);
	const searchTimeoutRef = useRef(null);

	useEffect(() => {
		if (personnel) {
			setFormData({
				id: personnel.id,
				name: personnel.name,
				role: personnel.role,
				crunchBaseLink: personnel.crunchBaseLink,
				userId: personnel.userId,
				user: personnel.user,
			});
			setSelectedUser(personnel.user);
		} else {
			setFormData({
				id: "",
				name: "",
				role: "KeyEmployee",
				crunchBaseLink: "",
				userId: null,
				user: null,
			});
			setSelectedUser(null);
		}
	}, [personnel, isOpen]);

	const debouncedSearch = useCallback((term) => {
		if (searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current);
		}

		searchTimeoutRef.current = setTimeout(() => {
			setUsers([]);
			setPage(1);
			setHasMore(true);
			fetchUsers(term, 1);
		}, 300);
	}, []);

	const fetchUsers = async (term, pageNum) => {
		if (!term.trim() && pageNum === 1) {
			setUsers([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/searchUsers`,
				{
					params: { term, pageNum, limit: 2 },
					withCredentials: true,
				},
			);
			const data = response.data;
			console.log(data);
			if (pageNum === 1) {
				setUsers(data.users);
			} else {
				setUsers((prevUsers) => [...prevUsers, ...data.users]);
			}

			setHasMore(data.hasMore);
		} catch (err) {
			console.error("Failed to fetch users:", err);
			setError("Failed to load users. Please try again.");
			// toast({
			// 	title: "Error",
			// 	description: "Failed to load users. Please try again.",
			// 	variant: "destructive",
			// });
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (searchTerm.trim()) {
			debouncedSearch(searchTerm);
		} else {
			setUsers([]);
		}

		return () => {
			if (searchTimeoutRef.current) {
				clearTimeout(searchTimeoutRef.current);
			}
		};
	}, [searchTerm, debouncedSearch]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasMore &&
					!isLoading &&
					searchTerm.trim()
				) {
					setPage((prevPage) => prevPage + 1);
				}
			},
			{ threshold: 1.0 },
		);

		if (observerRef.current) {
			observer.observe(observerRef.current);
		}

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current);
			}
		};
	}, [hasMore, isLoading, searchTerm]);

	useEffect(() => {
		if (page > 1 && searchTerm.trim()) {
			fetchUsers(searchTerm, page);
		}
	}, [page]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleUserSelect = (user) => {
		setSelectedUser(user);
		if (user) {
			setFormData({
				...formData,
				name: formData.name || user.name,
				userId: user.id,
				user: user,
			});
		} else {
			setFormData({
				...formData,
				userId: null,
				user: null,
			});
		}
		setShowDropdown(false);
		setSearchTerm("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave(formData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Personnel" : "Add Personnel"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 py-4">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								placeholder="Enter personnel name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="role">Role</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Founder">Founder</SelectItem>
									<SelectItem value="KeyEmployee">Key Employee</SelectItem>
									<SelectItem value="BoardMember">Board Member</SelectItem>
									<SelectItem value="Advisor">Advisor</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="crunchBaseLink">CrunchBase Link</Label>
							<Input
								id="crunchBaseLink"
								placeholder="https://www.crunchbase.com/person/..."
								value={formData.crunchBaseLink}
								onChange={(e) =>
									setFormData({ ...formData, crunchBaseLink: e.target.value })
								}
								// required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="userSearch">
								Link to Unikorn User (Optional)
							</Label>
							<div className="relative" ref={dropdownRef}>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
										<Search className="h-4 w-4 text-gray-400" />
									</div>

									<Input
										id="userSearch"
										className="pl-10 pr-10"
										placeholder="Search by name or username"
										value={searchTerm}
										onChange={(e) => {
											setSearchTerm(e.target.value);
											setShowDropdown(true);
										}}
										onFocus={() => setShowDropdown(true)}
									/>

									{selectedUser && (
										<button
											type="button"
											className="absolute inset-y-0 right-0 flex items-center pr-3"
											onClick={() => {
												setSelectedUser(null);
												setFormData({ ...formData, userId: null, user: null });
											}}
										>
											<X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
										</button>
									)}
								</div>

								{showDropdown && (
									<div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
										<div className="py-1">
											<button
												type="button"
												className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
												onClick={() => handleUserSelect(null)}
											>
												<div className="flex items-center">
													<div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
														<User className="h-4 w-4 text-gray-500" />
													</div>
													<div className="ml-3">
														<p className="font-medium">None</p>
														<p className="text-xs text-gray-500">
															No user association
														</p>
													</div>
												</div>
											</button>

											{users.map((user) => (
												<button
													key={user.id}
													type="button"
													className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
													onClick={() => handleUserSelect(user)}
												>
													<div className="flex items-center">
														<Avatar className="h-8 w-8">
															<AvatarImage
																src={
																	user.avatar ||
																	"/placeholder.svg?height=40&width=40"
																}
																alt={user.name}
															/>
															<AvatarFallback>
																{user.name.charAt(0)}
															</AvatarFallback>
														</Avatar>
														<div className="ml-3">
															<p className="font-medium">{user.name}</p>
															<p className="text-xs text-gray-500">
																@{user.account.username}
															</p>
														</div>
													</div>
												</button>
											))}

											{users.length === 0 &&
												!isLoading &&
												searchTerm.trim() && (
													<div className="px-4 py-2 text-sm text-gray-500">
														No users found
													</div>
												)}

											{isLoading && (
												<div className="flex justify-center items-center py-2">
													<Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
												</div>
											)}

											{error && (
												<div className="px-4 py-2">
													<p className="text-sm text-red-500">{error}</p>
												</div>
											)}

											{hasMore && !isLoading && users.length > 0 && (
												<div ref={observerRef} className="h-4" />
											)}
										</div>
									</div>
								)}
							</div>

							{selectedUser && (
								<div className="mt-2 flex items-center p-2 bg-gray-50 rounded-md">
									<Avatar className="h-8 w-8">
										<AvatarImage
											src={
												selectedUser.avatar ||
												"/placeholder.svg?height=40&width=40"
											}
											alt={selectedUser.name}
										/>
										<AvatarFallback>
											{selectedUser.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="ml-3">
										<p className="text-sm font-medium">{selectedUser.name}</p>
										<p className="text-xs text-gray-500">
											@{selectedUser.account.username}
										</p>
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						{isEditing && (
							<DeleteButton
								onDelete={() => removePersonnel(formData.id)}
								itemType="Personnel"
								size="small"
								className="ml-2"
							/>
						)}
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit">
							{isEditing ? "Update" : "Add"} Personnel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
