import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendlyIntegration from "../_calendly/CalendlyIntegration";

const Integrations = ({ user }) => {
	return (
		<div>
			<h2 className="text-2xl font-semibold text-textPrimary mb-4">
				Integrations
			</h2>
			<div className="space-y-4">
				<CalendlyIntegration user={user}></CalendlyIntegration>
			</div>
		</div>
	);
};

export default Integrations;
