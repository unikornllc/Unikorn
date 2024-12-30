import { useState } from "react";

export default function MessagePanel({ user, onInput, className }) {
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		setMessage(e.target.value);
	};

	const handleSend = (e) => {
		e.preventDefault();
		if (message.trim()) {
			onInput(message);
			setMessage("");
		}
	};

	const displaySender = (message, index, messages) => {
		return index === 0 || messages[index - 1]?.fromSelf !== message.fromSelf;
	};

	return (
		<div>
			<div>
				<span>{user.username}</span>
			</div>

			<ul>
				{console.log(user.messages)}
				{user.messages.map((message, index) => (
					<li key={index}>
						{displaySender(message, index, user.messages) && (
							<div>{message.fromSelf ? "(yourself)" : user.username}</div>
						)}
						<p>{message.content}</p>
					</li>
				))}
			</ul>

			<form onSubmit={handleSend}>
				<textarea
					value={message}
					onChange={handleChange}
					placeholder="Your message..."
				/>
				<button type="submit" disabled={!message.trim()}>
					Send
				</button>
			</form>
		</div>
	);
}
