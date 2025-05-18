"use client";

import React from "react";
import { Toaster } from "sonner";

export default function CreatePostLayout({ children }) {
	return (
		<>
			{children}
			<Toaster position="top-right" />
		</>
	);
}
