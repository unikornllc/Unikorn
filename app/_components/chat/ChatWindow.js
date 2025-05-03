"use client";

import { useRef, useEffect, useState } from "react";
import MessageInput from "./MessageInput";
import axios from "axios";

export default function ChatWindow({
	chat,
	messages,
	userId,
	username,
	onSendMessage,
}) {
	const messagesEndRef = useRef(null);
	const [loadingAttachments, setLoadingAttachments] = useState({});
	const [attachmentCache, setAttachmentCache] = useState({});

	useEffect(() => {
		if (!messagesEndRef.current) return;
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const renderAttachment = (attachment) => {
		if (!attachment) return null;

		// Loading state for attachments that need to be fetched
		const isLoading = loadingAttachments[attachment.url];
		const cachedAttachment = attachmentCache[attachment.url];

		// For attachments that use the file API
		const fetchAndRenderAttachment = async (attachment) => {
			if (isLoading) return; // Prevent multiple fetches
			if (cachedAttachment) return; // Use cached version if available

			try {
				setLoadingAttachments((prev) => ({ ...prev, [attachment.url]: true }));

				// Extract username and fileName from URL
				const url = new URL(attachment.url);
				const params = new URLSearchParams(url.search);
				const username = params.get("username");
				const fileName = params.get("fileName");

				if (!username || !fileName) throw new Error("Invalid attachment URL");

				// Fetch the file content using axios
				const response = await axios.get(attachment.url, {
					withCredentials: true,
				});

				if (!response.data) throw new Error("Failed to fetch attachment");

				const data = response.data;

				// Create object URL from base64 data
				const binaryString = atob(data.fileContent);
				const bytes = new Uint8Array(binaryString.length);
				for (let i = 0; i < binaryString.length; i++) {
					bytes[i] = binaryString.charCodeAt(i);
				}

				const blob = new Blob([bytes], {
					type: attachment.mimeType || data.fileType,
				});
				const objectUrl = URL.createObjectURL(blob);

				// Cache the attachment data
				const cachedData = {
					objectUrl,
					originalName: attachment.originalName || fileName,
					type: attachment.mimeType || data.fileType,
				};

				setAttachmentCache((prev) => ({
					...prev,
					[attachment.url]: cachedData,
				}));

				setLoadingAttachments((prev) => ({ ...prev, [attachment.url]: false }));
			} catch (error) {
				console.error("Error fetching attachment:", error);
				setLoadingAttachments((prev) => ({ ...prev, [attachment.url]: false }));
			}
		};

		// If we don't have a cached version and not already loading, fetch it
		if (!cachedAttachment && !isLoading) {
			fetchAndRenderAttachment(attachment);
		}

		if (isLoading) {
			return (
				<div className="mt-2 p-3 bg-gray-100 rounded-md text-gray-500 flex items-center justify-center">
					<svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
							fill="none"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Loading attachment...
				</div>
			);
		}

		// Render based on attachment type from the database
		if (attachment.type === "IMAGE" && cachedAttachment) {
			return (
				<div className="mt-2">
					<img
						src={cachedAttachment.objectUrl || "/placeholder.svg"}
						alt={cachedAttachment.originalName || "Image attachment"}
						className="max-w-xs rounded-md border border-gray-200"
					/>
				</div>
			);
		} else if (cachedAttachment) {
			// For PDF files
			if (cachedAttachment.type === "application/pdf") {
				return (
					<div className="mt-2">
						<div className="p-2 bg-gray-100 rounded-md mb-2">
							<a
								href={cachedAttachment.objectUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#6366f1] hover:underline"
							>
								{cachedAttachment.originalName || "PDF document"}
							</a>
						</div>
						<iframe
							src={cachedAttachment.objectUrl}
							className="w-full h-64 rounded-md border border-gray-200"
							title={cachedAttachment.originalName || "PDF document"}
						/>
					</div>
				);
			} else {
				// For other file types
				return (
					<div className="mt-2">
						<a
							href={cachedAttachment.objectUrl}
							download={cachedAttachment.originalName}
							className="flex items-center p-2 bg-[#eef2ff] rounded-md text-[#6366f1] hover:bg-[#dbeafe]"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<span className="text-sm truncate">
								{cachedAttachment.originalName || "Download attachment"}
							</span>
						</a>
					</div>
				);
			}
		}

		return (
			<div className="mt-2 p-3 bg-gray-100 rounded-md text-gray-500">
				Attachment unavailable
			</div>
		);
	};

	// Clean up object URLs when component unmounts
	useEffect(() => {
		return () => {
			Object.values(attachmentCache).forEach((cache) => {
				if (cache.objectUrl) {
					URL.revokeObjectURL(cache.objectUrl);
				}
			});
		};
	}, [attachmentCache]);

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
								{message.content && <div>{message.content}</div>}

								{/* Render attachments */}
								{message.attachments &&
									message.attachments.length > 0 &&
									message.attachments.map((attachment, index) => (
										<div key={index}>{renderAttachment(attachment)}</div>
									))}

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
				<MessageInput onSendMessage={onSendMessage} username={username} />
			</div>
		</div>
	);
}
