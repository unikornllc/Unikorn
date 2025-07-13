import { Server } from "socket.io";
import prisma from "../db.js";
import { createServer } from "http";
import { hasFeaturePermission } from "../middlewares/featurePermissions.js";


const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
		credentials: true,
	},
});
  

io.on("connection", async (socket) => {
	const userId = socket.handshake.auth.userId;
	console.log(userId);
	if (!userId) {
		socket.disconnect();
		return;
	}

	console.log(`User connected: ${userId}`);

	socket.join(userId);

	try {
		const userChats = await prisma.chatParticipant.findMany({
			where: { username: userId },
			include: {
				chat: {
					include: {
						participants: {
							include: {
								account: {
									select: {
										id: true,
										username: true,
									},
								},
							},
						},
					},
				},
			},
		});

		const chatsWithMessages = await Promise.all(
			userChats.map(async (chatParticipant) => {
				const deletedAt = chatParticipant.deletedAt;
				const recentMessages = await prisma.message.findMany({
					where: {
						chatId: chatParticipant.chatId,
						isDeleted: false,
						...(deletedAt && { createdAt: { gt: deletedAt } }),
					},
					include: {
						sender: {
							select: {
								id: true,
								username: true,
							},
						},
						attachments: true,
						readReceipts: {
							where: {
								username: { not: userId },
							},
						},
					},
					orderBy: { createdAt: "desc" },
					take: 30,
				});

				// First, get the timestamp of the last read message if it exists
				let lastReadTimestamp = null;
				if (chatParticipant.lastReadMessageId) {
					const lastReadMessage = await prisma.message.findUnique({
						where: { id: chatParticipant.lastReadMessageId },
						select: { createdAt: true },
					});
					if (lastReadMessage) {
						lastReadTimestamp = lastReadMessage.createdAt;
					}
				}

				const unreadCount = await prisma.message.count({
					where: {
						chatId: chatParticipant.chatId,
						isDeleted: false,
						senderId: { not: userId },
						NOT: {
							readReceipts: {
								some: {
									username: userId,
								},
							},
						},
						...(lastReadTimestamp && {
							createdAt: { gt: lastReadTimestamp },
						}),
					},
				});

				const otherParticipants = chatParticipant.chat.participants
					.filter((p) => p.username !== userId)
					.map((p) => ({
						userID: p.account.id,
						username: p.account.username,
					}));

				const isDirectChat = !chatParticipant.chat.isGroupChat;
				const chatName = isDirectChat
					? otherParticipants[0]?.username
					: chatParticipant.chat.name;

				return {
					chatID: chatParticipant.chatId,
					name: chatName,
					isGroupChat: chatParticipant.chat.isGroupChat,
					isFavorited: chatParticipant.isFavorited,
					isMuted: chatParticipant.isMuted,
					isArchived: chatParticipant.isArchived,
					participants: otherParticipants,
					messages: recentMessages.reverse(),
					lastReadMessageId: chatParticipant.lastReadMessageId,
					unreadCount: unreadCount,
				};
			}),
		);

		// console.log(userChats);
		// console.log(chatsWithMessages);

		socket.emit("chats", chatsWithMessages);
	} catch (error) {
		console.error("Error fetching user data:", error);
		socket.emit("error", { message: "Failed to load chat data" });
	}

	socket.on("get updated chat", async ({ chatId }) => {
		try {
			const participant = await prisma.chatParticipant.findUnique({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
				include: {
					chat: {
						include: {
							participants: {
								include: {
									account: {
										select: {
											id: true,
											username: true,
										},
									},
								},
							},
						},
					},
				},
			});

			let unreadCount = 0;
			if (participant.lastReadMessageId) {
				const lastReadMessage = await prisma.message.findUnique({
					where: { id: participant.lastReadMessageId },
				});
				const lastReadTime = lastReadMessage?.createdAt || new Date(0);

				unreadCount = await prisma.message.count({
					where: {
						chatId: chatId,
						isDeleted: false,
						senderId: { not: userId },
						createdAt: { gt: lastReadTime },
					},
				});
			} else {
				unreadCount = await prisma.message.count({
					where: {
						chatId: chatId,
						isDeleted: false,
						senderId: { not: userId },
					},
				});
			}
			console.log(
				`On connect, lastReadMessageId =`,
				participant.lastReadMessageId,
			);

			socket.emit("updated chat", {
				chatID: chatId,
				unreadCount: unreadCount,
			});
		} catch (err) {
			console.error("Failed to send updated chat:", err);
		}
	});

	socket.on("create chat", async ({ participants, isGroupChat, name }) => {
		try {
			if (!participants.includes(userId)) {
				participants.push(userId);
			}

			// Get current user's User record
			const account = await prisma.account.findUnique({
				where: { username: userId },
				include: { user: true }
			});
			const user = account?.user;

			// Get other participants' User records
			const otherUsernames = participants.filter(username => username !== userId);
			const otherAccounts = await prisma.account.findMany({
				where: { username: { in: otherUsernames } },
				include: { user: true, company: true }
			});
			const otherEntities = otherAccounts.map(acc => acc.user || acc.company);

			const accountSelf = await prisma.account.findUnique({
				where: { username: userId },
				include: { user: true, company: true }
			});
			const entity = accountSelf?.user || accountSelf?.company;

			if (!entity || otherEntities.some(e => !e)) {
				return socket.emit("error", {
					message: "One or more users do not exist.",
					error: "USER_NOT_FOUND"
				});
			}

			const isStandardOrHolder = entity.tier === 'Standard' || entity.tier === 'Holder';
			if (isStandardOrHolder) {
				if (otherEntities.some(e => e.isInvestor)) {
					return socket.emit("error", {
						message: "Standard/Holder accounts can only initiate chats with non-investors.",
						error: "INSUFFICIENT_PERMISSIONS"
					});
				}
			}

			if (!isGroupChat && participants.length !== 2) {
				return socket.emit("error", {
					message: "Direct chats must have exactly 2 participants",
				});
			}

			if (!isGroupChat) {
				const existingChat = await prisma.chat.findFirst({
					where: {
						isGroupChat: false,
						participants: {
							every: {
								username: {
									in: participants,
								},
							},
						},
						AND: [
							{
								participants: {
									some: {
										username: participants[0],
									},
								},
							},
							{
								participants: {
									some: {
										username: participants[1],
									},
								},
							},
						],
					},
					include: {
						participants: {
							include: {
								account: {
									select: {
										id: true,
										username: true,
									},
								},
							},
						},
					},
				});

				if (existingChat) {
					const otherParticipant = existingChat.participants.find(
						(p) => p !== userId,
					);

					socket.emit("chat created", {
						chatID: existingChat.id,
						name: otherParticipant.user.username,
						isGroupChat: false,
						participants: [
							{
								username: otherParticipant.userId,
								username: otherParticipant.user.username,
							},
						],
						messages: [],
					});
					return;
				}
			}

			const newChat = await prisma.chat.create({
				data: {
					isGroupChat: isGroupChat,
					name: isGroupChat ? name : "chat",
					participants: {
						create: participants.map((participantId) => ({
							username: participantId,
							isAdmin: participantId === userId,
						})),
					},
				},
				include: {
					participants: {
						include: {
							account: {
								select: {
									id: true,
									username: true,
								},
							},
						},
					},
				},
			});

			const chatResponse = {
				chatID: newChat.id,
				name: isGroupChat
					? name
					: newChat.participants.find((p) => p !== userId)?.account.username,
				isGroupChat: isGroupChat,
				participants: newChat.participants
					.filter((p) => p !== userId)
					.map((p) => ({
						username: p,
					})),
				messages: [],
			};

			newChat.participants.forEach((participant) => {
				io.to(participant).emit("chat created", chatResponse);
			});
		} catch (error) {
			console.error("Error creating chat:", error);
			socket.emit("error", { message: "Failed to create chat" });
		}
	});
	const getAttachmentType = (mimeType) => {
		if (mimeType && mimeType.startsWith("image/")) {
			return "IMAGE";
		}
		return "FILE";
	};

	socket.on("send message", async ({ chatId, content, attachments = [] }) => {
		try {
			const participant = await prisma.chatParticipant.findUnique({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
				include: {
					chat: {
						include: {
							participants: true,
						},
					},
				},
			});

			if (!participant) {
				return socket.emit("error", {
					message: "You are not part of this chat",
				});
			}

			const chat = participant.chat;
			const otherUsernames = chat.participants
				.filter(p => p.username !== userId)
				.map(p => p.username);

			const otherAccounts = await prisma.account.findMany({
				where: { username: { in: otherUsernames } },
				include: { user: true, company: true }
			});
			const otherEntities = otherAccounts.map(acc => acc.user || acc.company);

			const accountSelf = await prisma.account.findUnique({
				where: { username: userId },
				include: { user: true, company: true }
			});
			const entity = accountSelf?.user || accountSelf?.company;

			if (!entity || otherEntities.some(e => !e)) {
				return socket.emit("error", {
					message: "One or more users do not exist.",
					error: "USER_NOT_FOUND"
				});
			}

			// Check if user can send messages in this chat
			const canSend = await canSendMessageInChat(entity, chat.participants, chat.isGroupChat);
			if (!canSend) {
				return socket.emit("error", {
					message: "You cannot send messages in this chat. Standard investors can only chat with non-investors unless a Pro user is present.",
					error: "INSUFFICIENT_PERMISSIONS"
				});
			}

			let isRequestMessage = false;
			if (!chat.isGroupChat) {
				const otherParticipant = chat.participants.find(
					(p) => p.username !== userId,
				);

				if (otherParticipant) {
					const areFriends = await prisma.friendRequest.findFirst({
						where: {
							OR: [
								{
									senderId: userId,
									receiverId: otherParticipant.userId,
									status: "ACCEPTED",
								},
								{
									senderId: otherParticipant.userId,
									receiverId: userId,
									status: "ACCEPTED",
								},
							],
						},
					});

					isRequestMessage = !areFriends;
				}
			}

			const message = await prisma.message.create({
				data: {
					chatId: chatId,
					senderId: userId,
					content: content,
					isRequestMessage: isRequestMessage,
					attachments: {
						create: attachments.map((attachment) => ({
							type: getAttachmentType(attachment.mimeType || attachment.type),
							url: attachment.url,
							fileName: attachment.fileName,
							fileSize: attachment.fileSize || 0,
							mimeType: attachment.mimeType || attachment.type,
						})),
					},
				},
				include: {
					sender: {
						select: {
							id: true,
							username: true,
						},
					},
					attachments: true,
				},
			});

			chat.participants.forEach((p) => {
				io.to(p.username).emit("new message", {
					chatId: chatId,
					message: message,
				});
			});
			chat.participants.forEach((p) => {
				if (p.username !== userId) {
					io.to(p.username).emit("chat unread update", {
						chatId: chatId,
					});
				}
			});

			if (isRequestMessage) {
				const otherParticipant = chat.participants.find(
					(p) => p.username !== userId,
				);

				const existingRequest = await prisma.friendRequest.findFirst({
					where: {
						OR: [
							{ senderId: userId, receiverId: otherParticipant.username },
							{ senderId: otherParticipant.username, receiverId: userId },
						],
					},
				});

				if (!existingRequest) {
					const friendRequest = await prisma.friendRequest.create({
						data: {
							senderId: userId,
							receiverId: otherParticipant.username,
							status: "PENDING",
						},
					});

					io.to(otherParticipant.userId).emit("friend request", {
						requestId: friendRequest.id,
						from: {
							userID: userId,
						},
					});
				}
			}
		} catch (error) {
			console.error("Error sending message:", error);
			socket.emit("error", { message: "Failed to send message" });
		}
	});

	socket.on("load more messages", async ({ chatId, before }) => {
		try {
			const participant = await prisma.chatParticipant.findUnique({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
			});

			if (!participant) {
				return socket.emit("error", {
					message: "You are not part of this chat",
				});
			}

			const referenceMessage = await prisma.message.findUnique({
				where: { id: before },
			});

			if (!referenceMessage) {
				return socket.emit("error", { message: "Invalid reference message" });
			}

			const olderMessages = await prisma.message.findMany({
				where: {
					chatId: chatId,
					isDeleted: false,
					createdAt: {
						lt: referenceMessage.createdAt,
						...(deletedAt && { gt: deletedAt }),
					},
				},
				include: {
					sender: {
						select: {
							id: true,
							username: true,
						},
					},
					attachments: true,
					readReceipts: true,
				},
				orderBy: { createdAt: "desc" },
				take: 30,
			});

			socket.emit("more messages", {
				chatId: chatId,
				messages: olderMessages.reverse(),
			});
		} catch (error) {
			console.error("Error loading more messages:", error);
			socket.emit("error", { message: "Failed to load more messages" });
		}
	});

	socket.on("mark as read", async ({ chatId, messageId }) => {
		try {
			await prisma.chatParticipant.update({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
				data: {
					lastReadMessageId: messageId,
				},
			});

			await prisma.readReceipt.upsert({
				where: {
					messageId_username: {
						messageId: messageId,
						username: userId,
					},
				},
				update: {
					readAt: new Date(),
				},
				create: {
					messageId: messageId,
					username: userId,
				},
			});

			const message = await prisma.message.findUnique({
				where: { id: messageId },
				select: { senderId: true },
			});

			if (message && message.senderId !== userId) {
				io.to(message.senderId).emit("message read", {
					chatId: chatId,
					messageId: messageId,
					readBy: userId,
				});
			}
			console.log(
				`Updated lastReadMessageId to ${messageId} for ${userId} in chat ${chatId}`,
			);
		} catch (error) {
			console.error("Error marking message as read:", error);
			socket.emit("error", { message: "Failed to mark message as read" });
		}
	});

	socket.on("delete message", async ({ messageId }) => {
		try {
			const message = await prisma.message.findUnique({
				where: { id: messageId },
				include: {
					chat: {
						include: {
							participants: true,
						},
					},
				},
			});

			if (!message) {
				return socket.emit("error", { message: "Message not found" });
			}

			if (message.senderId !== userId) {
				return socket.emit("error", {
					message: "You can only delete your own messages",
				});
			}

			await prisma.message.update({
				where: { id: messageId },
				data: { isDeleted: true },
			});

			message.chat.participants.forEach((participant) => {
				io.to(participant.userId).emit("message deleted", {
					chatId: message.chatId,
					messageId: messageId,
				});
			});
		} catch (error) {
			console.error("Error deleting message:", error);
			socket.emit("error", { message: "Failed to delete message" });
		}
	});
	socket.on("delete chat", async ({ chatId }) => {
		try {
			const updated = await prisma.chatParticipant.update({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
				data: {
					deletedAt: new Date(),
				},
			});

			socket.emit("chat deleted", { chatId, deletedAt: updated.deletedAt });
		} catch (err) {
			console.error("Error deleting chat for user:", err);
			socket.emit("error", { message: "Failed to delete chat" });
		}
	});

	socket.on("update chat settings", async ({ chatId, settings }) => {
		try {
			const participant = await prisma.chatParticipant.findUnique({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
			});

			if (!participant) {
				return socket.emit("error", {
					message: "You are not part of this chat",
				});
			}

			await prisma.chatParticipant.update({
				where: {
					username_chatId: {
						username: userId,
						chatId: chatId,
					},
				},
				data: {
					isFavorited:
						settings.isFavorited !== undefined
							? settings.isFavorited
							: participant.isFavorited,
					isMuted:
						settings.isMuted !== undefined
							? settings.isMuted
							: participant.isMuted,
					isArchived:
						settings.isArchived !== undefined
							? settings.isArchived
							: participant.isArchived,
				},
			});

			socket.emit("chat settings updated", {
				chatId: chatId,
				settings: {
					isFavorited:
						settings.isFavorited !== undefined
							? settings.isFavorited
							: participant.isFavorited,
					isMuted:
						settings.isMuted !== undefined
							? settings.isMuted
							: participant.isMuted,
					isArchived:
						settings.isArchived !== undefined
							? settings.isArchived
							: participant.isArchived,
				},
			});
		} catch (error) {
			console.error("Error updating chat settings:", error);
			socket.emit("error", { message: "Failed to update chat settings" });
		}
	});
	socket.on("get_read_receipts", async ({ chatId }) => {
		try {
			const messages = await prisma.message.findMany({
				where: {
					chatId: chatId,
					isDeleted: false,
				},
				select: {
					id: true,
					readReceipts: true,
				},
			});
			const receipts = messages.flatMap((message) =>
				message.readReceipts.map((receipt) => ({
					messageId: message.id,
					username: receipt.username,
					readAt: receipt.readAt,
				})),
			);

			socket.emit("read_receipts", {
				chatId: chatId,
				receipts: receipts,
			});
		} catch (error) {
			console.error("Error fetching read receipts:", error);
			socket.emit("error", { message: "Failed to fetch read receipts" });
		}
	});

	socket.on("disconnect", () => {
		console.log(`User disconnected: ${userId}`);
	});
});

