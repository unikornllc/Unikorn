"use client";

import { useState, useEffect } from "react";
import { SocketProvider, useSocket } from "../contexts/SocketContext.js";
import ChatList from "./ChatList.js";
import ChatWindow from "./ChatWindow.js";
import NewChatModal from "./NewChatModal.js";
import NotificationToast from "./NotificationToast.js";
import { usePermissions } from "../../_hooks/usePermissions.js";
import { FeatureGuard, UpgradePrompt } from "../_ui/UpgradePrompt.js";
import axios from "axios";
import { useToast } from "../../_components/_hooks/useToast.js";
import { useChatAccess } from "@/app/_hooks/useChatAccess";



export default function ChatInterface({ userId, username }) {
	const { canAccessChat, canCreateChat, loading, error } = useChatAccess(userId);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<p className="text-red-600 mb-4">Error loading permissions</p>
					<button 
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Try Again
					</button>
				</div>
			</div>
		);
	}

	// if (!canAccessChat) {
	// 	return (
	// 		<div className="flex items-center justify-center h-full p-8">
	// 			<UpgradePrompt 
	// 				feature="CHATTING" 
	// 				onUpgrade={handleUpgrade}
	// 			/>
	// 		</div>
	// 	);
	// }

	return (
		<SocketProvider userId={userId}>
			<ChatApp userId={userId} username={username} canCreateChat={canCreateChat} />
		</SocketProvider>
	);
}

