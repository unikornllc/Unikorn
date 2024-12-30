import { useState, useEffect } from "react";
import socket from "../_utils/socket";
import User from "./User";
import MessagePanel from "./MessagePanel";

export default function Chat() {
	const [selectedUser, setSelectedUser] = useState(null);
	const [users, setUsers] = useState([]);

	// Initialize reactive properties for each user
	const initReactiveProperties = (user) => {
		user.hasNewMessages = false;
	};

	useEffect(() => {
		// Socket event listeners

		socket.on("users", (users) => {
			const updatedUsers = users.map((user) => {
				user.self = user.userID === socket.id;
				initReactiveProperties(user);
				return user;
			});

			const sortedUsers = updatedUsers.sort((a, b) => {
				if (a.self) return -1;
				if (b.self) return 1;
				return a.username.localeCompare(b.username);
			});

			setUsers(sortedUsers); // Set the users with updated state
		});

		socket.on("user connected", (user) => {
			initReactiveProperties(user);
			setUsers((prevUsers) => {
				const existingUser = prevUsers.find((u) => u.userID === user.userID);
				if (!existingUser) {
					return [...prevUsers, user]; // Add new user
				}
				return prevUsers;
			});
		});

		socket.on("user disconnected", (id) => {
			setUsers((prevUsers) => {
				return prevUsers.map((user) => {
					if (user.userID === id) {
						user.connected = "offline";
					}
					return user;
				});
			});
			console.log("user disconnect");
		});

		socket.on("private message", ({ content, from }) => {
			setUsers((prevUsers) => {
				return prevUsers.map((user) => {
					if (user.userID === from) {
						user.messages.push({
							content,
							fromSelf: false,
						});
						if (user !== selectedUser) {
							user.hasNewMessages = true;
						}
					}
					return user;
				});
			});
		});

		socket.on("connect", () => {
			setUsers((prevUsers) => {
				return prevUsers.map((user) => {
					if (user.self) {
						user.connected = "online";
					}
					return user;
				});
			});
		});

		socket.on("disconnect", () => {
			setUsers((prevUsers) => {
				return prevUsers.map((user) => {
					if (user.self) {
						user.connected = "offline";
					}
					return user;
				});
			});
			console.log("disconnect");
		});

		// Cleanup event listeners
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("users");
			socket.off("user connected");
			socket.off("user disconnected");
			socket.off("private message");
		};
	}, [selectedUser]);

	const handleMessage = (content) => {
		if (selectedUser) {
			selectedUser.messages.push({
				content,
				fromSelf: true,
			});
			socket.emit("private message", {
				content,
				to: selectedUser.userID,
			});

			// setUsers((prevUsers) => {
			// 	return prevUsers.map((user) => {
			// 		if (user.userID === selectedUser.userID) {
			// 			user.messages.push({
			// 				content,
			// 				fromSelf: true,
			// 			});
			// 		}
			// 		return user;
			// 	});
			// });
		}
	};

	const handleSelectUser = (user) => {
		setSelectedUser(user);
		setUsers((prevUsers) =>
			prevUsers.map((u) =>
				u.userID === user.userID ? { ...u, hasNewMessages: false } : u,
			),
		);
	};

	return (
		<div className="flex h-screen">
			{/* Left Panel */}
			<div className="w-64 bg-purple-900 text-white p-4 overflow-y-auto">
				{users.map((user, index) => (
					<User
						key={index}
						user={user}
						selected={selectedUser === user}
						onSelect={() => handleSelectUser(user)}
					/>
				))}
			</div>

			{/* Right Panel */}
			{selectedUser && (
				<MessagePanel
					user={selectedUser}
					onInput={handleMessage}
					className="flex-1 bg-gray-100 p-4"
				/>
			)}
		</div>
	);
}
