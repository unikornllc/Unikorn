"use client";
import { useState } from "react";
import { Trash2Icon, XIcon } from "lucide-react";

export default function ChatList({
	chats,
	selectedChatId,
	onSelectChat,
	onDeleteChat,
}) {
	const [confirmDelete, setConfirmDelete] = useState(null);
	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-32 p-4">
				<p className="text-gray-500">No conversations yet</p>
				<p className="text-sm text-gray-400">Start a new chat to connect</p>
			</div>
		);
	}
	const handleDeleteClick = (e, chatId) => {
		e.stopPropagation();
		setConfirmDelete(chatId);
	};

	const handleConfirmDelete = (e, chatId) => {
		e.stopPropagation();
		onDeleteChat(chatId);
		setConfirmDelete(null);
	};

	const handleCancelDelete = (e) => {
		e.stopPropagation();
		setConfirmDelete(null);
	};

	return (
		<div className="overflow-y-auto h-full">
			{chats.map((chat) => {
				const lastMessage =
					chat.messages?.length > 0
						? chat.messages[chat.messages.length - 1]
						: null;
				const isConfirmingDelete = confirmDelete === chat.chatID;

				return (
					<div
						key={chat.chatID}
						onClick={() => onSelectChat(chat)}
						className={`p-4 hover:bg-[#f0f1fe] cursor-pointer border-b border-gray-100 ${
							selectedChatId === chat.chatID ? "bg-[#eef2ff]" : ""
						} relative`}
					>
						<div className="flex justify-between items-start">
							{/* Left: Chat name and last message */}
							<div className="flex flex-col overflow-hidden">
								<div className="font-medium text-gray-800 truncate">
									{chat.name}
								</div>
								{lastMessage ? (
									<div className="text-sm text-gray-500 truncate mt-1">
										{lastMessage.content}
									</div>
								) : (
									<div className="text-sm text-gray-400 mt-1">
										No messages yet
									</div>
								)}
								<div className="text-xs text-gray-400 mt-1">
									{chat.isGroupChat
										? `${chat.participants.length} participants`
										: "Direct message"}
								</div>
							</div>

							{/* Right: Time + Unread Counter vertically stacked */}
							<div className="flex flex-col items-center ml-2">
								{lastMessage && (
									<div className="text-xs text-gray-400">
										{new Date(lastMessage.createdAt).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
								)}
								{chat.unreadCount > 0 && (
									<div className="mt-1 bg-[#6366f1] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
										{chat.unreadCount}
									</div>
								)}
								{!isConfirmingDelete ? (
									<button
										onClick={(e) => handleDeleteClick(e, chat.chatID)}
										className="mt-2 text-gray-400 hover:text-red-500 focus:outline-none"
										title="Clear chat history"
									>
										<Trash2Icon size={16} />
									</button>
								) : (
									<div className="mt-2 flex items-center space-x-2">
										<button
											onClick={(e) => handleConfirmDelete(e, chat.chatID)}
											className="text-red-500 hover:text-red-700 focus:outline-none"
											title="Confirm delete"
										>
											<Trash2Icon size={16} />
										</button>
										<button
											onClick={(e) => handleCancelDelete(e)}
											className="text-gray-500 hover:text-gray-700 focus:outline-none"
											title="Cancel"
										>
											<XIcon size={16} />
										</button>
									</div>
								)}
							</div>
						</div>
						{isConfirmingDelete && (
							<div
								className="absolute inset-0 bg-red-50 bg-opacity-30 flex items-center justify-center"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="bg-white p-2 rounded-md shadow-md text-center">
									<p className="text-sm font-medium text-gray-800">
										Clear chat history?
									</p>
									<div className="flex justify-center mt-2 space-x-2">
										<button
											onClick={(e) => handleConfirmDelete(e, chat.chatID)}
											className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
										>
											Clear
										</button>
										<button
											onClick={(e) => handleCancelDelete(e)}
											className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
