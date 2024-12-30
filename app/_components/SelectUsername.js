import { useState } from "react";

export default function SelectUsername({ onSelect }) {
	const [username, setUsername] = useState("");

	const handleInputChange = (e) => {
		setUsername(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (username.trim()) {
			onSelect(username);
		}
	};

	return (
		<div>
			<input
				type="text"
				value={username}
				onChange={handleInputChange}
				placeholder="Enter username"
			/>
			<button onClick={handleSubmit}>Start Chat</button>
		</div>
	);
}
