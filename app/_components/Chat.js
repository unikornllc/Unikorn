import { useState, useEffect } from "react";
import socket from "../_utils/socket";
import User from "./User";
import MessagePanel from "./MessagePanel";

export default function Chat() {
	const [selectedUser, setSelectedUser] = useState(null);
	const [users, setUsers] = useState([]);

	// useEffect(() => {
	// 	console.log(socket.connected);
	// }, []);
	useEffect(() => {
		console.log("Users:", users);
	}, [users]);
	// useEffect(() => {
	// 	console.log("Selected user:", selectedUser);
	// }, [selectedUser]);

	useEffect(() => {
		const initReactiveProperties = (user) => {
			user.hasNewMessages = false;
			user.connected == "online" ? "offline" : "online";
		};

		// const handleUsersUpdate = (newUsers) => {
		// 	console.log(newUsers);
		// 	newUsers.forEach((user) => {
		// 		user.messages.forEach((message) => {
		// 			message.fromSelf = message.from === socket.userID;
		// 		});
		// 		for (let i = 0; i < users.length; i++) {
		// 			const existingUser = users[i];
		// 			if (existingUser.userID === user.userID) {
		// 				existingUser.connected = user.connected;
		// 				existingUser.messages = user.messages;
		// 				return;
		// 			}
		// 		}
		// 		user.self = user.userID === socket.userID;
		// 		initReactiveProperties(user);
		// 		setUsers((prevUsers) => [...prevUsers, user]);
		// 	});
		// };

		// const handleUserConnected = (user) => {
		// 	setUsers((prevUsers) => {
		// 		const updatedUsers = [...prevUsers];
		// 		const index = updatedUsers.findIndex((u) => u.userID === user.userID);
		// 		if (index !== -1) {
		// 			updatedUsers[index].connected = true;
		// 		} else {
		// 			initReactiveProperties(user);
		// 			updatedUsers.push(user);
		// 		}
		// 		return updatedUsers;
		// 	});
		// };

		// const handleUserDisconnected = (id) => {
		// 	setUsers((prevUsers) =>
		// 		prevUsers.map((user) =>
		// 			user.userID === id ? { ...user, connected: false } : user,
		// 		),
		// 	);
		// };

		// const handlePrivateMessage = ({ content, from, to }) => {
		// 	setUsers((prevUsers) =>
		// 		prevUsers.map((user) => {
		// 			const fromSelf = socket.userID === from;
		// 			if (user.userID === (fromSelf ? to : from)) {
		// 				user.messages.push({
		// 					content,
		// 					fromSelf,
		// 				});
		// 				if (user !== selectedUser) {
		// 					user.hasNewMessages = true;
		// 				}
		// 			}
		// 			return user;
		// 		}),
		// 	);
		// };

		// Socket event listeners

		socket.on("users", (users) => {
			users.forEach((user) => {
				user.self = user.userID === socket.id;
				initReactiveProperties(user);
			});
			const sortedUsers = users.sort((a, b) => {
				if (a.self) return -1;
				if (b.self) return 1;
				if (a.username < b.username) return -1;
				return a.username > b.username ? 1 : 0;
			});
			setUsers(sortedUsers);
		});

		socket.on("user connected", (user) => {
			initReactiveProperties(user);
			setUsers((prevUsers) => {
				const existingUser = prevUsers.find((u) => u.userID === user.userID);
				if (!existingUser) {
					return [...prevUsers, user];
				}
				return prevUsers;
			});
		});
		socket.on("user disconnected", (id) => {
            for (let i = 0; i < users.length; i++) {
              const user = users[i];
              if (user.userID === id) {
                user.connected = false;
                break;
              }
            }
          });
      
		socket.on("private message", ({ content, from }) => {
			for (let i = 0; i < users.length; i++) {
				const user = users[i];
				if (user.userID === from) {
					user.messages.push({
						content,
						fromSelf: false,
					});
					if (user !== selectedUser) {
						user.hasNewMessages = true;
					}
					break;
				}
			}
		});
		socket.on("connect", () => {
			users.forEach((user) => {
				if (user.self) {
					user.connected = "online";
				}
			});
		});
		socket.on("disconnect", () => {
			users.forEach((user) => {
				if (user.self) {
					user.connected = "offline";
				}
			});
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
	}, [users, selectedUser]);

	const handleMessage = (content) => {
		if (selectedUser) {
			socket.emit("private message", {
				content,
				to: selectedUser.userID,
			});
			selectedUser.messages.push({
				content,
				fromSelf: true,
			});
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
				{users.map((user) => (
					<User
						key={user.userID}
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
					onInput={() => handleMessage(selectedUser.messages)}
					className="flex-1 bg-gray-100 p-4"
				/>
			)}
		</div>
	);
}
