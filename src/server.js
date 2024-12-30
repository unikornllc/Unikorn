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

// try {
// 	io.use((socket, next) => {
// 		// const token = socket.handshake.headers.cookie
// 		// 	.split("; ")[0]
// 		// 	.split("token=")[1];
// 		const token =
// 			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBmZTI3NTUyLTcyOTQtNDdiNy1iNzkwLTQ1YTJhYjg3Mjk4MyIsImVtYWlsIjoiYm9vZHlAZ21haWwuY29tIiwiaWF0IjoxNzM1MDY3MTU4fQ.YOQsjbW8MXG2a6CHOO_vQleoTkWAuZx3PzkgAPV8Zio";
// 		if (!token) {
// 			return next(new Error("Authentication error"));
// 		}
// 		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// 			if (err) {
// 				return next(new Error("Authentication error"));
// 			}
// 			socket.user = decoded;
// 			//next();
// 		});
// 		//next();
// 	});

// 	io.on("connection", (socket) => {
// 		console.log(`A user connected: ${socket.id}`);

// 		socket.on("joinRoom", ({ senderId, receiverId }) => {
// 			const room = getRoomName(senderId, receiverId);
// 			socket.join(room);
// 			console.log(`User ${senderId} joined room: ${room}`);
// 		});

// 		socket.on("sendMessage", ({ senderId, receiverId, content }) => {
// 			const room = getRoomName(senderId, receiverId);

// 			io.to(room).emit("newMessage", {
// 				senderId,
// 				receiverId,
// 				content,
// 				timestamp: new Date(),
// 			});

// 			console.log(content);
// 		});

// 		socket.on("disconnect", () => {
// 			console.log(`User disconnected: ${socket.id}`);
// 		});
// 	});

// 	function getRoomName(userId1, userId2) {
// 		return [userId1, userId2].sort().join("_");
// 	}
// } catch (e) {
// 	console.log(e);
// }l

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

io.use(async (socket, next) => {
	const username = socket.handshake.auth.username;
	console.log(socket.handshake.auth.username);
	if (!username) {
		return next(new Error("invalid username"));
	}
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
		connected: true,
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
