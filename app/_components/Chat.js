import { useState, useEffect } from "react";
import socket from "../_utils/socket";
import User from "./User";
import MessagePanel from "./MessagePanel";

export default function Chat() {
	const [selectedUser, setSelectedUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [messages, setMessages] = useState([]);

	// Initialize reactive properties for each user
	const initReactiveProperties = (user) => {
		user.hasNewMessages = false;
	};

	useEffect(() => {
		console.log(users);
	});

	useEffect(() => {
		if (selectedUser) {
			const updatedUser = users.find(
				(user) => user.userID === selectedUser.userID,
			);
			if (updatedUser) {
				setSelectedUser(updatedUser);
			}
		}
	}, [users]);

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

		socket.on("user disconnected", (disconnectedUser) => {
			setUsers((prevUsers) => {
				return prevUsers.map((user) => {
					if (user.userID == disconnectedUser.userID) {
						user.connected = "offline";
					}
					return user;
				});
			});
			console.log("user disconnect");
		});

		socket.on("private message", ({ content, from }) => {
			setUsers((prevUsers) =>
				prevUsers.map((user) => {
					if (user.userID === from) {
						return {
							...user,
							messages: [...user.messages, { content, fromSelf: false }],
							hasNewMessages: selectedUser?.userID !== from, // Mark as new message if not selected
						};
					}
					return user;
				}),
			);
			// const msg = {
			// 	content,
			// 	fromSelf: true,
			// };
			// setMessages((prevMessages) => [...prevMessages, msg]);
			// for (let user in users) {
			// 	if (user.userID === from) {
			// 		user.messages.push({ content, fromSelf: false });
			// 		if (user !== selectedUser) {
			// 			user.hasNewMessages = true;
			// 		}
			// 	}
			// }
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
	}, [users, selectedUser, messages]);

	const handleMessage = (content) => {
		if (selectedUser) {
			// Emit the message
			socket.emit("private message", {
				content,
				to: selectedUser.userID,
			});

			// Update the user's messages immutably
			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.userID === selectedUser.userID
						? {
								...user,
								messages: [...user.messages, { content, fromSelf: true }],
							}
						: user,
				),
			);
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
