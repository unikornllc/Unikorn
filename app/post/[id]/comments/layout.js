import React from "react";
import { Toaster } from "sonner";

export default function CommentsLayout({ children }) {
	return (
		<>
			{children}
			<Toaster position="top-right" />
		</>
	);
}
