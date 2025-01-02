// import axios from "axios";
// import crypto from "crypto";

// export const calendlyAuthorizeEmail = async (req, res) => {
// 	try {
// 		const userEmail = await prisma.user.findUnique({
// 			where: {
// 				id: req.body.userId,
// 			},
// 			select: {
// 				email: true,
// 			},
// 		});
// 		if (!userEmail) {
// 			return res.status(400).json({ message: "User not found" });
// 		}
// 		const authUrl = `https://auth.calendly.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}`;
// 		req.session.email = userEmail;
// 		res.redirect(authUrl);
// 	} catch (e) {
// 		console.error(e);
// 		res.status(400).json({ message: "Error in calendlyAuthorizeEmail" });
// 	}
// };

// app.get("/authorize", calendlyAuthorizeEmail);

// app.get("/callback", async (req, res) => {
// 	const code = req.query.code;
// 	const email = req.session.email;

// 	if (!code || !email) {
// 		return res.status(400).json({ error: "Invalid request" });
// 	}

// 	try {
// 		const response = await axios.post(`${process.env.BASE_CALENDLY_API_URL}/oauth/token`, {
// 			grant_type: "authorization_code",
// 			client_id: process.env.CLIENT_ID,
// 			client_secret: process.env.CLIENT_SECRET,
// 			redirect_uri: process.env.REDIRECT_URI,
// 			code: code,
// 		});

// 		const tokens = response.data;
// 		users[email].calendlyAccessToken = tokens.access_token;
// 		users[email].calendlyRefreshToken = tokens.refresh_token;

// 		const userInfo = await axios.get(`${process.env.BASE_CALENDLY_API_URL}/users/me`, {
// 			headers: { Authorization: `Bearer ${tokens.access_token}` },
// 		});

// 		users[email].calendlyLink = userInfo.data.resource.scheduling_url;
// 		res.json({ message: "Authorization successful!" });
// 	} catch (error) {
// 		res.status(500).json({ error: "Failed to exchange code for tokens" });
// 	}
// });

// app.post("/set_schedule", (req, res) => {
// 	const { email, availableSlots } = req.body;

// 	if (!users[email] || !users[email].calendlyAccessToken) {
// 		return res.status(403).json({ error: "User not authorized" });
// 	}

// 	users[email].availableSlots = availableSlots;
// 	res.json({ message: "Schedule set successfully!" });
// });

// app.get("/view_schedule/:email", (req, res) => {
// 	const email = req.params.email;
// 	if (!users[email]) {
// 		return res.status(404).json({ error: "User not found" });
// 	}

// 	const availableSlots = users[email].availableSlots || [];
// 	res.json({ available_slots: availableSlots });
// });

// app.post("/reserve_slot", (req, res) => {
// 	const { requester_email, target_email, slot } = req.body;

// 	if (
// 		!users[target_email] ||
// 		!users[target_email].availableSlots.includes(slot)
// 	) {
// 		return res
// 			.status(404)
// 			.json({ error: "Target user not found or unavailable" });
// 	}

// 	users[target_email].availableSlots = users[
// 		target_email
// 	].availableSlots.filter((s) => s !== slot);

// 	const notification = {
// 		message: "Meeting slot reserved",
// 		requester: requester_email,
// 		target: target_email,
// 		slot: slot,
// 	};

// 	res.json({
// 		message: "Slot reserved successfully!",
// 		notification: notification,
// 	});
// });

// app.post("/webhook", (req, res) => {
// 	const signature = req.headers["calendly-webhook-signature"];
// 	const payload = req.body;

// 	const verifySignature = (payload, signature, webhookSigningKey) => {
// 		const computedSignature = crypto
// 			.createHmac("sha256", webhookSigningKey)
// 			.update(JSON.stringify(payload))
// 			.digest("hex");
// 		return crypto.timingSafeEqual(
// 			Buffer.from(computedSignature),
// 			Buffer.from(signature),
// 		);
// 	};

// 	if (!verifySignature(payload, signature, process.env.WEBHOOK_SIGNING_KEY)) {
// 		return res.status(403).json({ error: "Invalid webhook signature" });
// 	}

// 	console.log("Received webhook event:", payload);
// 	res.json({ message: "Webhook received successfully" });
// });
