import { useState, useEffect, useRef } from "react";
import socket from "../_utils/socket";
import User from "./User";
import MessagePanel from "./MessagePanel";

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log(users);
  });

  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const initReactiveProperties = (user) => {
    user.hasNewMessages = false;
    user.messages = user.messages || [];
    if (!user.connected) user.connected = "online";
  };

  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find(
        (user) => user.userID === selectedUser.userID
      );
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  }, [users]);

  useEffect(() => {
    // Socket event listeners
    const handleUsers = (usersList) => {
      const updatedUsers = usersList.map((user) => {
        user.messages = user.messages.map((message) => ({
          ...message,
          fromSelf: message.from === socket.userID,
        }));
        user.self = user.userID === socket.userID;
        initReactiveProperties(user);
        return user;
      });

      const sortedUsers = updatedUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        return a.username.localeCompare(b.username);
      });

      setUsers(sortedUsers); // Set the users with updated state
    };

    const handleUserConnected = (user) => {
      initReactiveProperties(user);
      setUsers((prevUsers) => {
        const existingUser = prevUsers.find((u) => u.userID === user.userID);
        if (!existingUser) {
          return [...prevUsers, user]; // Add new user
        } else {
          // Update existing user
          return prevUsers.map((u) =>
            u.userID === user.userID ? { ...u, connected: "online" } : u
          );
        }
      });
    };

    const handleUserDisconnected = (disconnectedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userID === disconnectedUser.userID
            ? { ...user, connected: "offline" }
            : user
        )
      );
      console.log("user disconnect");
    };

    const handlePrivateMessage = ({ content, from }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.userID === from) {
            return {
              ...user,
              messages: [
                ...(user.messages || []),
                { content, fromSelf: false },
              ],
              hasNewMessages: selectedUserRef.current?.userID !== from,
            };
          }
          return user;
        })
      );
    };

    const handleConnect = () => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.self ? { ...user, connected: "online" } : user
        )
      );
    };

    const handleDisconnect = () => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.self ? { ...user, connected: "offline" } : user
        )
      );
      console.log("disconnect");
    };

    // Register event listeners
    socket.on("users", handleUsers);
    socket.on("user connected", handleUserConnected);
    socket.on("user disconnected", handleUserDisconnected);
    socket.on("private message", handlePrivateMessage);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("users", handleUsers);
      socket.off("user connected", handleUserConnected);
      socket.off("user disconnected", handleUserDisconnected);
      socket.off("private message", handlePrivateMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const handleMessage = (content) => {
    if (selectedUser) {
      // Emit the message
      socket.emit("private message", {
        content,
        to: selectedUser.userID,
      });

      // Update the user's messages immutably
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userID === selectedUser.userID
            ? {
                ...user,
                messages: [
                  ...(user.messages || []),
                  { content, fromSelf: true },
                ],
              }
            : user
        )
      );
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.userID === user.userID ? { ...u, hasNewMessages: false } : u
      )
    );
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel */}
      <div className="w-64 bg-purple-900 text-white p-4 overflow-y-auto">
        {users.map((user) => (
          <User
            key={user.userID}
            user={user}
            selected={selectedUser?.userID === user.userID}
            onSelect={() => handleSelectUser(user)}
          />
        ))}
      </div>

      {/* Right Panel */}
      {selectedUser && (
        <MessagePanel
          user={selectedUser}
          onInput={handleMessage}
          className="flex-1 bg-gray-100 p-4"
        />
      )}
    </div>
  );
}
