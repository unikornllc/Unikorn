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
	DialogDescription,
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
import { updateCompany } from "@/app/_utils/_api/companyAPIs";
import DeleteButton from "@/app/_components/_ui/DeleteButton";

export default function SocialLinks({ company, isOwner }) {
	const [links, setLinks] = useState(
		Array.isArray(company?.socialMedia) ? [...company.socialMedia] : [],
	);

	const [isAddingLink, setIsAddingLink] = useState(false);
	const [isEditingLink, setIsEditingLink] = useState(false);
	const [newLink, setNewLink] = useState({ platform: "", url: "" });
	const [editLink, setEditLink] = useState({
		id: "",
		platform: "",
		url: "",
	});
	const iconMap = {
		Facebook: <Facebook className="h-5 w-5" />,
		LinkedIn: <Linkedin className="h-5 w-5" />,
		Twitter: <Twitter className="h-5 w-5" />,
		Instagram: <Instagram className="h-5 w-5" />,
	};

	const allPlatforms = ["Facebook", "LinkedIn", "Twitter", "Instagram"];

	const usedPlatforms = Array.isArray(company?.socialMedia)
		? company.socialMedia.map((entry) => entry.platform)
		: [];

	const [platforms, setPlatforms] = useState(
		allPlatforms.filter((platform) => !usedPlatforms.includes(platform)),
	);

	const handleAddLink = async () => {
		try {
			if (!newLink.platform || !newLink.url) return;

			if (links.some((link) => link.platform === newLink.platform)) {
				alert("This platform already exists.");
				return;
			}
			setIsAddingLink(false);

			console.log("Adding new link:", newLink);
			const newLinkObj = {
				id: Date.now().toString(),
				platform: newLink.platform,
				url: newLink.url,
				// icon: iconMap[newLink.platform] || <Globe className="h-5 w-5" />,
			};

			const updatedLinks = [...links, newLinkObj];

			setLinks(updatedLinks);
			setPlatforms((prev) =>
				prev.filter((platform) => platform !== newLink.platform),
			);

			await updateCompany({ socialMedia: updatedLinks });

			setNewLink({ platform: "", url: "" });
		} catch (error) {
			console.error("Error adding link:", error);
		}
	};

	const handleUpdateLink = async () => {
		try {
			if (!editLink.platform || !editLink.url) return;

			if (
				links.some(
					(link) =>
						link.platform === editLink.platform && link.id !== editLink.id,
				)
			) {
				alert("This platform already exists.");
				return;
			}
			setIsEditingLink(false);

			const oldLink = links.find((link) => link.id === editLink.id);
			const oldPlatform = oldLink?.platform;

			const updatedLinks = links.map((link) =>
				link.id === editLink.id
					? {
							...link,
							platform: editLink.platform,
							url: editLink.url,
							// icon: iconMap[editLink.platform] || link.icon,
						}
					: link,
			);

			setLinks(updatedLinks);

			setPlatforms((prev) =>
				prev
					.filter((p) => p !== editLink.platform)
					.concat(oldPlatform)
					.filter((v, i, a) => a.indexOf(v) === i),
			);

			await updateCompany({ socialMedia: updatedLinks });

			setEditLink({ platform: "", url: "", id: "" });
		} catch (error) {
			console.error("Error updating link:", error);
		}
	};

	const handleDeleteLink = async (id) => {
		try {
			const linkToDelete = links.find((link) => link.id === id);
			if (linkToDelete) {
				const updatedLinks = links.filter((link) => link.id !== id);

				setLinks(updatedLinks);
				setPlatforms((prev) => [...prev, linkToDelete.platform]);

				await updateCompany({ socialMedia: updatedLinks });
			}
		} catch (error) {
			console.error("Error deleting link:", error);
		}
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
						{iconMap[link.platform] || <Globe className="h-5 w-5" />}

						{isOwner && (
							<div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
								<Button
									size="icon"
									variant="secondary"
									className="h-5 w-5 rounded-full"
									onClick={(e) => {
										e.preventDefault();
										setEditLink(link);
										setIsEditingLink(true);
									}}
								>
									<Edit className="h-3 w-3" />
								</Button>
								<div
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									<DeleteButton
										onDelete={() => {
											handleDeleteLink(link.id);
										}}
										itemType="Social Link"
										size="small"
									/>
								</div>
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
								<DialogDescription></DialogDescription>
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
											{platforms.map((platform) => (
												<SelectItem key={platform} value={platform}>
													{platform}
												</SelectItem>
											))}
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
				open={isEditingLink}
				onOpenChange={(open) => !open && setIsEditingLink(false)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Social Link</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="edit-platform">Platform</Label>
							<Select
								value={editLink.platform}
								onValueChange={(value) =>
									setNewLink({ ...editLink, platform: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select platform" />
								</SelectTrigger>
								<SelectContent>
									{[
										...new Set([
											...platforms,
											links.find((l) => l.id === editLink.id)?.platform,
										]),
									]
										.filter(Boolean)
										.map((platform) => (
											<SelectItem key={platform} value={platform}>
												{platform}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-url">URL</Label>
							<Input
								id="edit-url"
								value={editLink.url}
								onChange={(e) =>
									setNewLink({ ...editLink, url: e.target.value })
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
