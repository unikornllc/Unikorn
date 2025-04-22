"use client";

import { useState } from "react";

export default function NewChatModal({ users, userId, onClose, onCreateChat }) {
	const [isGroupChat, setIsGroupChat] = useState(false);
	const [groupName, setGroupName] = useState("");
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	const handleCreateChat = () => {
		if (isGroupChat && !groupName.trim()) {
			alert("Please enter a group name");
			return;
		}

		if (selectedUsers.length === 0) {
			alert("Please select at least one user");
			return;
		}

		if (!isGroupChat && selectedUsers.length > 1) {
			alert("Please select only one user for direct chat");
			return;
		}

		onCreateChat({
			participants: selectedUsers,
			isGroupChat,
			name: isGroupChat ? groupName : undefined,
		});
		onClose();
	};

	const selectUser = (user) => {
		setSelectedUsers((prev) => [...prev, user]);
		setSearchTerm("");
	};

	const removeUser = (userID) => {
		setSelectedUsers((prev) => prev.filter((user) => user !== userID));
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-md">
				<div className="p-4 border-b border-gray-200">
					<h2 className="text-lg font-semibold">Create New Chat</h2>
				</div>

				<div className="p-4">
					<div className="mb-4">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={isGroupChat}
								onChange={() => setIsGroupChat(!isGroupChat)}
								className="mr-2"
							/>
							<span>Create Group Chat</span>
						</label>
					</div>

					{isGroupChat && (
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Group Name
							</label>
							<input
								type="text"
								value={groupName}
								onChange={(e) => setGroupName(e.target.value)}
								placeholder="Enter group name"
								className="w-full p-2 border border-gray-300 rounded"
							/>
						</div>
					)}

					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							{isGroupChat ? "Add Participants" : "Select User"}
						</label>

						{/* Selected users */}
						{selectedUsers.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-2">
								{selectedUsers.map((user) => (
									<div
										key={user}
										className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center text-sm"
									>
										<span>{user}</span>
										<button
											onClick={() => removeUser(user)}
											className="ml-1 text-blue-500 hover:text-blue-700"
										>
											×
										</button>
									</div>
								))}
							</div>
						)}

						{/* Search input */}
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder="Search users..."
							className="w-full p-2 border border-gray-300 rounded"
						/>
					</div>

					{/* User list */}
					<div className="max-h-60 overflow-y-auto border border-gray-200 rounded">
						{users.length === 0 ? (
							<div className="p-3 text-center text-gray-500">
								{searchTerm ? "No users found" : "No users available"}
							</div>
						) : (
							<ul className="divide-y divide-gray-200">
								{users.map((user) => (
									<li
										key={user}
										onClick={() => selectUser(user)}
										className="p-3 hover:bg-gray-50 cursor-pointer"
									>
										<div className="font-medium">{user}</div>
										<div className="text-sm text-gray-500">{user}</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
					<button
						onClick={onClose}
						className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={handleCreateChat}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						disabled={
							selectedUsers.length === 0 || (isGroupChat && !groupName.trim())
						}
					>
						Create
					</button>
				</div>
			</div>
		</div>
	);
}
