import React from "react";
import { Toaster } from "sonner";
import { ToastProvider } from "@/app/_components/_hooks/useToast";

export default function NewsfeedLayout({ children }) {
	return (
		<>
			<ToastProvider>
				{children}
				<Toaster position="top-right" />
			</ToastProvider>
		</>
	);
}
