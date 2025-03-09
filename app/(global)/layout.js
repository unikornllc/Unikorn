import { headers } from "next/headers";
import Navbar from "@/app/_components/Navbar";
import { Toaster } from "@/app/_components/_ui/Toaster";
import { ToastProvider } from "@/app/_components/_hooks/useToast";

export default async function Layout({ children }) {
	const headersList = await headers();
	const userRole = headersList.get("role");

	return (
		<ToastProvider>
			<Navbar userRole={userRole} />
			{children}
			<Toaster />
		</ToastProvider>
	);
}
