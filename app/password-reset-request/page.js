import { useState } from "react";

export default function PasswordResetRequest() {
	const [email, setEmail] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await axios.post("/password-reset-request", { email });
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Password Reset Request</h2>
			<input
				type="email"
				placeholder="Your email address"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<button type="submit">Reset Password</button>
		</form>
	);
}
