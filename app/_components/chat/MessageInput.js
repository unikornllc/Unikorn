"use client";

import { useState } from "react";

export default function MessageInput({ onSendMessage }) {
	const [message, setMessage] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!message.trim()) return;

		onSendMessage(message);
		setMessage("");
	};

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit}>
				<div className="flex w-full">
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						className="flex-1 rounded-l-md border border-gray-200 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#6366f1] bg-[#f8f9fe]"
					/>
					<button
						type="submit"
						className="bg-[#6366f1] text-white rounded-r-md px-4 py-2 hover:bg-[#4f46e5] transition shadow-sm"
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
}
