import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import router from "../router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import prisma from "../db.js";

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

export default postingServer;
