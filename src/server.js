import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cookieParser from "cookie-parser";
import socketio from "socket.io";
import http from "http";
import csrf from "csurf";
import cors from "cors";
import { protect } from "./controllers/auth.js";
import { createUser, verifyUser, signIn } from "./controllers/user.js";
import { verifiedUser } from "./middlewares/verified_mail.js";
const app = express();

// const csrfProtection = csrf();

// // initialize session
// app.use(csrfProtection);

// const server = http.createServer(app);
// const io = socketio(server);

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
	optionSuccessStatus: 200,
};
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

app.post("/createUser", createUser);
app.get("/verifyUser", verifyUser);
app.post("/signIn", verifiedUser, signIn);
app.use(protect, router);

// io.on("connection", (socket) => {
// 	console.log(`A user connected: ${socket.id}`);

// 	socket.on("joinRoom", ({ senderId, receiverId }) => {
// 		const room = getRoomName(senderId, receiverId);
// 		socket.join(room);
// 		console.log(`User ${senderId} joined room: ${room}`);
// 	});

// 	socket.on("sendMessage", ({ senderId, receiverId, content }) => {
// 		const room = getRoomName(senderId, receiverId);

// 		io.to(room).emit("newMessage", {
// 			senderId,
// 			receiverId,
// 			content,
// 			timestamp: new Date(),
// 		});
// 	});

// 	socket.on("disconnect", () => {
// 		console.log(`User disconnected: ${socket.id}`);
// 	});
// });

// function getRoomName(userId1, userId2) {
// 	return [userId1, userId2].sort().join("_");
// }

export default app;
