import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import configurePassport from "./passport.js";
import { protect } from "./auth.js";
import {
	createUser,
	verifyUser,
	signIn,
	suggestUsername,
} from "./controllers/user.js";
import { createCompany } from "./controllers/company_profile.js";
import { verifiedUser } from "./middlewares/verified_mail.js";
import {
	confirmPassword,
	checkEmail,
	checkUsername,
} from "./middlewares/signup.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { ensureAuth, ensureGuest } from "./middlewares/auth.js";
import { createJWT } from "./auth.js";
import crypto from "crypto";
import InMemorySessionStore from "./sessionStore.js";
import InMemoryMessageStore from "./messageStore.js";
import docusignRouter from "./docusign.js";

const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

const randomId = () => crypto.randomBytes(64).toString("hex");

const app = express();
configurePassport(passport);
// const csrfProtection = csrf();

// // initialize session
// app.use(
// 	session({
// 		secret: "my secret",
// 		resave: false,
// 		saveUninitialized: false,
// 		store: store,
// 	}),
// );
// app.use(csrfProtection);

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

// app.use(
// 	session({
// 		secret: randomString.generate({
// 			length: 20,
// 			charset: "alphanumeric",
// 		}),
// 		resave: false,
// 		saveUninitialized: false,
// 		cookie: cookieOptions,
// 		store: sessionStore,
// 	}),
// );

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: `${process.env.FRONTEND}/`,
	}),
	(req, res) => {
		const account = req.user;

		// Create a JWT token
		const token = createJWT({
			id: account.id,
			role: "User",
		});

		res.cookie("token", token, {
			httpOnly: false,
			secure: false,
			sameSite: "Lax",
			maxAge: 24 * 60 * 60 * 1000,
		});
		res.redirect(`${process.env.FRONTEND}/userHome`);
	},
);
app.get("/auth/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			console.error("Error during logout:", err);
			return next(err);
		}
		res.redirect(`${process.env.FRONTEND}/signin`);
	});
});

app.post("/createUser", checkEmail, checkUsername, confirmPassword, createUser);
app.post(
	"/createCompany",
	checkEmail,
	checkUsername,
	confirmPassword,
	createCompany,
);

import {
	verifyRefreshToken,
	verifyCredentialsIfNoRefreshToken,
	verifyAccessToken,
	verifyAccessTokenRoute,
} from "./authentication/auth.js";
import { handleNewDevice } from "./authentication/logindevice.js";
import { generateRefreshTokenIfNeeded } from "./authentication/refreshtoken.js";
import {
	generateAccessTokenIfNeeded,
	verifyRefreshTokenAndGenerateAccessToken,
} from "./authentication/access.js";
import {
	resetPassword,
	resetPasswordRequest,
} from "./authentication/password_reset.js";

app.post(
	"/signin",
	verifyRefreshToken,
	handleNewDevice,
	verifyCredentialsIfNoRefreshToken,
	generateRefreshTokenIfNeeded,
	verifyAccessToken,
	generateAccessTokenIfNeeded,
	(req, res) => {
		res.status(200).json({ message: "Login Successful" });
	},
);

app.use(
	"/api",
	verifyAccessTokenRoute,
	verifyRefreshTokenAndGenerateAccessToken,
	router,
);

app.post("/password-reset-request", resetPasswordRequest);
app.post("/reset-password", resetPassword);

app.get("/verifyUser", verifyUser);
//app.post("/signIn", verifiedUser, signIn);
app.get("/checkUsername", checkUsername);
app.get("/checkEmail", checkEmail);
app.get("/suggestUsername", suggestUsername);
app.use(docusignRouter);

//app.use(protect, router);

//app.use(router);

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
