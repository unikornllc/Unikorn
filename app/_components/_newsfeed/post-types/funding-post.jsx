import { Badge } from "@/app/_components/_ui/Badge";
import { formatCurrency } from "@/app/_utils/utils";

export default function FundingPostContent({ post }) {
	const fundingRound = post.round || null;

	return (
		<div className="space-y-4">
			{fundingRound && (
				<Badge
					variant="outline"
					className="bg-blue-50 text-blue-700 border-blue-200"
				>
					{fundingRound.name || "Funding Round"}
				</Badge>
			)}

			{post.content && (
				<div className="text-sm">
					<p>{post.content}</p>
				</div>
			)}

			{post.media && post.media.length > 0 && (
				<div className="mt-3 space-y-2">
					{post.media.map((media, index) => (
						<div key={media.id || index} className="rounded-md overflow-hidden">
							{media.mimeType.startsWith("image/") ? (
								<img
									src={media.url || "/placeholder.svg?height=300&width=600"}
									alt="Funding post media"
									className="w-full object-cover rounded-md"
									style={{ maxHeight: "400px" }}
								/>
							) : media.mimeType.startsWith("video/") ? (
								<video
									src={media.url}
									controls
									className="w-full rounded-md"
									style={{ maxHeight: "400px" }}
								/>
							) : null}
						</div>
					))}
				</div>
			)}

			{fundingRound && fundingRound.targetAmount && (
				<div className="bg-gray-50 p-3 rounded-md">
					<div className="flex justify-between text-sm mb-1">
						<span>Funding Goal:</span>
						<span className="font-medium">
							{formatCurrency(fundingRound.targetAmount)}
						</span>
					</div>
					{fundingRound.raisedAmount && (
						<div className="flex justify-between text-sm">
							<span>Raised So Far:</span>
							<span className="font-medium">
								{formatCurrency(fundingRound.raisedAmount)}
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
