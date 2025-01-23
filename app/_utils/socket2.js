import { io } from "socket.io-client";

const URL = "http://localhost:3002";
const socket2 = io(URL, { autoConnect: false });

socket2.onAny((event, ...args) => {
	console.log(event, args);
});

export default socket2;
