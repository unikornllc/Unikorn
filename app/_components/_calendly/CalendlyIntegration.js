import React, { useEffect, useState } from "react";
import axios from "axios";
import CalendlySettings from "../_settings/CalendlySettings";

const CalendlyIntegration = ({ user }) => {
	const [calendlyIntegration, setCalendlyIntegration] = useState(
		user.calendlyIntegration,
	);

	const handleConnect = async () => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/calendly/auth`,
				{
					withCredentials: true,
				},
			);
			if (response.data.redirectUrl) {
				window.location.href = response.data.redirectUrl;
			}
		} catch (error) {
			console.error(
				"Error connecting Calendly:",
				error.response || error.message,
			);
		}
	};

	const handleDisconnect = async () => {
		try {
			await axios
				.delete(`${process.env.NEXT_PUBLIC_SERVER}/calendly/disconnect`, {
					withCredentials: true,
				})
				.then(setCalendlyIntegration(null));
		} catch (error) {
			console.error("Error disconnecting Calendly:", error);
		}
	};

	return (
		<div className="flex items-center justify-between">
			<div>
				<h3 className="text-lg font-semibold">Calendly</h3>
				{calendlyIntegration ? (
					<div>
						<p className="text-gray-600">Your Calendly account is connected.</p>

						<CalendlySettings user={user} />
					</div>
				) : (
					<p className="text-gray-600">
						Connect your Calendly account to allow others to schedule meetings
						with you.
					</p>
				)}
			</div>
			{calendlyIntegration ? (
				<button
					className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
					onClick={handleDisconnect}
				>
					Disconnect
				</button>
			) : (
				<div>
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						onClick={handleConnect}
					>
						Connect Calendly Account
					</button>
				</div>
			)}
		</div>
	);
};
export default CalendlyIntegration;
