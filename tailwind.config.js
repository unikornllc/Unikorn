/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#7e57c2",
				secondary: "#fff0db",
			},
			animation: {
				bounce: "bounce 2s infinite",
				sparkle: "sparkle 2s infinite",
				wiggle: "wiggle 3s infinite",
			},
			keyframes: {
				sparkle: {
					"0%, 100%": { transform: "translateY(0) scale(1)" },
					"50%": { transform: "translateY(-10px) scale(1.2)" },
				},
				wiggle: {
					"0%, 100%": { transform: "rotate(-3deg)" },
					"50%": { transform: "rotate(3deg)" },
				},
			},
		},
	},
	plugins: [],
};
