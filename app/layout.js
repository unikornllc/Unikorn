import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable:"--font-geist-mono",
	weight: "100 900",
});

export const metadata = {
	title: "Unikorn - Where Startups Get Funded",
	description: "Join the most vibrant startup community where founders connect with investors, share insights, and build the future together.",
	icons: {
		icon: [
			{ url: '/unikorn_logo2.png' },
			new URL('/unikorn_logo2.png', 'https://unikornlab.com')
		],
		shortcut: '/unikorn_logo2.png',
		apple: '/unikorn_logo2.png',
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
