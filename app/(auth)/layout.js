import LandingNavbar from "@/app/_components/LandingNavbar";

export default function PublicLayout({ children }) {
	return (
		<div>
			<LandingNavbar />

			<main>{children}</main>
		</div>
	);
}
