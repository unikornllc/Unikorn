"use client";

import { useState, useEffect } from "react";
import { SocketProvider, useSocket } from "../contexts/SocketContext.js";
import ChatList from "./ChatList.js";
import ChatWindow from "./ChatWindow.js";
import NewChatModal from "./NewChatModal.js";
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
			setChats(receivedChats);

			if (receivedChats.length > 0 && !selectedChat) {
				setSelectedChat(receivedChats[0]);
				setMessages(receivedChats[0].messages || []);
			}
		});

		socket.on("new message", ({ chatId, message }) => {
			console.log(`New message in chat ${chatId}:`, message);

			if (selectedChat && selectedChat.chatID === chatId) {
				setMessages((prev) => [...prev, message]);
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

		return () => {
			socket.off("chats");
			socket.off("new message");
			socket.off("chat created");
			socket.off("users");
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

	const handleMarkAsRead = (messageId) => {
		if (!selectedChat || !socket) return;

		socket.emit("mark as read", {
			chatId: selectedChat.chatID,
			messageId,
		});
	};

	return (
		<div className="flex h-full">
			<div className="w-80 bg-white border-r border-gray-200">
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center justify-between">
						<h1 className="text-xl font-semibold">Chats</h1>
						<div className="flex items-center">
							<span
								className={`h-3 w-3 rounded-full mr-2 ${connected ? "bg-green-500" : "bg-red-500"}`}
							></span>
							<span className="text-sm text-gray-500">
								{connected ? "Online" : "Offline"}
							</span>
						</div>
					</div>
					<p className="text-sm text-gray-500">Logged in as {username}</p>
					<button
						onClick={() => setIsNewChatModalOpen(true)}
						className="mt-4 w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition"
					>
						New Chat
					</button>
				</div>

				<ChatList
					chats={chats}
					selectedChatId={selectedChat?.chatID}
					onSelectChat={(chat) => {
						setSelectedChat(chat);
						setMessages(chat.messages || []);
						if (chat.messages?.length > 0) {
							const latestMessage = chat.messages[chat.messages.length - 1];
							handleMarkAsRead(latestMessage.id);
						}
					}}
				/>
			</div>

			<div className="flex-1 flex flex-col">
				<ChatWindow
					chat={selectedChat}
					messages={messages}
					userId={userId}
					onSendMessage={handleSendMessage}
				/>
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
