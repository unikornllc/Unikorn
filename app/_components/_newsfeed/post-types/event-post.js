import { Badge } from "@/app/_components/_ui/Badge";
import { Calendar, MapPin, Video } from "lucide-react";
import { formatDate } from "@/app/_utils/utils";

export default function EventPostContent({ post }) {
	const event = post.event || null;

	if (!event) {
		return <p>{post.content}</p>;
	}

	const startDate = event.startTime ? new Date(event.startTime) : null;
	const endDate = event.endTime ? new Date(event.endTime) : null;

	const formatTime = (date) => {
		if (!date) return "";
		return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">{event.title}</h3>
				<Badge
					variant={event.isVirtual ? "outline" : "secondary"}
					className={event.isVirtual ? "bg-blue-50 text-blue-700" : ""}
				>
					{event.isVirtual ? "Virtual" : "In Person"}
				</Badge>
			</div>

			{startDate && (
				<div className="flex items-center text-sm text-gray-600">
					<Calendar className="h-4 w-4 mr-2" />
					<span>
						{formatDate(startDate)}
						{startDate && ` at ${formatTime(startDate)}`}
						{endDate && ` - ${formatTime(endDate)}`}
					</span>
				</div>
			)}

			{event.isVirtual && event.virtualLink ? (
				<div className="flex items-center text-sm text-gray-600">
					<Video className="h-4 w-4 mr-2" />
					<a
						href={event.virtualLink}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline"
					>
						Join virtual event
					</a>
				</div>
			) : event.location ? (
				<div className="flex items-center text-sm text-gray-600">
					<MapPin className="h-4 w-4 mr-2" />
					<span>{event.location}</span>
				</div>
			) : null}

			{event.description && (
				<div className="text-sm mt-2 pt-2 border-t">
					<p>{event.description}</p>
				</div>
			)}
		</div>
	);
}
