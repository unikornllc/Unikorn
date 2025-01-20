import axios from "axios";
import prisma from "./db.js";

export const authorizeCalendly = async (req, res) => {
	try {
		const clientId = process.env.CALENDLY_CLIENT_ID;
		const redirectUri = process.env.CALENDLY_REDIRECT_URI;
		const scope = "default";

		const params = new URLSearchParams({
			client_id: clientId,
			response_type: "code",
			redirect_uri: redirectUri,
			scope: scope,
		});

		const calendlyAuthUrl = `https://auth.calendly.com/oauth/authorize?${params.toString()}`;
		res.status(200).json({ redirectUrl: calendlyAuthUrl });
		// res.cookie("calendly_oauth_user", req.decodedUser.id, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === "production",
		// 	sameSite: "strict",
		// 	maxAge: 10 * 60 * 1000,
		// });

		// res.redirect(
		// 	`https://auth.calendly.com/oauth/authorize?${params.toString()}`,
		// );
	} catch (error) {
		console.error("Error authorizing Calendly:", error.message);
		res.status(400).json({ message: "Server error" });
	}
};

export const callbackCalendly = async (req, res) => {
	const code = req.query.code;
	console.log(req.cookies);
	if (!code) {
		return res.status(400).send("Authorization code not provided");
	}

	try {
		const tokenResponse = await axios.post(
			"https://auth.calendly.com/oauth/token",
			{
				grant_type: "authorization_code",
				code,
				client_id: process.env.CALENDLY_CLIENT_ID,
				client_secret: process.env.CALENDLY_CLIENT_SECRET,
				redirect_uri: process.env.CALENDLY_REDIRECT_URI,
			},
			{ headers: { "Content-Type": "application/json" } },
		);

		const { access_token, refresh_token, expires_in, scope, token_type } =
			tokenResponse.data;

		const userResponse = await axios.get("https://api.calendly.com/users/me", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		const calendlyUserURI = userResponse.data.resource.uri;
		console.log(userResponse.data.resource);
		const calendlyOrgURI = userResponse.data.resource.current_organization;

		await prisma.calendly_Integration.upsert({
			where: { userId: req.decodedUser.id },
			update: {
				accessToken: access_token,
				refreshToken: refresh_token,
				tokenType: token_type,
				expiresAt: new Date(Date.now() + expires_in * 1000),
				scope,
				calendlyUserURI,
				calendlyOrgURI,
			},
			create: {
				userId: req.decodedUser.id,
				accessToken: access_token,
				refreshToken: refresh_token,
				tokenType: token_type,
				expiresAt: new Date(Date.now() + expires_in * 1000),
				scope,
				calendlyUserURI,
				calendlyOrgURI,
			},
		});

		res.redirect(process.env.FRONTEND + "/userProfile");
	} catch (error) {
		console.error(
			"Error during OAuth callback:",
			error.response?.data || error.message,
		);
		res.status(400).send("Error during OAuth callback");
	}
};

export const disconnectCalendly = async (req, res) => {
	try {
		const integration = await prisma.calendly_Integration.findUnique({
			where: { userId: req.decodedUser.id },
		});

		if (!integration) {
			return res
				.status(404)
				.json({ message: "Calendly integration not found." });
		}

		if (integration.accessToken) {
			try {
				await axios.post(
					"https://auth.calendly.com/oauth/revoke",
					{
						token: integration.accessToken,
						client_id: process.env.CALENDLY_CLIENT_ID,
						client_secret: process.env.CALENDLY_CLIENT_SECRET,
					},
					{ headers: { "Content-Type": "application/json" } },
				);
			} catch (revokeError) {
				console.warn(
					"Access token revocation failed:",
					revokeError.response?.data || revokeError.message,
				);
			}
		}

		if (integration.refreshToken) {
			try {
				await axios.post(
					"https://auth.calendly.com/oauth/revoke",
					{
						token: integration.refreshToken,
						client_id: process.env.CALENDLY_CLIENT_ID,
						client_secret: process.env.CALENDLY_CLIENT_SECRET,
					},
					{ headers: { "Content-Type": "application/json" } },
				);
			} catch (revokeError) {
				console.warn(
					"Refresh token revocation failed:",
					revokeError.response?.data || revokeError.message,
				);
			}
		}

		await prisma.calendly_Integration.delete({
			where: { userId: req.decodedUser.id },
		});

		res
			.status(200)
			.json({ message: "Calendly account disconnected successfully." });
	} catch (error) {
		console.error(
			"Error disconnecting Calendly:",
			error.response?.data || error.message,
		);
		res.status(400).json({ message: "Error disconnecting Calendly." });
	}
};

export const eventTypeCalendly = async (req, res) => {
	try {
		const data = await calendlyRequest(req.decodedUser.id, {
			method: "GET",
			url: "https://api.calendly.com/event_types",
		});

		res.status(200).json(data);
	} catch (error) {
		res.status(400).json({ message: "Error fetching event types" });
	}
};

export const createEventTypeCalendly = async (req, res) => {
	const { name, description, duration, ...otherData } = req.body;
	try {
		const data = await calendlyRequest(req.decodedUser.id, {
			method: "POST",
			url: "https://api.calendly.com/event_types",
			data: {
				name,
				description,
				duration,
				...otherData,
			},
		});

		res.status(200).json(data);
	} catch (error) {
		res.status(400).json({ message: "Error creating event type" });
	}
};
export const getSchedulingLinkCalendly = async (req, res) => {
	let visitor = req.decodedUser;
	const { username } = req.query;

	try {
		const profileUser = await prisma.user.findUnique({
			where: { username },
			include: { calendly_integration: true },
		});

		if (!profileUser || !profileUser.calendly_integration) {
			return res
				.status(404)
				.json({ message: "User or Calendly integration not found" });
		}

		const data = await calendlyRequest(profileUser.id, {
			method: "GET",
			url: "https://api.calendly.com/event_types",
		});

		const eventType = data.collection[0];
		const schedulingUrl = eventType?.scheduling_url || null;

		res.status(200).json({ schedulingUrl });
	} catch (error) {
		res.status(400).json({ message: "Error fetching scheduling link" });
	}
};
export async function calendlyRequest(userId, options) {
	let integration = await prisma.calendly_Integration.findUnique({
		where: { userId },
	});

	if (!integration) {
		throw new Error("Calendly integration not found");
	}

	if (integration.expiresAt <= new Date()) {
		integration = await refreshAccessToken(userId, integration.refreshToken);
	}

	const headers = {
		Authorization: `Bearer ${integration.accessToken}`,
		"Content-Type": "application/json",
	};

	try {
		const response = await axios({
			...options,
			headers: {
				...headers,
				...options.headers,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Calendly API error:", error.response?.data || error.message);
		throw error;
	}
}

async function refreshAccessToken(userId, refreshToken) {
	try {
		const tokenResponse = await axios.post(
			"https://auth.calendly.com/oauth/token",
			{
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: process.env.CALENDLY_CLIENT_ID,
				client_secret: process.env.CALENDLY_CLIENT_SECRET,
			},
			{ headers: { "Content-Type": "application/json" } },
		);

		const {
			access_token,
			refresh_token: newRefreshToken,
			expires_in,
			scope,
			token_type,
		} = tokenResponse.data;

		const updatedIntegration = await prisma.calendly_Integration.update({
			where: { userId },
			data: {
				accessToken: access_token,
				refreshToken: newRefreshToken,
				tokenType: token_type,
				expiresAt: new Date(Date.now() + expires_in * 1000),
				scope,
			},
		});

		return updatedIntegration;
	} catch (error) {
		console.error(
			"Error refreshing Calendly access token:",
			error.response?.data || error.message,
		);
		throw error;
	}
}
