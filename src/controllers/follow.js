import prisma from "../db.js";

export const getFollowing = async (req, res) => {
	try {
		const account = await prisma.account.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				following: { account: true },
			},
			select: {
				following: { select: { account: { select: { username: true, role: true } } } },
			}
		});
		if (account.following.length === 0) {
			return res.status(200).json({ users: [], companies: [] });
		}

		if (!account) {
			return res.status(400).json({ message: "User or company not found" });
		}

		const following = {
			users: [],
			companies: [],
		};

		account.following.forEach((follow) => {
			if (follow.account.role === "User") {
				following.users.push(follow.account.username);
			} else {
				following.companies.push(follow.account.username);
			}
		});

		res
			.status(200)
			.json({ ...following });
	} catch (e) {
		console.error(e);
		res
			.status(400)
			.json({ message: "Error fetching following users and companies" });
	}
};

export const getFollowers = async (req, res) => {
	try {
		const account = await prisma.account.findUnique({
			where: {
				username: req.query.username,
			},
			include: {
				followedBy: { account: true },
			},
			select: {
				followedBy: { select: { account: { select: { username: true, role: true } } } },
			}
		});
		if (account.followedBy.length === 0) {
			return res.status(200).json({ users: [], companies: [] });
		}

		if (!account) {
			return res.status(400).json({ message: "User or company not found" });
		}

		const followedBy = {
			users: [],
			companies: [],
		};

		account.followedBy.forEach((follow) => {
			if (follow.account.role === "User") {
				followedBy.users.push(follow.account.username);
			} else {
				followedBy.companies.push(follow.account.username);
			}
		});

		res
			.status(200)
			.json({ ...followedBy });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching followers" });
	}
};

export const followUser = async (req, res) => {
	try {
		const follow = await prisma.account.findUnique({
			where: {
				username: req.body.username,
			},
			select: { id: true, followedBy: true },
		});

		if (!follow) {
			res.status(400).json({ message: "User or company not found" });
		}
		const isAlreadyFollowing = follow.followedBy.some((entry) =>
			entry.followerId === req.account.id
		);
		if (isAlreadyFollowing) {
			res.status(400).json({ message: "User already followed" });
		} else {
			await prisma.follow.create({
				data: {
					followerId: req.account.id,
					followingId: follow.id,
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
		const follow = await prisma.company.findFirst({
			where: {
				account: {
					username: req.query.username,
				}

			},
			select: {
				account: {
					select: {
						followedBy: true,
					}
				}
			}
		});
		if (!follow) {
			res.status(400).json({ message: "User not found" });
		}
		const isFollowing = follow.account.followedBy.some((entry) =>
			entry.followerId === req.account.id
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
		const unfollow = await prisma.account.findUnique({
			where: { username: req.body.username },
			select: { id: true, followedBy: true },
		});

		if (!unfollow) {
			return res.status(402).json({ message: "User or company not found" });
		}
		const isFollowing = unfollow.followedBy.some((entry) =>
			entry.followerId === req.account.id
		);

		if (!isFollowing) {
			return res.status(200).json({ message: "User already not followed" });
		}

		await prisma.follow.deleteMany({
			where: {
				followerId: req.account.id,
				followingId: unfollow.id,
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


export const isFollowingCompany = async (req, res) => {
	try {
		const company = await prisma.company.findFirst({
			where: {
				account: {
					username: req.query.username,
				}

			},
			select: {
				id: true,
			},
		});
		const isFollowing = await prisma.userFollowsCompany.findFirst({
			where: {
				companyId: company.id,
				userId: req.account.id,
			},
		});

		isFollowing
			? res.status(200).json({ isFollowing: true })
			: res.status(200).json({ isFollowing: false });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching Profile" });
	}
};

export const followCompany = async (req, res) => {
	try {
		const company = await prisma.company.findFirst({
			where: {
				account: {
					username: req.body.username,
				}

			},
			select: {
				id: true,
			},
		});
		await prisma.userFollowsCompany.create({
			data: {
				companyId: company.id,
				userId: req.account.id,
			},
		});
		res.status(200).json({ message: "Company followed successfully" });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error following company" });
	}
};

export const unfollowCompany = async (req, res) => {
	try {
		const company = await prisma.company.findFirst({
			where: {
				account: {
					username: req.body.username,
				}
			},
			select: {
				id: true,
			},
		});
		await prisma.userFollowsCompany.deleteMany({
			where: {
				companyId: company.id,
				userId: req.account.id,
			},
		});
		res.status(200).json({ message: "Company unfollowed successfully" });
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error unfollowing company" });
	}
};

export const getFollowingCompanies = async (req, res) => {
	try {
		const followingCompanies = await prisma.userFollowsCompany.findMany({
			where: {
				userId: req.account.id,
			},
			select: {
				company: true,
			},
		});
		res.status(200).json(followingCompanies.map((c) => c.company.username));
	} catch (e) {
		console.error(e);
		res.status(400).json({ message: "Error fetching following companies" });
	}
};
