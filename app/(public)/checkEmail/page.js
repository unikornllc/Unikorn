import Link from "next/link";

export default function CheckEmail() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#fff0db]">
			<h1 className="text-2xl font-bold text-center text-gray-700">
				Check your email for a verification link.
			</h1>
			<Link
				className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
				href="/signin"
			>
				Go to Login
			</Link>
		</div>
	);
}
