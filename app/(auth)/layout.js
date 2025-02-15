import Navbar from "@/app/_components/_ui/Navbar";

export default function PublicLayout({ children }) {
	return (
		<div>
			<Navbar />

			<main>{children}</main>
		</div>
	);
}


