"use client";
export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-secondary to-primary">
			<div className="relative">
				<svg
					className="w-48 h-48 animate-pulse"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 100 100"
				>
					<ellipse
						cx="50"
						cy="60"
						rx="25"
						ry="15"
						fill="#fff0db"
						stroke="#7e57c2"
						strokeWidth="2"
					/>
					<circle
						cx="70"
						cy="40"
						r="10"
						fill="#fff0db"
						stroke="#7e57c2"
						strokeWidth="2"
					/>
					<polygon
						points="70,20 74,40 66,40"
						fill="#7e57c2"
						className="animate-bounce"
					/>
					<path
						d="M25 60 C15 70, 10 50, 20 40"
						fill="none"
						stroke="#7e57c2"
						strokeWidth="3"
						className="animate-wiggle"
					/>
					<line
						x1="40"
						y1="75"
						x2="38"
						y2="85"
						stroke="#7e57c2"
						strokeWidth="2"
					/>
					<line
						x1="60"
						y1="75"
						x2="62"
						y2="85"
						stroke="#7e57c2"
						strokeWidth="2"
					/>
				</svg>

				<div className="absolute inset-0 flex justify-center items-center space-x-4">
					<div className="h-4 w-4 rounded-full bg-primary animate-sparkle"></div>
					<div className="h-6 w-6 rounded-full bg-secondary animate-sparkle"></div>
					<div className="h-3 w-3 rounded-full bg-primary animate-sparkle"></div>
				</div>

				<div></div>
				<p className="mt-6 text-secondary text-lg font-bold animate-pulse">
					Summoning the Unikorn...
				</p>
			</div>
		</div>
	);
}
