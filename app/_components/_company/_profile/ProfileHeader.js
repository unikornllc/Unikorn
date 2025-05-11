"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
	Edit,
	MapPin,
	Calendar,
	Globe,
	CheckCircle,
	MessageSquare,
	Users,
	Briefcase,
} from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/app/_components/_ui/Tooltip";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import { Textarea } from "@/app/_components/_ui/Textarea";
import SocialLinks from "@/app/_components/_company/_profile/SocialLinks";
import { formatDate } from "@/app/_utils/utils";
import ProfileCoverEdit from "@/app/_components/_shared/_profile/ProfileCoverEdit";

export default function ProfileHeader({ company, isOwner, updateCompany }) {
	const [isFollowing, setIsFollowing] = useState(false);
	const [followerCount, setFollowerCount] = useState(1234);

	const [isEditingCompanyInfo, setIsEditingCompanyInfo] = useState(false);
	const [companyInfo, setCompanyInfo] = useState({
		name: company.name,
		description: company.description,
		hqLocation: company.hqLocation,
		website: company.website,
		industry: company.industry,
		type: company.type,
	});

	const username = company.account.username;
	const name = company.name;
	const handleFollow = () => {
		if (isFollowing) {
			setFollowerCount(followerCount - 1);
		} else {
			setFollowerCount(followerCount + 1);
		}
		setIsFollowing(!isFollowing);
	};

	const handleSaveCompanyInfo = () => {
		updateCompany(companyInfo);
		setIsEditingCompanyInfo(false);
	};

	return (
		<div className="relative">
			<ProfileCoverEdit account={{ username, name }} editable={isOwner} />
			<div className="container mx-auto px-4 relative">
				<div className="flex flex-col md:flex-row items-end gap-6 pt-6 mb-4">
					<div className="w-full md:w-auto md:ml-44 flex flex-col md:flex-row items-center md:items-start gap-2 flex-wrap mt-24 md:mt-0">
						<h1 className="text-3xl font-bold text-center md:text-left">
							{company.name}
						</h1>

						{company.verified && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant="outline"
											className="bg-blue-50 text-blue-600 border-blue-200"
										>
											<CheckCircle className="h-3.5 w-3.5 mr-1" />
											Verified
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<p>This company has been verified by Unikorn</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					<div className="w-full md:w-auto md:ml-auto mt-4 md:mt-0 flex justify-center md:justify-end">
						{!isOwner ? (
							<div className="flex gap-3">
								<Button
									variant={isFollowing ? "outline" : "default"}
									onClick={handleFollow}
								>
									{isFollowing ? "Following" : "Follow"}
								</Button>
								<Button variant="outline">
									<MessageSquare className="h-4 w-4 mr-2" />
									Message
								</Button>
							</div>
						) : (
							<Button
								variant="outline"
								onClick={() => {
									setIsEditingCompanyInfo(true);
								}}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit Company Info
							</Button>
						)}
					</div>
				</div>

				<div className="ml-0 md:ml-44 space-y-4">
					<p className="text-gray-600 max-w-3xl">{company.description}</p>

					<div className="flex flex-wrap gap-4 text-sm text-gray-500">
						<div className="flex items-center">
							<MapPin className="h-4 w-4 mr-1" />

							<span>{company.hqLocation}</span>
						</div>

						<div className="flex items-center">
							<Calendar className="h-4 w-4 mr-1" />
							<span>Founded {formatDate(company.founded)}</span>
						</div>

						<div className="flex items-center">
							<Briefcase className="h-4 w-4 mr-1" />
							<span>{company.type} Company</span>
						</div>

						<div className="flex items-center">
							<Globe className="h-4 w-4 mr-1" />
							<Link
								href={company.website}
								target="_blank"
								className="text-blue-600 hover:underline"
							>
								{company.website.replace(/^https?:\/\//, "")}
							</Link>
						</div>

						<div className="flex items-center">
							<Users className="h-4 w-4 mr-1" />
							<span>{followerCount} followers</span>
						</div>
					</div>

					<div className="flex flex-wrap gap-2 pt-2">
						{company.industry && (
							<Badge variant="secondary">{company.industry}</Badge>
						)}
					</div>
				</div>

				<div className="mt-6">
					<SocialLinks isOwner={isOwner} />
				</div>
			</div>

			{isOwner && (
				<Dialog
					open={isEditingCompanyInfo}
					onOpenChange={setIsEditingCompanyInfo}
				>
					<DialogContent className="max-w-2xl">
						<DialogHeader>
							<DialogTitle>Edit Company Information</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="company-name" className="text-right">
									Company Name
								</Label>
								<Input
									id="company-name"
									value={companyInfo.name}
									onChange={(e) => {
										setCompanyInfo(
											Object.assign({}, companyInfo, { name: e.target.value }),
										);
									}}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-start gap-4">
								<Label
									htmlFor="company-description"
									className="text-right pt-2"
								>
									Description
								</Label>
								<Textarea
									id="company-description"
									value={companyInfo.description}
									onChange={(e) => {
										setCompanyInfo(
											Object.assign({}, companyInfo, {
												description: e.target.value,
											}),
										);
									}}
									className="col-span-3 min-h-[100px]"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="company-location" className="text-right">
									Headquarters
								</Label>
								<Input
									id="company-location"
									value={companyInfo.hqLocation}
									onChange={(e) => {
										setCompanyInfo(
											Object.assign({}, companyInfo, {
												hqLocation: e.target.value,
											}),
										);
									}}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="company-website" className="text-right">
									Website
								</Label>
								<Input
									id="company-website"
									value={companyInfo.website}
									onChange={(e) => {
										setCompanyInfo(
											Object.assign({}, companyInfo, {
												website: e.target.value,
											}),
										);
									}}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="company-industry" className="text-right">
									Industry
								</Label>
								<Input
									id="company-industry"
									value={companyInfo.industry}
									onChange={(e) => {
										setCompanyInfo(
											Object.assign({}, companyInfo, {
												industry: e.target.value,
											}),
										);
									}}
									className="col-span-3"
								/>
							</div>
							<div className="grid grid-cols-4 items-center gap-4">
								<Label htmlFor="company-type" className="text-right">
									Company Type
								</Label>
								<select
									id="company-type"
									value={companyInfo.type}
									onChange={(e) => {
										setCompanyInfo(
											Object.assign({}, companyInfo, { type: e.target.value }),
										);
									}}
									className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="Profit">Profit</option>
									<option value="NonProfit">NonProfit</option>
									<option value="Private">Private</option>
									<option value="Public">Public</option>
								</select>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => {
									setIsEditingCompanyInfo(false);
								}}
							>
								Cancel
							</Button>
							<Button onClick={handleSaveCompanyInfo}>Save Changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
