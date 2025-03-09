"use client";

import { useState, useEffect, createContext, useContext } from "react";

const TOAST_REMOVE_DELAY = 4000;

const ToastContext = createContext({});

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const addToast = (toast) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);
		return id;
	};

	const removeToast = (id) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
	};

	const updateToast = (id, toast) => {
		setToasts((prevToasts) =>
			prevToasts.map((t) => (t.id === id ? { ...t, ...toast } : t)),
		);
	};

	const dismissToast = (id) => {
		setToasts((prevToasts) =>
			prevToasts.map((t) => (t.id === id ? { ...t, open: false } : t)),
		);
		removeToast(id);
	};

	return (
		<ToastContext.Provider
			value={{ toasts, addToast, removeToast, updateToast, dismissToast }}
		>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const { toasts, addToast, removeToast, updateToast, dismissToast } =
		useContext(ToastContext);

	useEffect(() => {
		const timers = toasts
			.map((toast) => {
				if (toast.open !== false) {
					const timer = setTimeout(() => {
						dismissToast(toast.id);
					}, TOAST_REMOVE_DELAY);
					return { id: toast.id, timer };
				}
			})
			.filter(Boolean);

		return () => {
			timers.forEach((timer) => clearTimeout(timer.timer));
		};
	}, [toasts, dismissToast]);

	return {
		toast: (props) => {
			const id = addToast({ ...props, open: true });
			return {
				id,
				update: (props) => updateToast(id, props),
				dismiss: () => dismissToast(id),
			};
		},
		toasts,
		dismiss: dismissToast,
	};
}
