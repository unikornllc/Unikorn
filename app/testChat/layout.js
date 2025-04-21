export default function ChatTestLayout({ children }) {
	return (
		<div className="h-screen flex flex-col">
			<header className="bg-white border-b border-gray-200 p-4">
				<h1 className="text-xl font-bold">Chat Test Page</h1>
				<p className="text-sm text-gray-500">
					Test your chat functionality here
				</p>
			</header>

			<main className="flex-1 overflow-hidden">{children}</main>
		</div>
	);
}
