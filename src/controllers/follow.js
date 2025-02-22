import prisma from "../db.js";

export const getFollowing = async (req, res) => {
	try {
		let followers;
		if (req.query.isUser === "true") {
			followers = await prisma.user.findUnique({
				where: {
					username: req.query.username,
				},
				select: {
					followingUsers: true,
				},
			});
			if (followers.followingUsers.length === 0) {
				return res.status(200).json({ users: [], companies: [] });
			}
		} else {
			followers = await prisma.company_Profile.findUnique({
				where: {
					username: req.query.username,
				},
				select: {
					followingCompanies: true,
				},
			});
			if (followers.followingCompanies.length === 0) {
				return res.status(200).json({ users: [], companies: [] });
			}
		}
		if (!followers) {
			return res.status(400).json({ message: "User or company not found" });
		}

		const followingIds = {
			users: [],
			companies: [],
		};

		if (req.query.isUser === "true") {
			followers.followingUsers.forEach((follow) => {
				if (follow.FollowinguserId) {
					followingIds.users.push(follow.FollowinguserId);
				} else if (follow.FollowingcompanyId) {
					followingIds.companies.push(follow.FollowingcompanyId);
				}
			});
		} else {
			followers.followingCompanies.forEach((follow) => {
				if (follow.FollowinguserId) {
					followingIds.users.push(follow.FollowinguserId);
				} else if (follow.FollowingcompanyId) {
					followingIds.companies.push(follow.FollowingcompanyId);
				}
			});
		}

		const [followingUsers, followingCompanies] = await prisma.$transaction([
			prisma.user.findMany({
				where: { id: { in: followingIds.users } },
				select: { username: true },
			}),
			prisma.company_Profile.findMany({
				where: { id: { in: followingIds.companies } },
				select: { username: true },
			}),
		]);

		res
			.status(200)
			.json({ users: followingUsers, companies: followingCompanies });
	} catch (e) {
		console.error(e);
		res
			.status(400)
			.json({ message: "Error fetching following users and companies" });
	}
};

export const getFollowers = async (req, res) => {
	try {
		let followers;
		if (req.query.isUser === "true") {
			followers = await prisma.user.findUnique({
				where: {
					username: req.query.username,
				},
				select: {
					followedByUsers: true,
				},
			});
			if (followers.followedByUsers.length === 0) {
				return res.status(200).json({ users: [], companies: [] });
			}
		} else {
			followers = await prisma.company_Profile.findUnique({
				where: {
					username: req.query.username,
				},
				select: {
					followedByCompanies: true,
				},
			});
			if (followers.followedByCompanies.length === 0) {
				return res.status(200).json({ users: [], companies: [] });
			}
		}
		if (!followers) {
			return res.status(400).json({ message: "User or company not found" });
		}
		const followersId = {
			users: [],
			companies: [],
		};
		if (req.query.isUser === "true") {
			followers.followedByUsers.forEach((follow) => {
				if (follow.FolloweruserId) {
					followersId.users.push(follow.FolloweruserId);
				} else if (follow.FollowercompanyId) {
					followersId.companies.push(follow.FollowercompanyId);
				}
			});
		} else {
			followers.followedByCompanies.forEach((follow) => {
				if (follow.FolloweruserId) {
					followersId.users.push(follow.FolloweruserId);
				} else if (follow.FollowercompanyId) {
					followersId.companies.push(follow.FollowercompanyId);
				}
			});
		}
		const [followerUsers, followerCompanies] = await prisma.$transaction([
			prisma.user.findMany({
				where: { id: { in: followersId.users } },
				select: { username: true },
			}),
			prisma.company_Profile.findMany({
				where: { id: { in: followersId.companies } },
				select: { username: true },
			}),
		]);
		res
			.status(200)
			.json({ users: followerUsers, companies: followerCompanies });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching followers" });
	}
};

