"use client";

import { useState } from "react";
import {
	Facebook,
	Linkedin,
	Twitter,
	Instagram,
	Plus,
	Edit,
	Trash2,
	Globe,
} from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/app/_components/_ui/Dialog";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/_ui/Select";

export default function SocialLinks({ isOwner }) {
	// Mock data
	const [links, setLinks] = useState([
		{
			id: "1",
			platform: "facebook",
			url: "https://facebook.com/company",
			icon: <Facebook className="h-5 w-5" />,
		},
		{
			id: "2",
			platform: "linkedin",
			url: "https://linkedin.com/company",
			icon: <Linkedin className="h-5 w-5" />,
		},
		{
			id: "3",
			platform: "twitter",
			url: "https://twitter.com/company",
			icon: <Twitter className="h-5 w-5" />,
		},
	]);

	const [isAddingLink, setIsAddingLink] = useState(false);
	const [isEditingLink, setIsEditingLink] = useState(null);
	const [newLink, setNewLink] = useState({ platform: "", url: "" });

	const handleAddLink = () => {
		const iconMap = {
			facebook: <Facebook className="h-5 w-5" />,
			linkedin: <Linkedin className="h-5 w-5" />,
			twitter: <Twitter className="h-5 w-5" />,
			instagram: <Instagram className="h-5 w-5" />,
		};

		setLinks([
			...links,
			{
				id: Date.now().toString(),
				platform: newLink.platform,
				url: newLink.url,
				icon: iconMap[newLink.platform] || <Globe className="h-5 w-5" />,
			},
		]);

		setNewLink({ platform: "", url: "" });
		setIsAddingLink(false);
	};

	const handleEditLink = (id) => {
		const link = links.find((l) => l.id === id);
		if (link) {
			setNewLink({ platform: link.platform, url: link.url });
			setIsEditingLink(id);
		}
	};

	const handleUpdateLink = () => {
		if (isEditingLink) {
			const iconMap = {
				facebook: <Facebook className="h-5 w-5" />,
				linkedin: <Linkedin className="h-5 w-5" />,
				twitter: <Twitter className="h-5 w-5" />,
				instagram: <Instagram className="h-5 w-5" />,
			};

			setLinks(
				links.map((link) =>
					link.id === isEditingLink
						? {
								...link,
								platform: newLink.platform,
								url: newLink.url,
								icon: iconMap[newLink.platform] || link.icon,
							}
						: link,
				),
			);

			setNewLink({ platform: "", url: "" });
			setIsEditingLink(null);
		}
	};

	const handleDeleteLink = (id) => {
		setLinks(links.filter((link) => link.id !== id));
	};

	return (
		<div className="flex items-center gap-4 py-4 border-t border-b">
			<div className="flex gap-3">
				{links.map((link) => (
					<a
						key={link.id}
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative group"
					>
						{link.icon}

						{isOwner && (
							<div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
								<Button
									size="icon"
									variant="secondary"
									className="h-5 w-5 rounded-full"
									onClick={(e) => {
										e.preventDefault();
										handleEditLink(link.id);
									}}
								>
									<Edit className="h-3 w-3" />
								</Button>
								<Button
									size="icon"
									variant="destructive"
									className="h-5 w-5 rounded-full"
									onClick={(e) => {
										e.preventDefault();
										handleDeleteLink(link.id);
									}}
								>
									<Trash2 className="h-3 w-3" />
								</Button>
							</div>
						)}
					</a>
				))}

				{isOwner && (
					<Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon" className="rounded-full">
								<Plus className="h-5 w-5" />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Add Social Link</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="platform">Platform</Label>
									<Select
										value={newLink.platform}
										onValueChange={(value) =>
											setNewLink({ ...newLink, platform: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select platform" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="facebook">Facebook</SelectItem>
											<SelectItem value="linkedin">LinkedIn</SelectItem>
											<SelectItem value="twitter">Twitter</SelectItem>
											<SelectItem value="instagram">Instagram</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="url">URL</Label>
									<Input
										id="url"
										value={newLink.url}
										onChange={(e) =>
											setNewLink({ ...newLink, url: e.target.value })
										}
										placeholder="https://example.com"
									/>
								</div>
								<Button onClick={handleAddLink} className="w-full">
									Add Link
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</div>

			{/* Edit Link Dialog */}
			<Dialog
				open={isEditingLink !== null}
				onOpenChange={(open) => !open && setIsEditingLink(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Social Link</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="edit-platform">Platform</Label>
							<Select
								value={newLink.platform}
								onValueChange={(value) =>
									setNewLink({ ...newLink, platform: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select platform" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="facebook">Facebook</SelectItem>
									<SelectItem value="linkedin">LinkedIn</SelectItem>
									<SelectItem value="twitter">Twitter</SelectItem>
									<SelectItem value="instagram">Instagram</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-url">URL</Label>
							<Input
								id="edit-url"
								value={newLink.url}
								onChange={(e) =>
									setNewLink({ ...newLink, url: e.target.value })
								}
								placeholder="https://example.com"
							/>
						</div>
						<Button onClick={handleUpdateLink} className="w-full">
							Update Link
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
