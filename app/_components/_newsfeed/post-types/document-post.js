import { FileText, Download } from "lucide-react";
import { Button } from "@/app/_components/_ui/Button.js";

export default function DocumentPostContent({ post }) {
	const document = post.document || null;

	if (!document) {
		return <p>{post.content}</p>;
	}

	// Get file icon based on file type
	const getFileIcon = (fileType) => {
		return <FileText className="h-6 w-6" />;
	};

	// Get file type label
	const getFileTypeLabel = (fileType) => {
		const type = fileType.toLowerCase();
		if (type === "pdf") return "PDF Document";
		if (type === "ppt" || type === "pptx") return "PowerPoint Presentation";
		if (type === "doc" || type === "docx") return "Word Document";
		if (type === "xls" || type === "xlsx") return "Excel Spreadsheet";
		return "Document";
	};

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">{document.title}</h3>

			{post.content && <p className="text-sm">{post.content}</p>}

			<div className="border rounded-md p-4">
				<div className="flex items-center">
					{getFileIcon(document.fileType)}
					<div className="ml-3 flex-1">
						<p className="font-medium">{document.title}</p>
						<p className="text-xs text-gray-500">
							{getFileTypeLabel(document.fileType)}
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="flex items-center gap-1"
						asChild
					>
						<a
							href={document.fileUrl}
							target="_blank"
							rel="noopener noreferrer"
							download
						>
							<Download className="h-4 w-4" />
							<span>Download</span>
						</a>
					</Button>
				</div>
			</div>
		</div>
	);
}
