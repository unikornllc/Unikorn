// app/components/ExternalLink.js
"use client"; // Indicates this is a Client Component

import Link from "next/link";

const ExternalLink = ({ href, children, ...props }) => {
	const isExternal = /^https?:\/\//i.test(href);

	if (isExternal) {
		// Encode the external URL
		const encodedUrl = encodeURIComponent(href);

		// Redirect to the warning page with the external URL as a query parameter
		const redirectUrl = `/external-redirect?url=${encodedUrl}`;

		// Use an anchor tag with target="_blank" to open in a new tab
		return (
			<a
				href={redirectUrl}
				target="_blank"
				rel="noopener noreferrer"
				{...props}
			>
				{children}
			</a>
		);
	}

	// Internal link - use Next.js <Link> component
	return (
		<Link href={href} {...props}>
			{children}
		</Link>
	);
};

export default ExternalLink;
