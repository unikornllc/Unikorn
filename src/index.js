import * as dotenv from "dotenv";
dotenv.config();

import app from "./server.js";
import "./chat/chat.js";

app.listen(3001, () => {
	console.log("hello on http://localhost:3001");
});
