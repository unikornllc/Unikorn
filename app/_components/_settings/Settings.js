import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import PersonalInfo from "./PersonalInfo";
import Integrations from "./Integrations";

const SettingsOverlay = ({ onClose, user }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 overflow-auto">
			<div className="bg-white mt-12 mb-6 rounded-lg shadow-lg w-full max-w-4xl">
				<div className="flex items-center justify-between px-6 py-4 border-b">
					<h2 className="text-2xl font-semibold text-textPrimary">Settings</h2>
					<button
						className="p-2 rounded-full hover:bg-gray-100"
						onClick={onClose}
					>
						<XMarkIcon className="w-6 h-6 text-gray-600" />
					</button>
				</div>
				<div className="p-6 space-y-8">
					<PersonalInfo user={user} />
					<Integrations user={user} />
				</div>
			</div>
		</div>
	);
};

export default SettingsOverlay;
