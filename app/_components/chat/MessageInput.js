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
		<div>
			<form
				onSubmit={handleSubmit}
				className="p-4 bg-white border-t border-gray-200"
			>
				{console.log("dkdk")}
				<div className="flex">
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						className="flex-1 rounded-l-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white rounded-r-md px-4 py-2 hover:bg-blue-600 transition"
					>
						Send
					</button>
				</div>
			</form>
		</div>
	);
}
