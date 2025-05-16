import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import router from "../router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import prisma from "../db.js";
import {
	createPost,
	deletePost,
	getAccountPosts,
	getAllPosts,
	getMyPosts,
	likePost,
	unlikePost,
	addComment,
	deleteComment,
	createRepost,
	deleteRepost,
	createReport,
	deleteReport,
	getReports,
	getPostReports,
	updatePost,
	getMedia,
	deleteMedia,
	voteOption,
	unvoteOption,
} from "./postingController.js";

const postingServer = express();

const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
	optionSuccessStatus: 200,
};

postingServer.use(bodyParser.json());
postingServer.use(cookieParser());
postingServer.use(cors(corsOptions));

postingServer.use(express.json());
postingServer.use(express.urlencoded({ extended: true }));

postingServer.listen(3003, () => {
	console.log("Posting App Listening on PORT 3003");
});

postingServer.get("/userPosts", getMyPosts);
postingServer.get("/allAccountPosts", getAccountPosts);
postingServer.get("/allPosts", getAllPosts);
postingServer.post("/likePost", likePost);
postingServer.post("/unlikePost", unlikePost);
postingServer.post("/createPost", createPost);
postingServer.post("/addComment", addComment);
postingServer.delete("/deletePost", deletePost);
postingServer.delete("/deleteComment", deleteComment);
postingServer.post("/createRepost", createRepost);
postingServer.delete("/deleteRepost", deleteRepost);
postingServer.post("/createReport", createReport);
postingServer.delete("/deleteReport", deleteReport);
postingServer.get("/getReports", getReports);
postingServer.get("/getPostReports", getPostReports);
postingServer.put("/updatePost", updatePost);
postingServer.get("/getMedia", getMedia);
postingServer.delete("/deleteMedia", deleteMedia);
postingServer.post("/voteOption", voteOption);
postingServer.delete("/unvoteOption", unvoteOption);

export default postingServer;
