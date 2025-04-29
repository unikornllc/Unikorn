"use client";

import { useRef, useEffect } from "react";
import MessageInput from "./MessageInput";

export default function ChatWindow({ chat, messages, userId, onSendMessage }) {
	const messagesEndRef = useRef(null);

	useEffect(() => {
		if (!messagesEndRef.current) return;
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!chat) {
		return (
			<div className="flex-1 flex items-center justify-center bg-[#f8f9fe] text-gray-500">
				<div className="text-center">
					<p>Select a chat to start messaging</p>
					<p className="text-sm">or create a new one</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Chat Header */}
			<div className="p-4 border-b border-gray-100 bg-white">
				<h2 className="font-semibold text-[#6366f1]">{chat.name}</h2>
				<p className="text-sm text-gray-500">
					{chat.isGroupChat
						? `${chat.participants.length} participants`
						: "Direct message"}
				</p>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 bg-[#f8f9fe] space-y-3">
				{messages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-gray-500">
						<p>No messages yet. Say hello!</p>
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mb-2`}
						>
							<div
								className={`inline-block ${
									message.senderId === userId
										? "bg-[#6366f1] text-white rounded-lg rounded-tr-none shadow-sm border"
										: "bg-gray-200 text-black rounded-lg rounded-tl-none shadow-sm border border-gray-300"
								} px-4 py-2 max-w-xs`}
							>
								<div>{message.content}</div>
								<div className="text-[10px] text-right mt-1 opacity-70">
									{new Date(message.createdAt).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</div>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Message Input */}
			<div className="p-4 border-t border-gray-200 bg-white">
				<MessageInput onSendMessage={onSendMessage} />
			</div>
		</div>
	);
}
