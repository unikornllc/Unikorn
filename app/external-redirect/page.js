// app/external-redirect/page.js
"use client"; // Indicates this is a Client Component

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ExternalRedirect = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const url = searchParams.get("url");

	// Decode the external URL
	const decodedUrl = url ? decodeURIComponent(url) : null;

	// Validate the URL starts with http:// or https://
	const isValidUrl = decodedUrl && /^https?:\/\//i.test(decodedUrl);

	if (!isValidUrl) {
		return <p>Invalid URL.</p>;
	}

	const handleProceed = () => {
		window.location.href = decodedUrl;
	};

	const handleCancel = () => {
		// Since the warning page is in a new tab, closing it returns the user to the original tab
		window.close();
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">You are leaving our site</h1>
			<p className="mb-4">
				You are about to visit an external website:
				<br />
				<a
					href={decodedUrl}
					className="text-blue-500 underline break-words"
					target="_blank"
					rel="noopener noreferrer"
				>
					{decodedUrl}
				</a>
			</p>
			<p className="mb-4">
				Please verify that the link is safe before proceeding.
			</p>
			<div className="flex space-x-4">
				<button
					onClick={handleProceed}
					className="px-4 py-2 bg-blue-500 text-white rounded"
				>
					Proceed
				</button>
				<button
					onClick={handleCancel}
					className="px-4 py-2 bg-gray-500 text-white rounded"
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ExternalRedirect;
