import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cookieParser from "cookie-parser";
import http from "http";
import csrf from "csurf";
import jwt from "jsonwebtoken";
import cors from "cors";
import { protect } from "./controllers/auth.js";
import {
	createUser,
	verifyUser,
	signIn,
	checkUsername,
	checkEmail,
	suggestUsername,
} from "./controllers/user.js";
import { verifiedUser } from "./middlewares/verified_mail.js";
import { confirmPassword } from "./middlewares/signup.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

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

app.get("/", (req, res, next) => {
	setTimeout(() => {
		next(new Error("hello"));
	}, 1);
});

const cookieOptions = {
	httpOnly: false,
	secure: false,
	maxAge: 24 * 60 * 60 * 1000,
	sameSite: "lax",
};

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

app.post("/createUser", confirmPassword, createUser);
app.get("/verifyUser", verifyUser);
app.post("/signIn", verifiedUser, signIn);
app.get("/checkUsername", checkUsername);
app.get("/checkEmail", checkEmail);
app.get("/suggestUsername", suggestUsername);
app.use(protect, router);

server.listen(3002, () => {
	console.log("Server is running on port 3002");
});

io.use((socket, next) => {
	const sessionID = socket.handshake.auth.sessionID;
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
	const users = [];
	for (let [id, socket] of io.of("/").sockets) {
		users.push({
			userID: id,
			username: socket.username,
			connected: "online",
			messages: [],
		});
	}

	socket.emit("users", users);

	socket.broadcast.emit("user connected", {
		userID: socket.id,
		username: socket.username,
		connected: "online",
		messages: [],
	});

	socket.on("private message", ({ content, to }) => {
		socket.to(to).emit("private message", {
			content,
			from: socket.id,
		});
		console.log(users);
	});

	socket.on("disconnect", async () => {
		socket.broadcast.emit("user disconnected", {
			userID: socket.id,
			username: socket.username,
			connected: "offline",
		});
		console.log("server disconnect");
	});
});

export default app;
