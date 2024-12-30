import React, { useState } from "react";
import StatusIcon from "@cypress-design/react-statusicon";

const User = ({ user, selected, onSelect }) => {
	const [isSelected, setIsSelected] = useState(selected);

	const handleClick = () => {
		setIsSelected(!isSelected);
		onSelect();
	};

	return (
		<div
			className={`user p-2 ${isSelected ? "bg-blue-600" : ""}`}
			onClick={handleClick}
		>
			<div className="description inline-block">
				<div className="name">
					{user.username} {user.self && "(yourself)"}
				</div>
				<div className="status text-gray-500">
					{user.connected == "online" ? (
						<span>🟢online</span>
					) : (
						<span>🔴offline</span>
					)}
				</div>
			</div>
			{user.hasNewMessages && (
				<div className="new-messages bg-red-600 text-white w-5 h-5 rounded-full text-center float-right mt-2">
					!
				</div>
			)}
		</div>
	);
};

export default User;
