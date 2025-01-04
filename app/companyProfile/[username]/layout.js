import React from "react";

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
};

export default Layout;
