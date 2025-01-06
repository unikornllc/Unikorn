import express from "express";
import bodyParser from "body-parser";
import router from "./router.js";
import cookieParser from "cookie-parser";
import http from "http";
import csrf from "csurf";
import jwt from "jsonwebtoken";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import configurePassport from "./passport.js";
import { protect } from "./controllers/auth.js";
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
import { createJWT } from "./controllers/auth.js";

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
  })
);
app.use(passport.initialize());
app.use(passport.session());

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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
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
      role: "user",
    });

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.FRONTEND}/userHome`);
  }
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
app.get("/verifyUser", verifyUser);
app.post("/signIn", verifiedUser, signIn);
app.get("/checkUsername", checkUsername);
app.get("/checkEmail", checkEmail);
app.get("/suggestUsername", suggestUsername);
app.use(protect, router);
//app.use(router);

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
