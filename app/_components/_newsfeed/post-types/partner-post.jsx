import { Badge } from "@/app/_components/_ui/Badge";

export default function PartnerPostContent({ post }) {
	let roleTitle = "";
	let skills = [];
	let mainContent = post.content || "";

	if (post.content) {
		const lines = post.content.split("\n").filter((line) => line.trim());

		if (lines.length > 0) {
			roleTitle = lines[0];

			const skillsLine = lines.find((line) =>
				line.trim().startsWith("Skills:"),
			);
			if (skillsLine) {
				skills = skillsLine
					.replace("Skills:", "")
					.split(",")
					.map((s) => s.trim())
					.filter(Boolean);

				mainContent = lines
					.filter((line) => line !== skillsLine && line !== roleTitle)
					.join("\n");
			} else {
				mainContent = lines.slice(1).join("\n");
			}
		}
	}

	return (
		<div className="space-y-4">
			{roleTitle && <h3 className="text-lg font-semibold">{roleTitle}</h3>}

			{skills.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{skills.map((skill, index) => (
						<Badge key={index} variant="secondary" className="bg-gray-100">
							{skill}
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
