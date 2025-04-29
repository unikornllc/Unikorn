"use client";

export default function ChatList({ chats, selectedChatId, onSelectChat }) {
	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-32 p-4">
				<p className="text-gray-500">No conversations yet</p>
				<p className="text-sm text-gray-400">Start a new chat to connect</p>
			</div>
		);
	}

	return (
		<div className="overflow-y-auto h-full">
			{chats.map((chat) => {
				const lastMessage =
					chat.messages?.length > 0
						? chat.messages[chat.messages.length - 1]
						: null;

				return (
					<div
						key={chat.chatID}
						onClick={() => onSelectChat(chat)}
						className={`p-4 hover:bg-[#f0f1fe] cursor-pointer border-b border-gray-100 ${
							selectedChatId === chat.chatID ? "bg-[#eef2ff]" : ""
						}`}
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
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
