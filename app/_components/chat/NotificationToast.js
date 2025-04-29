"use client";
import { useEffect, useState } from "react";

export default function NotificationToast({ message, onClose }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 5000); // auto close after 5s

		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="fixed bottom-6 right-6 bg-white border border-gray-300 shadow-lg p-4 rounded-lg flex items-center space-x-3">
			<div className="text-sm font-semibold">{message}</div>
			<button
				onClick={onClose}
				className="text-gray-500 hover:text-gray-700 ml-4"
			>
				✖
			</button>
		</div>
	);
}