const PORT = process.env.SOCKET_PORT || 3002;
httpServer.listen(PORT, () => {
	console.log(`Socket.IO server running on port ${PORT}`);
});

export default io;

async function canChatWith(user, otherEntities) {
	if (!user || !otherEntities || otherEntities.some(e => !e)) return false;
	if (user.isInvestor && user.tier === 'Standard') {
		return otherEntities.every(e => !e.isInvestor);
	}
	return true;
}

// New function to check if user can send messages in a chat
async function canSendMessageInChat(sender, participants, isGroupChat) {
  if (!sender || !participants || participants.some(u => !u)) return false;

  // Get all participant user/company records
  const participantUsernames = participants.map(p => p.username);
  const participantAccounts = await prisma.account.findMany({
    where: { username: { in: participantUsernames } },
    include: { user: true, company: true }
  });
  const participantEntities = participantAccounts.map(acc => acc.user || acc.company).filter(Boolean);

  // Use username for exclusion
  const senderUsername = sender.username;

  // Check if there's a Pro user (user: Pro, company: Hunter) in the chat
  const hasProUser = participantEntities.some(
    e => e.tier === 'Pro' || e.tier === 'Hunter'
  );
  if (hasProUser) {
    return true;
  }

  // For Standard/Holder investors, they can only send messages if all other participants are non-investors
  const isStandardInvestor =
    sender.isInvestor &&
    (sender.tier === 'Standard' || sender.tier === 'Holder');
  if (isStandardInvestor) {
    return participantEntities
      .filter(e => e.id !== sender.id)
      .every(e => !e.isInvestor);
  }

  // For Pro/Hunter and non-investors, allow
  return true;
}

// --- API endpoint: Check if user is a participant in any chat ---
// Express-style handler
export async function userHasChatsHandler(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ hasChats: false });
    const count = await prisma.chatParticipant.count({ where: { username: userId } });
    res.json({ hasChats: count > 0 });
  } catch (error) {
    console.error("Error checking user chat participation:", error);
    res.status(500).json({ hasChats: false });
  }
}
