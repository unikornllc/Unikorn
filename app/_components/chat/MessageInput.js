"use client";

import { useState, useRef } from "react";
import { PaperclipIcon, XIcon } from "lucide-react";
import axios from "axios";

export default function MessageInput({ onSendMessage, username }) {
	const [message, setMessage] = useState("");
	const [attachment, setAttachment] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const fileInputRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if ((!message.trim() && !attachment) || isUploading) return;

		let attachmentData = null;
		if (attachment) {
			setIsUploading(true);
			try {
				// Create unique filename for chat attachment
				const fileExtension = attachment.name.includes(".")
					? attachment.name.split(".").pop()
					: "";
				const chatFileName = `chat_${Date.now()}${fileExtension ? `.${fileExtension}` : ""}`;

				// Create FormData for file upload
				const formData = new FormData();
				formData.append("file", attachment);
				formData.append("username", username);
				formData.append("fileName", chatFileName);

				// Use the existing file upload API with axios
				const response = await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/api/uploadFile`,
					formData,
					{
						withCredentials: true,
						headers: { "Content-Type": "multipart/form-data" },
					},
				);

				// Determine attachment type based on MIME type
				let attachmentType = "FILE";
				if (attachment.type.startsWith("image/")) {
					attachmentType = "IMAGE";
				}

				// Create attachment data using the response
				attachmentData = {
					type: attachmentType, // Use enum value instead of MIME type
					url: `${process.env.NEXT_PUBLIC_SERVER}/api/getFile?username=${username}&fileName=${chatFileName}`,
					fileName: chatFileName,
					fileSize: attachment.size,
					mimeType: attachment.type,
					originalName: attachment.name,
				};
			} catch (error) {
				console.error("Error uploading file:", error);
				alert("Failed to upload file. Please try again.");
				setIsUploading(false);
				return;
			}
			setIsUploading(false);
		}

		onSendMessage(message, attachmentData);
		setMessage("");
		setAttachment(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			// Check file size (limit to 10MB)
			if (file.size > 10 * 1024 * 1024) {
				alert("File size exceeds 10MB limit. Please select a smaller file.");
				fileInputRef.current.value = "";
				return;
			}
			setAttachment(file);
		}
	};

	const removeAttachment = () => {
		setAttachment(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit}>
				{attachment && (
					<div className="mb-2 p-2 bg-[#eef2ff] rounded-md flex items-center justify-between">
						<div className="text-sm truncate max-w-[90%]">
							<span className="font-medium">Attachment:</span> {attachment.name}
						</div>
						<button
							type="button"
							onClick={removeAttachment}
							className="text-gray-500 hover:text-red-500"
						>
							<XIcon size={16} />
						</button>
					</div>
				)}
				<div className="flex w-full">
					<div className="flex items-center mr-2">
						<label className="cursor-pointer text-[#6366f1] hover:text-[#4f46e5]">
							<PaperclipIcon size={20} />
							<input
								type="file"
								className="hidden"
								onChange={handleFileChange}
								ref={fileInputRef}
								accept="image/*,.pdf,.doc,.docx,.txt"
							/>
						</label>
					</div>
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						className="flex-1 rounded-l-md border border-gray-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-[#f8f9fe]"
					/>
					<button
						type="submit"
						disabled={isUploading}
						className={`${
							isUploading ? "bg-gray-400" : "bg-[#6366f1] hover:bg-[#4f46e5]"
						} text-white rounded-r-md px-4 py-2 transition shadow-sm`}
					>
						{isUploading ? "Uploading..." : "Send"}
					</button>
				</div>
			</form>
		</div>
	);
}
