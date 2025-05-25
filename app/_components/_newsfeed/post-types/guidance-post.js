import { Badge } from "@/app/_components/_ui/Badge";

export default function GuidancePostContent({ post }) {
	let areas = [];
	let mainContent = post.content || "";

	if (post.content) {
		const areasMatch = post.content.match(
			/Areas of guidance needed:(.*?)(?:\n|$)/i,
		);

		if (areasMatch && areasMatch[1]) {
			areas = areasMatch[1]
				.split(",")
				.map((area) => area.trim())
				.filter(Boolean);

			mainContent = post.content
				.replace(/Areas of guidance needed:.*?(?:\n|$)/i, "")
				.trim();
		}
	}

	return (
		<div className="space-y-4">
			<Badge
				variant="outline"
				className="bg-purple-50 text-purple-700 border-purple-200"
			>
				Seeking Guidance
			</Badge>

			{areas.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{areas.map((area, index) => (
						<Badge
							key={index}
							variant="secondary"
							className="bg-purple-100 text-purple-800"
						>
							{area}
						</Badge>
					))}
				</div>
			)}

			{mainContent && (
				<div className="text-sm">
					<p>{mainContent}</p>
				</div>
			)}
		</div>
	);
}
