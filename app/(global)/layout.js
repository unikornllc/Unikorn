import { headers } from "next/headers";
import UserNavbar from "@/app/_components/_user/UserNavbar";


export default async function Layout({ children }) {
	const headersList = await headers();
	const userRole = headersList.get("role");

	return (
		<>
			<UserNavbar userRole={userRole} />
			{children}
		</>
	);
}
