import React, { useState, useEffect } from "react";
import axios from "axios";

const Integrations = ({ user }) => {
	const [calendlyIntegration, setCalendlyIntegration] = useState(null);

	// useEffect(() => {
	// 	const fetchCalendlyIntegration = async () => {
	// 		try {
	// 			const response = await axios.get("/api/calendly/integration", {
	// 				params: { userId: user.id },
	// 			});
	// 			setCalendlyIntegration(response.data);
	// 		} catch (error) {
	// 			console.error("Error fetching Calendly integration:", error);
	// 		}
	// 	};
	// 	fetchCalendlyIntegration();
	// }, [user.id]);

	const handleConnect = () => {
		window.location.href = "/api/calendly/oauth/authorize";
	};

	const handleDisconnect = async () => {
		try {
			await axios.delete("/api/calendly/integration", {
				data: { userId: user.id },
			});
			setCalendlyIntegration(null);
		} catch (error) {
			console.error("Error disconnecting Calendly:", error);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold text-textPrimary mb-4">
				Integrations
			</h2>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">Calendly</h3>
						<p className="text-gray-600">
							Connect your Calendly account to allow others to schedule meetings
							with you.
						</p>
					</div>
					{calendlyIntegration ? (
						<button
							className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
							onClick={handleDisconnect}
						>
							Disconnect
						</button>
					) : (
						<button
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							onClick={handleConnect}
						>
							Connect
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default Integrations;
