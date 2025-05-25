import prisma from "../db.js";

export const getAllPosts = async (req, res) => {
	try {
		const page = parseInt(req.query.page ?? "1", 10);
		const limit = parseInt(req.query.limit ?? "20", 10);
		if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
			return res.status(400).json({ message: "Invalid page or limit" });
		}

		const skip = (page - 1) * limit;
		const currentUserId = req.account?.id;

		const [posts, total] = await Promise.all([
			prisma.post.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					author: {
						select: {
							username: true,
							role: true,
						},
					},
					media: true,
					round: true,
					event: true,
					poll: {
						include: {
							options: true,
							votes: true,
						},
					},
					document: true,
					likes: true,
					comments: true,
					reposts: true,
					reports: true,
				},
			}),
			prisma.post.count(),
		]);

		const postsWithLikeStatus = posts.map((post) => ({
			...post,
			isLiked: currentUserId
				? post.likes.some((like) => like.accountId === currentUserId)
				: false,
		}));

		res.status(200).json({
			posts: postsWithLikeStatus,
			pagination: {
				page,
				limit,
				total,
				hasMore: skip + posts.length < total,
			},
		});
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ message: error.message });
	}
};

export const createType1Post = async (req, res) => {
	try {
		const {
			authorId = req.account.id,
			content,
			media,
			roundId,
		} = req.body.postData;

		if (!authorId) {
			return res.status(400).json({ message: "Author ID is required" });
		}

		if (!content && (!media || media.length === 0)) {
			return res.status(400).json({
				message: "A pitch post must contain text content, media, or both",
			});
		}

		if (roundId) {
			const round = await prisma.raisingFunds.findUnique({
				where: { id: roundId },
			});
			console.log(round);

			if (!round) {
				return res.status(400).json({ message: "Referenced round not found" });
			}
		}

		const newPost = await prisma.post.create({
			data: {
				type: "LOOKING_FOR_FUNDING",
				content,
				author: {
					connect: { id: authorId },
				},
				round: {
					connect: { id: roundId },
				},
				media: {
					create:
						media?.map((item) => ({
							url: item.url,
							mimeType: item.mimeType,
						})) || [],
				},
			},
			include: {
				media: true,
				round: true,
				author: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(201).json({
			message: "LOOKING_FOR_FUNDING post created successfully",
			post: newPost,
		});
	} catch (error) {
		console.error("Error creating LOOKING_FOR_FUNDING post:", error);
		res.status(500).json({
			message: "Server Error",
			error: error.message,
		});
	}
};

export const createType2Post = async (req, res) => {
	try {
		const { authorId = req.account.id, content } = req.body.postData;

		if (!authorId) {
			return res.status(400).json({ message: "Author ID is required" });
		}

		if (!content) {
			return res.status(400).json({
				message: "Post must contain text content",
			});
		}

		const newPost = await prisma.post.create({
			data: {
				type: "LOOKING_FOR_PARTNER",
				content,
				author: {
					connect: { id: authorId },
				},
			},
			include: {
				media: true,
				round: true,
				author: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(201).json({
			message: "LOOKING_FOR_PARTNER post created successfully",
			post: newPost,
		});
	} catch (error) {
		console.error("Error creating LOOKING_FOR_PARTNER post:", error);
		res.status(500).json({
			message: "Server Error",
			error: error.message,
		});
	}
};

export const createType3Post = async (req, res) => {
	try {
		const { authorId = req.account.id, content } = req.body.postData;

		if (!authorId) {
			return res.status(400).json({ message: "Author ID is required" });
		}

		if (!content) {
			return res.status(400).json({
				message: "Pot must contain text content",
			});
		}

		const newPost = await prisma.post.create({
			data: {
				type: "LOOKING_FOR_GUIDANCE",
				content,
				author: {
					connect: { id: authorId },
				},
			},
			include: {
				media: true,
				round: true,
				author: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(201).json({
			message: "LOOKING_FOR_GUIDANCE post created successfully",
			post: newPost,
		});
	} catch (error) {
		console.error("Error creating LOOKING_FOR_GUIDANCE post:", error);
		res.status(500).json({
			message: "Server Error",
			error: error.message,
		});
	}
};

export const createType4Post = async (req, res) => {
	try {
		const {
			authorId = req.account.id,
			content,
			eventDetails: {
				title,
				description,
				startTime,
				endTime,
				location,
				virtualLink,
				isVirtual,
			},
		} = req.body.postData;

		if (!title || !description || !startTime) {
			return res.status(400).json({
				message: "Missing required event details",
			});
		}

		if (isVirtual && !virtualLink) {
			return res.status(400).json({
				message: "Virtual events require a meeting link",
			});
		}

		if (!isVirtual && !location) {
			return res.status(400).json({
				message: "In-person events require a location",
			});
		}

		const newPost = await prisma.post.create({
			data: {
				type: "EVENT",
				content,
				author: {
					connect: { id: authorId },
				},
				event: {
					create: {
						title,
						description,
						startTime: new Date(startTime),
						endTime: endTime ? new Date(endTime) : null,
						location,
						virtualLink,
						isVirtual,
					},
				},
			},
			include: {
				event: true,
				author: {
					select: {
						username: true,
					},
				},
			},
		});

		res.status(201).json({
			success: true,
			message: "Event created successfully",
			data: newPost,
		});
	} catch (error) {
		console.error("Error creating event post:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create event post",
			error: error.message,
		});
	}
};

export const createType5Post = async (req, res) => {
	try {
		const {
			authorId = req.account.id,
			content,
			pollDetails: { question, options },
		} = req.body.postData;

		if (!authorId) {
			return res.status(400).json({ message: "Author ID is required" });
		}

		if (!question || !question.trim()) {
			return res.status(400).json({ message: "Poll question is required" });
		}

		if (!options || !Array.isArray(options) || options.length < 2) {
			return res.status(400).json({
				message: "At least two poll options are required",
			});
		}

		const uniqueOptions = [...new Set(options.map((opt) => opt.trim()))];
		if (uniqueOptions.length < 2) {
			return res.status(400).json({
				message: "At least two unique poll options are required",
			});
		}

		if (uniqueOptions.some((opt) => !opt)) {
			return res.status(400).json({
				message: "Poll options cannot be empty",
			});
		}

		const newPost = await prisma.$transaction(async (tx) => {
			const post = await tx.post.create({
				data: {
					type: "POLL",
					content,
					author: {
						connect: { id: authorId },
					},
				},
			});

			const poll = await tx.poll.create({
				data: {
					question,
					post: {
						connect: { id: post.id },
					},
					options: {
						create: uniqueOptions.map((optionText) => ({
							text: optionText,
						})),
					},
				},
				include: {
					options: true,
				},
			});

			await tx.post.update({
				where: { id: post.id },
				data: {
					poll: {
						connect: { id: poll.id },
					},
				},
			});

			return tx.post.findUnique({
				where: { id: post.id },
				include: {
					poll: {
						include: {
							options: true,
						},
					},
					author: {
						select: {
							username: true,
						},
					},
				},
			});
		});

		res.status(201).json({
			success: true,
			message: "Poll created successfully",
			data: newPost,
		});
	} catch (error) {
		console.error("Error creating poll post:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create poll",
			error: error.message,
		});
	}
};

export const votePoll = async (req, res) => {
	try {
		const { accountId = req.account.id, optionId, pollId } = req.body;

		if (!accountId || !optionId || !pollId) {
			return res.status(400).json({
				message: "Account ID, option ID, and poll ID are required",
			});
		}

		const option = await prisma.pollOption.findUnique({
			where: { id: optionId },
			include: { poll: true },
		});

		if (!option) {
			return res.status(404).json({ message: "Poll option not found" });
		}

		if (option.poll.id !== pollId) {
			return res.status(400).json({
				message: "Option does not belong to the specified poll",
			});
		}

		const existingVote = await prisma.pollVote.findFirst({
			where: {
				accountId,
				pollId,
			},
		});

		if (existingVote) {
			return res.status(400).json({
				message: "You have already voted in this poll",
			});

			//Allow changing votes
			/*
			await prisma.pollVote.update({
		  		where: { id: existingVote.id },
		  		data: { optionId }
			});
			
			return res.status(200).json({ 
		  	message: "Vote updated successfully" 
		});
		*/
		}

		const vote = await prisma.pollVote.create({
			data: {
				account: {
					connect: { id: accountId },
				},
				option: {
					connect: { id: optionId },
				},
				poll: {
					connect: { id: pollId },
				},
			},
		});

		const pollResults = await prisma.poll.findUnique({
			where: { id: pollId },
			include: {
				options: {
					include: {
						_count: {
							select: { votes: true },
						},
					},
				},
				_count: {
					select: { votes: true },
				},
			},
		});

		res.status(201).json({
			success: true,
			message: "Vote recorded successfully",
			data: {
				vote,
				pollResults,
				userVoteOptionId: optionId,
			},
		});
	} catch (error) {
		console.error("Error voting on poll:", error);
		res.status(500).json({
			success: false,
			message: "Failed to record vote",
			error: error.message,
		});
	}
};

export const checkUserVote = async (req, res) => {
	try {
		const { pollId } = req.params;
		const accountId = req.account?.id;

		if (!accountId) {
			return res.status(401).json({ message: "Authentication required" });
		}

		if (!pollId) {
			return res.status(400).json({ message: "Poll ID is required" });
		}

		const poll = await prisma.poll.findUnique({
			where: { id: pollId },
			include: {
				options: {
					include: {
						_count: {
							select: { votes: true },
						},
						votes: {
							where: {
								accountId,
							},
							take: 1,
						},
					},
				},
				_count: {
					select: { votes: true },
				},
			},
		});

		if (!poll) {
			return res.status(404).json({ message: "Poll not found" });
		}

		const userVote = await prisma.pollVote.findFirst({
			where: {
				accountId,
				pollId,
			},
			include: {
				option: true,
			},
		});

		const hasVoted = !!userVote;

		const totalVotes = poll._count.votes;
		const results = poll.options.map((option) => {
			const voteCount = option._count.votes;
			const percentage =
				totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

			return {
				id: option.id,
				text: option.text,
				votes: voteCount,
				percentage,
				userVoted: option.votes.length > 0,
			};
		});

		res.status(200).json({
			hasVoted,
			userVoteOptionId: userVote?.optionId || null,
			results,
			totalVotes,
			poll: {
				id: poll.id,
				question: poll.question,
			},
		});
	} catch (error) {
		console.error("Error checking user vote:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createType6Post = async (req, res) => {
	try {
		const {
			authorId = req.account.id,
			content,
			documentDetails: { title, fileUrl, fileType },
		} = req.body.postData;

		if (!authorId) {
			return res.status(400).json({ message: "Author ID is required" });
		}

		if (!title) {
			return res.status(400).json({ message: "Document title is required" });
		}

		if (!fileUrl) {
			return res.status(400).json({ message: "Document file URL is required" });
		}

		const allowedTypes = ["pdf", "ppt", "pptx", "doc", "docx", "xls", "xlsx"];
		const fileExtension = fileType.toLowerCase();

		if (
			!allowedTypes.includes(fileExtension) &&
			!allowedTypes.some((type) => fileType.includes(`/${type}`))
		) {
			return res.status(400).json({
				message:
					"Invalid document type. Allowed types: PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX",
			});
		}

		const newPost = await prisma.post.create({
			data: {
				type: "DOCUMENT",
				content,
				author: {
					connect: { id: authorId },
				},
				document: {
					create: {
						title,
						fileUrl,
						fileType: fileExtension,
					},
				},
			},
			include: {
				document: true,
				author: {
					select: {
						id: true,
						username: true,
						profilePicture: true,
					},
				},
			},
		});

		res.status(201).json({
			success: true,
			message: "Document post created successfully",
			data: newPost,
		});
	} catch (error) {
		console.error("Error creating document post:", error);
		res.status(500).json({
			success: false,
			message: "Failed to create document post",
			error: error.message,
		});
	}
};

export const getDocumentPostById = async (req, res) => {
	try {
		const { id } = req.params;

		const documentPost = await prisma.post.findUnique({
			where: {
				id,
				type: "DOCUMENT",
			},
			include: {
				document: true,
				author: {
					select: {
						id: true,
						username: true,
						profilePicture: true,
					},
				},
				_count: {
					select: {
						likes: true,
						comments: true,
						reposts: true,
					},
				},
			},
		});

		if (!documentPost) {
			return res.status(404).json({ message: "Document post not found" });
		}

		res.status(200).json({
			success: true,
			data: documentPost,
		});
	} catch (error) {
		console.error("Error fetching document post:", error);
		res.status(500).json({
			success: false,
			message: "Failed to fetch document post",
			error: error.message,
		});
	}
};

export const getAccountPosts = async (req, res) => {
	try {
		const posts = await prisma.post.findMany({
			where: {
				authorId: req.params.accountId,
			},
		});
		res.status(200).json(posts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getMyPosts = async (req, res) => {
	try {
		const posts = await prisma.post.findMany({
			where: {
				authorId: req.account.id,
			},
		});
		res.status(200).json(posts);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		await prisma.post.delete({
			where: {
				id: req.params.id,
			},
		});
		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const likePost = async (req, res) => {
	try {
		const like = await prisma.like.create({
			data: {
				accountId: req.account.id,
				postId: req.body.postId,
			},
		});
		res.status(200).json(like);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const unlikePost = async (req, res) => {
	try {
		await prisma.like.delete({
			where: {
				accountId_postId: {
					accountId: req.account.id,
					postId: req.body.postId,
				},
			},
		});
		res.status(200).json({ message: "Post unliked successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getComments = async (req, res) => {
	try {
		const { postId } = req.params;

		const post = await prisma.post.findUnique({
			where: { id: postId },
			include: {
				author: {
					select: {
						username: true,
					},
				},
				media: true,
				round: true,
				event: true,
				poll: {
					include: {
						options: true,
						votes: true,
					},
				},
				document: true,
				likes: true,
				comments: true,
				reposts: true,
				reports: true,
			},
		});

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const comments = await prisma.comment.findMany({
			where: { postId: postId },
			include: {
				author: {
					select: { username: true },
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return res.status(200).json({ post, comments });
	} catch (error) {
		console.error("getPostWithComments error:", error);
		return res.status(500).json({ message: "Internal server error" });
	}
};

export const addComment = async (req, res) => {
	try {
		const comment = await prisma.comment.create({
			data: {
				authorId: req.account.id,
				postId: req.body.postId,
				content: req.body.content,
			},
		});
		res.status(200).json(comment);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteComment = async (req, res) => {
	try {
		await prisma.comment.delete({
			where: {
				id: req.params.id,
			},
		});
		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const createRepost = async (req, res) => {
	try {
		const repost = await prisma.repost.create({
			data: {
				accountId: req.account.id,
				postId: req.body.postId,
			},
		});
		res.status(201).json(repost);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteRepost = async (req, res) => {
	try {
		await prisma.repost.delete({
			where: {
				accountId_postId: {
					accountId: req.account.id,
					postId: req.params.postId,
				},
			},
		});
		res.status(200).json({ message: "Repost removed successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getReports = async (req, res) => {
	try {
		const report = await prisma.report.findMany();
		res.status(200).json(report);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getPostReports = async (req, res) => {
	try {
		const report = await prisma.report.findMany({
			where: { postId: req.params.postId },
		});
		res.status(200).json(report);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const createReport = async (req, res) => {
	try {
		const report = await prisma.report.create({
			data: {
				reporterId: req.account.id,
				postId: req.body.postId,
				reason: req.body.reason,
				description: req.body.description || null,
			},
		});
		res.status(201).json(report);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteReport = async (req, res) => {
	try {
		await prisma.report.delete({ where: { id: req.params.id } });
		res.status(200).json({ message: "Report deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const getMedia = async (req, res) => {
	try {
		const media = await prisma.media.findUnique({
			where: { id: req.params.id },
		});
		if (!media) return res.status(403).json({ message: "Media not found" });
		res.status(200).json(media);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteMedia = async (req, res) => {
	try {
		await prisma.media.delete({ where: { id: req.params.id } });
		res.status(200).json({ message: "Media deleted successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const voteOption = async (req, res) => {
	try {
		const vote = await prisma.pollVote.create({
			data: {
				accountId: req.account.id,
				optionId: req.body.optionId,
			},
		});
		res.status(201).json(vote);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const unvoteOption = async (req, res) => {
	try {
		await prisma.pollVote.delete({
			where: {
				accountId_optionId: {
					accountId: req.account.id,
					optionId: req.params.optionId,
				},
			},
		});
		res.status(200).json({ message: "Vote removed successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};
