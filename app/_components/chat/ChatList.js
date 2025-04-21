"use client";

export default function ChatList({ chats, selectedChatId, onSelectChat }) {
	if (chats.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64 p-4">
				<p className="text-gray-500">No chats yet</p>
				<p className="text-sm text-gray-400">
					Create a new chat to get started
				</p>
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
						className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
							selectedChatId === chat.chatID ? "bg-blue-50" : ""
						}`}
					>
						<div className="flex justify-between items-start">
							<div className="font-medium truncate">{chat.name}</div>
							{lastMessage && (
								<div className="text-xs text-gray-400">
									{new Date(lastMessage.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							)}
						</div>

						{lastMessage ? (
							<div className="text-sm text-gray-500 truncate mt-1">
								{lastMessage.content}
							</div>
						) : (
							<div className="text-sm text-gray-400 mt-1">No messages yet</div>
						)}

						<div className="text-xs text-gray-400 mt-1">
							{chat.isGroupChat
								? `${chat.participants.length} participants`
								: "Direct message"}
						</div>
					</div>
				);
			})}
		</div>
	);
}
