import { useState, useEffect } from "react";
import { useSocket } from "../contexts/SocketContext";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import UserSelector from "./ChatInterface";

export default function ChatApp() {
	const [userId, setUserId] = useState("user_123");
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [messages, setMessages] = useState([]);

	const { socket, connected } = useSocket();

	const handleUserChange = (newUserId) => {
		window.location.reload();
		setUserId(newUserId);
	};

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
		});

		return () => {
			socket.off("chats");
			socket.off("new message");
			socket.off("chat created");
		};
	}, [socket, selectedChat]);

	const selectChat = (chat) => {
		setSelectedChat(chat);
		setMessages(chat.messages || []);

		if (chat.messages && chat.messages.length > 0) {
			const lastMessage = chat.messages[chat.messages.length - 1];
			socket.emit("mark as read", {
				chatId: chat.chatID,
				messageId: lastMessage.id,
			});
		}
	};

	const sendMessage = (content) => {
		if (!content.trim() || !selectedChat || !socket) return;

		socket.emit("send message", {
			chatId: selectedChat.chatID,
			content: content,
		});
	};

	const createChat = (participantId) => {
		if (!participantId.trim() || !socket) return;

		socket.emit("create chat", {
			participants: [participantId],
			isGroupChat: false,
		});
	};

	return (
		<div className="container mx-auto p-4 h-screen flex flex-col">
			<header className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
				<h1 className="text-2xl font-bold">Chat Test App</h1>
				<div className="flex items-center gap-4">
					<div>
						<span
							className={`h-3 w-3 rounded-full mr-2 inline-block ${connected ? "bg-green-500" : "bg-red-500"}`}
						></span>
						<span>{connected ? "Connected" : "Disconnected"}</span>
					</div>
					<UserSelector
						currentUserId={userId}
						onSelectUser={handleUserChange}
					/>
				</div>
			</header>

			<div className="flex flex-1 gap-4 overflow-hidden">
				<ChatList
					chats={chats}
					selectedChat={selectedChat}
					onSelectChat={selectChat}
					onCreateChat={createChat}
				/>
				<ChatWindow
					chat={selectedChat}
					messages={messages}
					userId={userId}
					onSendMessage={sendMessage}
				/>
			</div>
		</div>
	);
}
