"use client";

import { useState, useEffect } from "react";
import { SocketProvider, useSocket } from "../contexts/SocketContext.js";
import ChatList from "./ChatList.js";
import ChatWindow from "./ChatWindow.js";
import NewChatModal from "./NewChatModal.js";
import NotificationToast from "./NotificationToast.js";
import axios from "axios";

export default function ChatInterface({ userId, username }) {
	return (
		<SocketProvider userId={userId}>
			<ChatApp userId={userId} username={username} />
		</SocketProvider>
	);
}

function ChatApp({ userId, username }) {
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [notifications, setNotifications] = useState([]);

	const { socket, connected } = useSocket();

	useEffect(() => {
		async function getFollowing() {
			const res = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/getMyFollowing`,
				{
					withCredentials: true,
				},
				{
					username: username,
				},
			);
			setUsers([...res.data.users, ...res.data.companies]);
		}
		getFollowing();
	}, []);

	useEffect(() => {
		if (!socket) return;
		socket.on("chats", (receivedChats) => {
			console.log("Received chats:", receivedChats);
			setChats(receivedChats); // trust unreadCount from server
		});

		socket.on("new message", ({ chatId, message }) => {
			console.log(`New message in chat ${chatId}:`, message);

			if (selectedChat && selectedChat.chatID === chatId) {
				setMessages((prev) => [...prev, message]);
			} else {
				setNotifications((prev) => [
					...prev,
					{
						id: Date.now(),
						text: `New message from ${message.sender.username}`,
					},
				]);
				// setChats((prevChats) =>
				// 	prevChats.map((chat) =>
				// 		chat.chatID === chatId
				// 			? { ...chat, unreadCount: (chat.unreadCount || 0) + 1 }
				// 			: chat,
				// 	),
				// );
			}

			setChats((prevChats) =>
				prevChats.map((chat) => {
					if (chat.chatID === chatId) {
						return {
							...chat,
							messages: [...(chat.messages || []), message],
						};
					}
					return chat;
				}),
			);
		});

		socket.on("chat created", (newChat) => {
			console.log("New chat created:", newChat);
			setChats((prev) => [...prev, newChat]);
			setSelectedChat(newChat);
			setMessages(newChat.messages || []);
			setIsNewChatModalOpen(false);
		});

		socket.on("users", (onlineUsers) => {
			setUsers(onlineUsers);
		});
		socket.on("chat unread update", ({ chatId }) => {
			socket.emit("get updated chat", { chatId });
		});
		socket.on("updated chat", (updatedChat) => {
			console.log(updatedChat);
			setChats((prevChats) =>
				prevChats.map((chat) =>
					chat.chatID === updatedChat.chatID
						? { ...chat, unreadCount: updatedChat.unreadCount }
						: chat,
				),
			);
		});

		return () => {
			socket.off("chats");
			socket.off("new message");
			socket.off("chat created");
			socket.off("users");
			socket.off("chat unread update");
			socket.off("updated chat");
		};
	}, [socket, selectedChat]);

	const handleCreateChat = ({ participants, isGroupChat, name }) => {
		if (!socket) return;

		socket.emit("create chat", {
			participants,
			isGroupChat,
			name: isGroupChat ? name : undefined,
		});
	};

	const handleSendMessage = (content) => {
		if (!content.trim() || !selectedChat || !socket) return;
		socket.emit("send message", {
			chatId: selectedChat.chatID,
			content,
		});
	};

	// useEffect(() => {
	// 	if (!selectedChat || !socket || messages.length === 0) return;

	// 	const latestMessage = messages[messages.length - 1];

	// 	if (!latestMessage) return;

	// 	console.log("📬 Marking as read:", latestMessage.id);

	// 	socket.emit("mark as read", {
	// 		chatId: selectedChat.chatID,
	// 		messageId: latestMessage.id,
	// 	});
	// }, [selectedChat, messages]);

	const handleMarkAsRead = (chatId, messageId) => {
		if (!socket) return;
		socket.emit("mark as read", {
			chatId: chatId,
			messageId: messageId,
		});
	};

	return (
		<div className="flex flex-1 h-full overflow-hidden">
			<div className="w-80 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm rounded-l-lg">
				<div className="p-4 border-b border-gray-100">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-semibold text-[#6366f1]">Messages</h1>
						<div className="flex items-center">
							<span
								className={`h-3 w-3 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}
							></span>
							<span className="text-sm text-gray-500">
								{connected ? "Online" : "Offline"}
							</span>
						</div>
					</div>
					<p className="text-sm text-gray-500">
						Logged in as <span className="text-[#6366f1]">@{username}</span>
					</p>
					<button
						onClick={() => setIsNewChatModalOpen(true)}
						className="mt-4 w-full bg-[#6366f1] text-white rounded-md py-2 px-4 hover:bg-[#4f46e5] transition shadow-sm"
					>
						New Chat
					</button>
				</div>

				<ChatList
					chats={chats}
					onSelectChat={(chat) => {
						setSelectedChat(chat);
						setMessages(chat.messages || []);

						setChats((prevChats) =>
							prevChats.map((c) =>
								c.chatID === chat.chatID ? { ...c, unreadCount: 0 } : c,
							),
						);

						if (chat.messages?.length > 0) {
							const latestMessage = chat.messages[chat.messages.length - 1];
							console.log(latestMessage);
							handleMarkAsRead(chat.chatID, latestMessage.id);
						}
					}}
				/>
			</div>

			<div className="flex-1 flex flex-col bg-white rounded-r-lg shadow-sm">
				<ChatWindow
					chat={selectedChat}
					messages={messages}
					userId={userId}
					onSendMessage={handleSendMessage}
				/>
			</div>
			<div className="fixed bottom-6 right-6 space-y-2 z-50">
				{notifications.map((n) => (
					<NotificationToast
						key={n.id}
						message={n.text}
						onClose={() =>
							setNotifications((prev) =>
								prev.filter((notif) => notif.id !== n.id),
							)
						}
					/>
				))}
			</div>

			{isNewChatModalOpen && (
				<NewChatModal
					users={users}
					userId={userId}
					onClose={() => setIsNewChatModalOpen(false)}
					onCreateChat={handleCreateChat}
				/>
			)}
		</div>
	);
}