function ChatApp({ userId, username, canCreateChat }) {
	const [chats, setChats] = useState([]);
	const [selectedChat, setSelectedChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
	const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
	const [users, setUsers] = useState([]);
	const [notifications, setNotifications] = useState([]);

	const { socket, connected } = useSocket();
	const fetchReadReceipts = async (chatId) => {
		if (!socket) return;

		try {
			// Request read receipts for this chat
			socket.emit("get_read_receipts", { chatId });
		} catch (error) {
			console.error("Error fetching read receipts:", error);
		}
	};
	const handleUpgrade = () => {
		// Redirect to upgrade page or show upgrade modal
		window.location.href = "/settings?upgrade=true";
	};

	const { toast } = useToast();

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
		if (connected && selectedChat) {
			fetchReadReceipts(selectedChat.chatID);
		}
	}, [connected, selectedChat]);

	useEffect(() => {
		if (!socket) return;
		socket.on("chats", (receivedChats) => {
			console.log("Received chats:", receivedChats);
			setChats(receivedChats);
			if (selectedChat) {
				fetchReadReceipts(selectedChat.chatID);
			}
		});

		socket.on("new message", ({ chatId, message }) => {
			console.log(`New message in chat ${chatId}:`, message);

			if (selectedChat && selectedChat.chatID === chatId) {
				setMessages((prev) => [...prev, message]);
				if (message.senderId !== userId) {
					socket.emit("mark as read", {
						chatId: chatId,
						messageId: message.id,
					});
				}
			} else {
				setNotifications((prev) => [
					...prev,
					{
						id: Date.now(),
						text: `New message from ${message.sender.username}`,
					},
				]);
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

		socket.on("message read", ({ chatId, messageId, readBy }) => {
			console.log(
				`Message ${messageId} in chat ${chatId} was read by ${readBy}`,
			);

			setMessages((prevMessages) =>
				prevMessages.map((message) => {
					if (message.id === messageId) {
						return {
							...message,
							readReceipts: [
								...(message.readReceipts || []),
								{ username: readBy, readAt: new Date() },
							],
						};
					}
					return message;
				}),
			);
		});
		socket.on("read_receipts", ({ chatId, receipts }) => {
			setMessages((prevMessages) =>
				prevMessages.map((message) => {
					const messageReceipts = receipts.filter(
						(r) => r.messageId === message.id,
					);
					if (messageReceipts.length > 0) {
						return {
							...message,
							readReceipts: messageReceipts,
						};
					}
					return message;
				}),
			);

			setChats((prevChats) =>
				prevChats.map((chat) => {
					if (chat.chatID === chatId) {
						const updatedMessages = chat.messages.map((message) => {
							const messageReceipts = receipts.filter(
								(r) => r.messageId === message.id,
							);
							if (messageReceipts.length > 0) {
								return {
									...message,
									readReceipts: messageReceipts,
								};
							}
							return message;
						});
						return { ...chat, messages: updatedMessages };
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
		socket.on("chat deleted", ({ chatId, deletedAt }) => {
			console.log("Chat cleared:", chatId, "at", deletedAt);

			setChats((prev) =>
				prev.map((chat) => {
					if (chat.chatID === chatId) {
						return {
							...chat,
							messages: [],
						};
					}
					return chat;
				}),
			);

			if (selectedChat && selectedChat.chatID === chatId) {
				setMessages([]);
				setSelectedChat((prev) => ({
					...prev,
					messages: [],
				}));
				setNotifications((prev) => [
					...prev,
					{
						id: Date.now(),
						text: "Chat history has been cleared",
					},
				]);
			}
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

		// Add error event handler for socket errors
		socket.on("error", (err) => {
			const message = err?.message || err || "An unknown chat error occurred.";
			
			// Handle specific permission errors
			if (err?.error === "INSUFFICIENT_PERMISSIONS") {
				toast({
					title: "Permission Denied",
					description: message,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Chat Error",
					description: message,
					variant: "destructive",
				});
			}
		});

		return () => {
			socket.off("chats");
			socket.off("new message");
			socket.off("chat created");
			socket.off("chat deleted");
			socket.off("users");
			socket.off("chat unread update");
			socket.off("updated chat");
			socket.off("error");
			socket.off("message read");
			socket.off("read_receipts");
		};
	}, [socket, selectedChat, userId]);

	const handleCreateChat = ({ participants, isGroupChat, name }) => {
		if (!socket) return;

		socket.emit("create chat", {
			participants,
			isGroupChat,
			name: isGroupChat ? name : undefined,
		});
	};
	const handleDeleteChat = (chatId) => {
		if (!socket) return;

		socket.emit("delete chat", { chatId });
	};
	const handleSendMessage = (content, attachment = null) => {
		if ((!content.trim() && !attachment) || !selectedChat || !socket) return;

		socket.emit("send message", {
			chatId: selectedChat.chatID,
			content,
			attachments: attachment ? [attachment] : [],
		});
	};

	// Listen for send message errors and update UI accordingly
	useEffect(() => {
		if (!socket) return;

		const handleSendError = (err) => {
			if (err?.error === "INSUFFICIENT_PERMISSIONS" && selectedChat) {
				// Update the chat to show it's read-only
				setChats((prevChats) =>
					prevChats.map((chat) =>
						chat.chatID === selectedChat.chatID
							? { ...chat, readOnly: true }
							: chat
					)
				);
			}
		};

		socket.on("error", handleSendError);

		return () => {
			socket.off("error", handleSendError);
		};
	}, [socket, selectedChat]);

	const handleMarkAsRead = (chatId, messageId) => {
		if (!socket) return;
		socket.emit("mark as read", {
			chatId: chatId,
			messageId: messageId,
		});
	};

	const handleNewChatClick = () => {
		if (canCreateChat) {
			setIsNewChatModalOpen(true);
		} else {
			setShowUpgradePrompt(true);
		}
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
						onClick={handleNewChatClick}
						className="mt-4 w-full bg-[#6366f1] text-white rounded-md py-2 px-4 hover:bg-[#4f46e5] transition shadow-sm"
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

						setChats((prevChats) =>
							prevChats.map((c) =>
								c.chatID === chat.chatID ? { ...c, unreadCount: 0 } : c,
							),
						);

						if (chat.messages?.length > 0) {
							const latestMessage = chat.messages[chat.messages.length - 1];
							console.log(latestMessage);
							handleMarkAsRead(chat.chatID, latestMessage.id);
							fetchReadReceipts(chat.chatID);
						}
					}}
					onDeleteChat={handleDeleteChat}
				/>
			</div>

			<div className="flex-1 flex flex-col bg-white rounded-r-lg shadow-sm">
				<ChatWindow
					chat={selectedChat}
					messages={messages}
					userId={userId}
					username={username}
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

{showUpgradePrompt && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
	<UpgradePrompt 
					feature="CHATTING" 
					onUpgrade={handleUpgrade}
				/>
      <button
        className="mt-4 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
        onClick={() => setShowUpgradePrompt(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
		</div>
	);
}
