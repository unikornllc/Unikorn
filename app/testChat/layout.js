export default function ChatTestLayout({ children }) {
	return (
		<div className="h-screen flex flex-col bg-[#f8f9fe]">
			<header className="bg-white border-b border-gray-100 p-4 shadow-sm">
				<h1 className="text-xl font-bold text-[#6366f1]">Chat</h1>
				<p className="text-sm text-gray-500">
					Connect with users and companies
				</p>
			</header>

			<main className="flex-1 overflow-hidden">{children}</main>
		</div>
	);
}
