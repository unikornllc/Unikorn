"use client";

import { useToast } from "@/app/_components/_hooks/useToast";
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/app/_components/_ui/Toast";

export function Toaster() {
	const { toasts, dismiss } = useToast();

	// Ensure toasts is an array
	const safeToasts = Array.isArray(toasts) ? toasts : [];

	return (
		<ToastProvider>
			{safeToasts.map(({ id, title, description, action, ...props }) => (
				<Toast key={id} {...props}>
					<div className="grid gap-1">
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose onClick={() => dismiss(id)} />{" "}
				</Toast>
			))}
			<ToastViewport />
		</ToastProvider>
	);
}