export const followUser = async (req, res) => {
	try {
		let follow;
		let isAlreadyFollowing;
		if (req.body.isUser === true) {
			follow = await prisma.user.findUnique({
				where: {
					username: req.body.username,
				},
				select: { id: true, followedByUsers: true },
			});
			isAlreadyFollowing = follow.followedByUsers.some((entry) =>
				req.decodedUser.role === "User"
					? entry.FolloweruserId === req.decodedUser.id
					: entry.FollowercompanyId === req.decodedUser.id,
			);
		} else {
			follow = await prisma.company_Profile.findUnique({
				where: {
					username: req.body.username,
				},
				select: { id: true, followedByCompanies: true },
			});
			isAlreadyFollowing = follow.followedByCompanies.some((entry) =>
				req.decodedUser.role === "User"
					? entry.FolloweruserId === req.decodedUser.id
					: entry.FollowercompanyId === req.decodedUser.id,
			);
		}
		if (!follow) {
			res.status(400).json({ message: "User or company not found" });
		}
		if (isAlreadyFollowing) {
			res.status(400).json({ message: "User already followed" });
		} else {
			await prisma.follow.create({
				data: {
					...(req.body.isUser === true
						? { FollowinguserId: follow.id }
						: { FollowingcompanyId: follow.id }),
					...(req.decodedUser.role === "User"
						? { FolloweruserId: req.decodedUser.id }
						: { FollowercompanyId: req.decodedUser.id }),
				},
			});

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error following user" });
	}
};

export const isFollowingUser = async (req, res) => {
	try {
		let follow;
		if (req.query.isUser === "true") {
			follow = await prisma.user.findUnique({
				where: {
					username: req.query.username,
				},
				select: {
					followedByUsers: true,
				},
			});
		} else {
			follow = await prisma.company_Profile.findUnique({
				where: {
					username: req.query.username,
				},
				select: {
					followedByCompanies: true,
				},
			});
		}
		if (!follow) {
			res.status(400).json({ message: "User not found" });
		}
		const followedBy =
			req.query.isUser === true
				? follow.followedByUsers
				: follow.followedByCompanies;

		const isFollowing = followedBy.some((entry) =>
			req.decodedUser.role === "User"
				? entry.FolloweruserId === req.decodedUser.id
				: entry.FollowercompanyId === req.decodedUser.id,
		);
		isFollowing
			? res.status(200).json({ isFollowing: true })
			: res.status(200).json({ isFollowing: false });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error checking follow user" });
	}
};

export const unfollowUser = async (req, res) => {
	try {
		let unfollow;
		let isFollowing;
		if (req.body.isUser === true) {
			unfollow = await prisma.user.findUnique({
				where: { username: req.body.username },
				select: { id: true, followedByUsers: true },
			});
			isFollowing = unfollow.followedByUsers.some((entry) =>
				req.decodedUser.role === "User"
					? entry.FolloweruserId === req.decodedUser.id
					: entry.FollowercompanyId === req.decodedUser.id,
			);
		} else {
			unfollow = await prisma.company_Profile.findUnique({
				where: { username: req.body.username },
				select: { id: true, followedByCompanies: true },
			});
			isFollowing = unfollow.followedByCompanies.some((entry) =>
				req.decodedUser.role === "User"
					? entry.FolloweruserId === req.decodedUser.id
					: entry.FollowercompanyId === req.decodedUser.id,
			);
		}
		if (!unfollow) {
			return res.status(402).json({ message: "User or company not found" });
		}

		if (!isFollowing) {
			return res.status(200).json({ message: "User already not followed" });
		}

		await prisma.follow.deleteMany({
			where: {
				...(req.body.isUser === true
					? { FollowinguserId: unfollow.id }
					: { FollowingcompanyId: unfollow.id }),
				...(req.decodedUser.role === "User"
					? { FolloweruserId: req.decodedUser.id }
					: { FollowercompanyId: req.decodedUser.id }),
			},
		});
		console.log("User unfollowed successfully");
		return res
			.status(200)
			.json({ message: "User or company unfollowed successfully" });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Error unfollowing user or company" });
	}
};