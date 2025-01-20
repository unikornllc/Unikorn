"use client";

import { useState, useEffect } from "react";
import socket from "../_utils/socket";
import SelectUsername from "../_components/SelectUsername";
import Chat from "../_components/Chat";

export default function Home() {
  const [sessionID, setSessionID] = useState("");
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);
  const [r, setR] = useState(false);

  useEffect(() => {
    setR(localStorage.getItem("sessionID"));
  }, []);

  useEffect(() => {
    const storedSessionID = localStorage.getItem("sessionID");

    if (storedSessionID) {
      setSessionID(storedSessionID);
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID: storedSessionID };
      socket.connect();
    }

    const handleSession = ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      setSessionID(sessionID);
      socket.userID = userID;
    };

    const handleConnectError = (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    };

    socket.on("session", handleSession);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("session", handleSession);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  const handleUsernameSelection = (username) => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  return (
    <div id="app">
      {!(r || usernameAlreadySelected) ? (
        <SelectUsername onSelect={handleUsernameSelection} />
      ) : (
        <Chat />
      )}
    </div>
  );
}
