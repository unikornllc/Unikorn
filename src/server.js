import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cookieParser from "cookie-parser";
import socketio from "socket.io";
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

const server = http.createServer(app);
const io = socketio(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
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

io.use((socket, next) => {
	const token = socket.handshake.headers.cookie
		.split("; ")[0]
		.split("token=")[1];
	//console.log(token);
	if (!token) {
		return next(new Error("Authentication error"));
	}

	// Verify the token (for example, using JWT)
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return next(new Error("Authentication error"));
		}
		socket.user = decoded; // Attach the decoded user data to the socket
		next();
	});
});

io.on("connection", (socket) => {
	console.log(`A user connected: ${socket.id}`);

	socket.on("joinRoom", ({ senderId, receiverId }) => {
		const room = getRoomName(senderId, receiverId);
		socket.join(room);
		console.log(`User ${senderId} joined room: ${room}`);
	});

	socket.on("sendMessage", ({ senderId, receiverId, content }) => {
		const room = getRoomName(senderId, receiverId);

		io.to(room).emit("newMessage", {
			senderId,
			receiverId,
			content,
			timestamp: new Date(),
		});

		console.log(content);
	});

	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.id}`);
	});
});

function getRoomName(userId1, userId2) {
	return [userId1, userId2].sort().join("_");
}

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

export default app;
