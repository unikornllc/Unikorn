"use client";

import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card.js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/_components/_ui/Select.js";
import { Button } from "@/app/_components/_ui/Button.js";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUnifiedPermissions } from "@/app/_hooks/useUnifiedPermissions.js";
import { FeatureGuard, UpgradePrompt } from "@/app/_components/_ui/UpgradePrompt.js";
import FundingPostForm from "@/app/_components/post_creation/funding-post-form";
import PartnerPostForm from "@/app/_components/post_creation/partner-post-form";
import GuidancePostForm from "@/app/_components/post_creation/guidance-post-form";
import EventPostForm from "@/app/_components/post_creation/event-post-form";
import PollPostForm from "@/app/_components/post_creation/poll-post-form";
import DocumentPostForm from "@/app/_components/post_creation/document-post-form";

const postTypeLabels = {
	LOOKING_FOR_FUNDING: "Looking for Funding",
	LOOKING_FOR_PARTNER: "Looking for Partner/Employee",
	LOOKING_FOR_GUIDANCE: "Looking for Guidance or Mentorship",
	EVENT: "Event",
	POLL: "Poll",
	DOCUMENT: "Document",
};

export default function CreatePostPage() {
	const [selectedPostType, setSelectedPostType] = useState("");
	const permissions = useUnifiedPermissions();
	const { canPost, loading, error } = permissions;

	const handleUpgrade = () => {
		// Redirect to upgrade page or show upgrade modal
		window.location.href = "/settings?upgrade=true";
	};

	const renderForm = () => {
		switch (selectedPostType) {
			case "LOOKING_FOR_FUNDING":
				return <FundingPostForm />;
			case "LOOKING_FOR_PARTNER":
				return <PartnerPostForm />;
			case "LOOKING_FOR_GUIDANCE":
				return <GuidancePostForm />;
			case "EVENT":
				return <EventPostForm />;
			case "POLL":
				return <PollPostForm />;
			case "DOCUMENT":
				return <DocumentPostForm />;
			default:
				return (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<p className="text-muted-foreground mb-6">
							Select a post type from the dropdown above to get started
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
							{Object.entries(postTypeLabels).map(([type, label]) => (
								<Button
									key={type}
									variant="outline"
									className="h-24 flex flex-col p-4"
									onClick={() => setSelectedPostType(type)}
								>
									<span className="font-medium">{label}</span>
									<span className="text-xs text-muted-foreground mt-2">
										Create a {label.toLowerCase()} post
									</span>
								</Button>
							))}
						</div>
					</div>
				);
		}
	};

	if (loading) {
		return (
			<main className="container max-w-4xl py-8">
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="container max-w-4xl py-8">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<p className="text-red-600 mb-4">Error loading permissions</p>
						<Button onClick={() => window.location.reload()}>
							Try Again
						</Button>
					</div>
				</div>
			</main>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<div className="p-4">
				<Link
					href="/newsfeed"
					className="flex items-center text-muted-foreground hover:text-foreground"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Newsfeed
				</Link>
			</div>
			<div className="flex-1 flex items-center justify-center">
				<FeatureGuard 
					feature="POSTING" 
					permissions={permissions}
					fallback={
						<Card>
							<CardContent className="pt-6">
								<UpgradePrompt 
									feature="POSTING" 
									onUpgrade={handleUpgrade}
								/>
							</CardContent>
						</Card>
					}
				>
					<Card>
						<CardHeader>
							<CardTitle>Create a Post</CardTitle>
							<CardDescription>
								Select the type of post you want to create and fill out the form
							</CardDescription>

							<div className="mt-4">
								<Select
									value={selectedPostType}
									onValueChange={setSelectedPostType}
								>
									<SelectTrigger className="w-full md:w-[300px]">
										<SelectValue placeholder="Select post type" />
									</SelectTrigger>
									<SelectContent>
										{Object.entries(postTypeLabels).map(([type, label]) => (
											<SelectItem key={type} value={type}>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</CardHeader>
						<CardContent>{renderForm()}</CardContent>
					</Card>
				</FeatureGuard>
			</div>
		</div>
	);
}
