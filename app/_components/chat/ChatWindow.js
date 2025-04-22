"use client";

import { useRef, useEffect } from "react";
import MessageInput from "./MessageInput";

export default function ChatWindow({ chat, messages, userId, onSendMessage }) {
	const messagesEndRef = useRef(null);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!chat) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
				<div className="text-center">
					<p>Select a chat to start messaging</p>
					<p className="text-sm">or create a new one</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<MessageInput onSendMessage={onSendMessage} />
			<div className="p-4 border-b border-gray-200 bg-white">
				<h2 className="font-semibold">{chat.name}</h2>
				<p className="text-sm text-gray-500">
					{chat.isGroupChat
						? `${chat.participants.length} participants`
						: "Direct message"}
				</p>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 bg-gray-50">
				{messages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-500">
						<p>No messages yet. Say hello!</p>
					</div>
				) : (
					<div className="space-y-3">
						{messages.map((message) => (
							<div
								key={message.id}
								className={`max-w-[75%] p-3 rounded-lg ${
									message.senderId === userId
										? "ml-auto bg-blue-500 text-white"
										: "bg-white border border-gray-200"
								}`}
							>
								{/* Sender name (only show in group chats or for others) */}
								{(chat.isGroupChat || message.senderId !== userId) && (
									<div
										className={`text-xs mb-1 ${
											message.senderId === userId
												? "text-blue-200"
												: "text-gray-500"
										}`}
									>
										{message.sender?.username || "User"}
									</div>
								)}

								{/* Message content */}
								<div>{message.content}</div>

								{/* Time */}
								<div
									className={`text-xs mt-1 text-right ${
										message.senderId === userId
											? "text-blue-200"
											: "text-gray-400"
									}`}
								>
									{new Date(message.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Message Input */}
		</>
	);
}
