"use client";

import { useState, useEffect } from "react";
import socket from "../_utils/socket";
import SelectUsername from "../_components/SelectUsername";
import Chat from "../_components/Chat";

export default function Home() {
	const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
	// useEffect(() => {
	// 	const sessionID = localStorage.getItem("sessionID");

	// 	if (sessionID) {
	// 		setUsernameAlreadySelected(true);
	// 		socket.auth = { sessionID };
	// 		socket.connect();
	// 	}

	// 	socket.on("session", ({ sessionID, userID }) => {
	// 		socket.auth = { sessionID };
	// 		localStorage.setItem("sessionID", sessionID);
	// 		socket.userID = userID;
	// 	});

	socket.on("connect_error", (err) => {
		if (err.message === "invalid username") {
			setUsernameAlreadySelected(false);
		}
	});
	// 	return () => {
	// 		socket.off("connect_error");
	// 	};
	// }, []);

	const handleUsernameSelection = (username) => {
		setUsernameAlreadySelected(true);
		socket.auth = { username };
		socket.connect();
	};

	return (
		<div id="app">
			{!usernameAlreadySelected ? (
				<SelectUsername onSelect={handleUsernameSelection} />
			) : (
				<Chat />
			)}
		</div>
	);
}

// function Text() {
// 	const [room, setroom] = useState("");
// 	const [msg, setmsg] = useState("");
// 	const sendMessage = () => {
// 		socket.emit("sendMessage", { message: msg }, room);
// 	};
// 	useEffect(() => {
// 		try {
// 			socket.on("receive_message", (data) => {
// 				console.log(data.message);
// 			});
// 		} catch (error) {
// 			console.log(error);
// 		}
// 	}, []);

// 	const ConnectRoom = () => {
// 		socket.emit(
// 			"joinRoom",
// 			{ senderId: "user1", receiverId: "user2" },
// 			(response) => {
// 				console.log(response.status);
// 				alert(response.msg);
// 			},
// 		);
// 	};
// 	return (
// 		<div className="App">
// 			<div className="typeMessage">
// 				<input
// 					type="text"
// 					placeholder="WriteYour Message"
// 					value={msg}
// 					onChange={(e) => setmsg(e.target.value)}
// 				/>
// 				<button onClick={sendMessage}>Send</button>
// 				<input
// 					type="text"
// 					placeholder="Room"
// 					onChange={(e) => setroom(e.target.value)}
// 				/>
// 				<button onClick={ConnectRoom}>Connect Room</button>
// 			</div>
// 		</div>
// 	);
// }

// export default Text;
