import prisma from "../db.js";

export const getAllPosts = async (req, res) => {
	try {
		const page = parseInt(req.query.page ?? "1", 10);
		const limit = parseInt(req.query.limit ?? "20", 10);
		if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
			return res.status(400).json({ message: "Invalid page or limit" });
		}

		const skip = (page - 1) * limit;

		const [posts, total] = await Promise.all([
			prisma.post.findMany({
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					author: {
						select: {
							username: true,
						},
					},
				},
			}),
			prisma.post.count(),
		]);

		res.status(200).json({
			posts,
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

export const createPost = async (req, res) => {
	try {
		const formData = req.body.formData;
		formData.authorId = req.account.id;
		const post = await prisma.post.create({
			data: formData,
		});
		res.status(200).json(post);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updatePost = async (req, res) => {
	try {
		const post = await prisma.post.update({
			where: { id: req.params.id },
			data: { content: req.params.content },
		});
		res.status(200).json(post);
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
				accountId: req.account.id,
				postId: req.params.postId,
			},
		});
		res.status(200).json({ message: "Post unliked successfully" });
	} catch (error) {
		res.status(400).json({ message: error.message });
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
