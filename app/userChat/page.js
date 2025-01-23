"use client";

import { useState, useEffect } from "react";
import socket from "../_utils/socket";
import socket2 from "../_utils/socket2";
import SelectUsername from "../_components/SelectUsername";
import Chat from "../_components/Chat";

export default function Home() {
	const [sessionID, setSessionID] = useState("");
	const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
	const [r, setR] = useState(false);

	useEffect(() => {
		setR(localStorage.getItem("sessionID"));
	}, []);

	useEffect(() => {
		const storedSessionID = localStorage.getItem("sessionID");

		if (storedSessionID) {
			setSessionID(storedSessionID);
			setUsernameAlreadySelected(true);
			socket.auth = { sessionID: storedSessionID };
			socket.connect();
		} else {
			handleUsernameSelection("me");
		}

		const handleSession = ({ sessionID, userID }) => {
			socket.auth = { sessionID };
			localStorage.setItem("sessionID", sessionID);
			setSessionID(sessionID);
			socket.userID = userID;
		};

		const handleConnectError = (err) => {
			if (err.message === "invalid username") {
				setUsernameAlreadySelected(false);
			}
		};

		socket.on("session", handleSession);
		socket.on("connect_error", handleConnectError);

		return () => {
			socket.off("session", handleSession);
			socket.off("connect_error", handleConnectError);
		};
	}, []);

	const handleUsernameSelection = (username) => {
		setUsernameAlreadySelected(true);
		socket.auth = { username };
		socket2.auth = { username: "second user" };
		socket.connect();
		socket2.connect();
	};

	return (
		<div id="app">{usernameAlreadySelected ? <Chat /> : <p>Loading...</p>}</div>
	);
}
