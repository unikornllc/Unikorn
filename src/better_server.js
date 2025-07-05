import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import configurePassport from "./passport.js";
import crypto from "crypto";
import { createServer } from "http";
import { Server } from "socket.io";
import InMemorySessionStore from "./sessionStore.js";
import InMemoryMessageStore from "./messageStore.js";
import { generateRefreshToken } from "./authentication/refreshToken.js";
import { generateBasicAccess } from "./authentication/access.js";
import BasicRouter from "./router/profiles.js";

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const randomId = () => crypto.randomBytes(64).toString("hex");

const app = express();
configurePassport(passport);

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
	optionSuccessStatus: 200,
};

const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		credentials: true,
	},
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: false,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
	setTimeout(() => {
		next(new Error("hello"));
	}, 1);
});

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: `${process.env.NEXT_PUBLIC_FRONTEND}/`,
	}),
	(req, res) => {
		const account = req.user;

		// Create a JWT token
		const token = createJWT({
			id: account.id,
			role: "user",
		});

		res.cookie("token", token, {
			httpOnly: process.env.NODE_ENV === "production",
			secure: process.env.NODE_ENV === "production",
			sameSite: "Lax",
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND}/userHome`);
	},
);
app.get("/auth/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			console.error("Error during logout:", err);
			return next(err);
		}
		res.redirect(`${process.env.NEXT_PUBLIC_FRONTEND}/signin`);
	});
});

server.listen(3002, () => {
	console.log("Server is running on port 3002");
});

io.use((socket, next) => {
	const sessionID = socket.handshake.auth.sessionID;
	console.log(socket.handshake.auth.sessionID);
	if (sessionID) {
		// find existing session
		const session = sessionStore.findSession(sessionID);
		if (session) {
			socket.sessionID = sessionID;
			socket.userID = session.userID;
			socket.username = session.username;
			return next();
		}
	}
	const username = socket.handshake.auth.username;
	if (!username) {
		return next(new Error("invalid username"));
	}
	// create new session
	socket.sessionID = randomId();
	socket.userID = randomId();
	socket.username = username;
	next();
});

app.use("/signin", generateRefreshToken);
app.use("/auth/profile/", generateBasicAccess, BasicRouter);

io.on("connection", async (socket) => {
	sessionStore.saveSession(socket.sessionID, {
		sessionID: socket.sessionID,
		userID: socket.userID,
		username: socket.username,
		connected: "online",
	});

	socket.emit("session", {
		sessionID: socket.sessionID,
		userID: socket.userID,
	});

	socket.join(socket.userID);

	const users = [];
	const sessions = sessionStore.findAllSessions();
	const messagesPerUser = new Map();
	messageStore.findMessagesForUser(socket.userID).forEach((message) => {
		const { from, to } = message;
		const otherUser = socket.userID === from ? to : from;
		if (messagesPerUser.has(otherUser)) {
			messagesPerUser.get(otherUser).push(message);
		} else {
			messagesPerUser.set(otherUser, [message]);
		}
	});
	sessions.forEach((session) => {
		users.push({
			userID: session.userID,
			username: session.username,
			connected: session.connected,
			messages: messagesPerUser.get(session.userID) || [],
		});
	});

	console.log("All sessions:", sessions);

	socket.emit("users", users);

	socket.broadcast.emit("user connected", {
		userID: socket.userID,
		username: socket.username,
		connected: "online",
		messages: [],
	});

	socket.on("private message", ({ content, to }) => {
		const message = {
			content,
			from: socket.userID,
			to,
		};
		socket.to(to).to(socket.userID).emit("private message", message);
		messageStore.saveMessage(message);
	});

	socket.on("disconnect", async () => {
		const matchingSockets = await io.in(socket.userID).allSockets();
		const isDisconnected = matchingSockets.size === 0;
		if (isDisconnected) {
			// notify other users
			socket.broadcast.emit("user disconnected", socket.userID);
			// update the connection status of the session
			sessionStore.saveSession(socket.sessionID, {
				sessionID: socket.sessionID,
				userID: socket.userID,
				username: socket.username,
				connected: "offline",
			});
		}
	});
});

export default app;
