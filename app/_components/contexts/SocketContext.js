"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SocketContext = createContext(null);

export function SocketProvider({ userId, children }) {
	const [socket, setSocket] = useState(null);
	const [connected, setConnected] = useState(false);
	const [socketUrl, setSocketUrl] = useState(null);

	useEffect(() => {
		async function fetchSocketUrl() {
			try {
				// const res = await axios.get(`http://localhost:3002/api/socket-url`, {
				// 	withCredentials: true,
				// });
				setSocketUrl("http://localhost:3002");
			} catch (error) {
				console.error("Failed to fetch socket URL:", error);
			}
		}

		fetchSocketUrl();
	}, []);

	useEffect(() => {
		if (!socketUrl || !userId) return;

		const socketInstance = io(socketUrl, {
			auth: { userId },
		});

		socketInstance.on("connect", () => {
			console.log("Connected to socket server");
			setConnected(true);
		});

		socketInstance.on("disconnect", () => {
			console.log("Disconnected from socket server");
			setConnected(false);
		});

		socketInstance.on("error", (error) => {
			console.error("Socket error:", error);
		});

		setSocket(socketInstance);

		return () => {
			socketInstance.disconnect();
		};
	}, [socketUrl, userId]);

	return (
		<SocketContext.Provider value={{ socket, connected }}>
			{children}
		</SocketContext.Provider>
	);
}

export function useSocket() {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error("useSocket must be used within a SocketProvider");
	}
	return context;
}
