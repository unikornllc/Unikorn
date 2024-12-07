"use client";

export default function Home() {
	return (
		<div className="min-h-screen bg-[#fff0db]">
			<div className="container mx-auto p-4 flex space-x-4">
				<aside className="w-full md:w-1/4 bg-gray-100 p-4 rounded-lg shadow">
					<img
						src="/profile.jpg"
						alt="Profile"
						className="rounded-full w-24 mx-auto"
					/>
					<h2 className="text-center mt-4 font-bold">Jane Doe</h2>
					<p className="text-center text-sm text-gray-600">Web Developer</p>
				</aside>
				<div className="w-full md:w-2/3 mx-auto">
					<div className="bg-white shadow rounded-lg p-4 mb-4">
						<p className="text-gray-700">Welcome to Unikorn!</p>
					</div>
					<div className="bg-white shadow rounded-lg p-4">
						<p className="font-bold">John Doe</p>
						<p>Excited to join a new role at XYZ!</p>
					</div>
				</div>
			</div>
		</div>
	);
}
