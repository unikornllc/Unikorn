"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../_ui/Button.js";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../_ui/Form.js";
import { Textarea } from "../_ui/Textarea.js";
import { Input } from "../_ui/Input.js";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../_ui/Select.js";
import { Card, CardContent } from "../_ui/Card.js";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
	content: z.string().min(10, "Description must be at least 10 characters"),
	roundId: z.string().min(1, "Funding round is required"),
});

export default function FundingPostForm() {
	const router = useRouter();
	const [fundingRounds, setRaisingFund] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [mediaFiles, setMediaFiles] = useState([]);
	const [mediaPreviewUrls, setMediaPreviewUrls] = useState([]);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
			roundId: "",
		},
	});

	useEffect(() => {
		const fetchRaisingFundData = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/raisingFunds/company/active`,
					{ withCredentials: true },
				);
				const round = response.data.activeFundraising;
				setRaisingFund(round);
				form.setValue("roundId", round.id);
			} catch (error) {
				console.error("Error fetching raising fund data:", error);
			}
		};
		fetchRaisingFundData();
	}, [form]);

	const handleMediaChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
			setMediaFiles((prev) => [...prev, ...newFiles]);
			setMediaPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
		}
	};

	const removeMedia = (index) => {
		URL.revokeObjectURL(mediaPreviewUrls[index]);
		setMediaFiles((prev) => prev.filter((_, i) => i !== index));
		setMediaPreviewUrls((prev) => prev.filter((_, i) => i !== index));
	};

	const onSubmit = async (values) => {
		setIsSubmitting(true);
		try {
			const mediaUrls = mediaFiles.map((file, index) => ({
				url: `https://example.com/media/${index}`,
				mimeType: file.type,
			}));

			const postData = {
				type: "LOOKING_FOR_FUNDING",
				content: values.content,
				roundId: fundingRounds.id,
				media: mediaUrls,
			};

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createType1Post`,
				{
					postData,
				},
				{ withCredentials: true },
			);

			toast.success("Your funding post has been created successfully!");
			router.push("/newsfeed");
		} catch (error) {
			console.error("Error creating post:", error);
			toast.error("Failed to create post. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Describe your funding needs</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe your project, funding requirements, and what you're offering in return..."
									className="min-h-[150px]"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Be specific about your funding goals and how the funds will be
								used.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="roundId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Funding Round</FormLabel>
							<Select disabled value={fundingRounds?.id}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select a funding round" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{fundingRounds && (
										<SelectItem key={fundingRounds.id} value={fundingRounds.id}>
											<div className="text-left">
												<div className="font-semibold">
													{fundingRounds.companyName}
												</div>
												<div className="text-sm ">
													{`Looking to raise $${fundingRounds.fundingAmount} – $${fundingRounds.pricePerPortion} per portion, ${fundingRounds.remainingPortions} remaining`}
												</div>
												<div className="text-xs text-gray-500 italic">
													Status: {fundingRounds.status}
												</div>
											</div>
										</SelectItem>
									)}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<FormLabel>Media (Optional)</FormLabel>
					<div className="mt-2">
						<Card className="border-dashed">
							<CardContent className="p-4 flex items-center justify-center">
								<label className="cursor-pointer flex flex-col items-center justify-center w-full py-6">
									<ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
									<span className="text-sm text-muted-foreground">
										Click to upload images or videos
									</span>
									<Input
										type="file"
										accept="image/*,video/*"
										className="hidden"
										onChange={handleMediaChange}
										multiple
									/>
								</label>
							</CardContent>
						</Card>
					</div>
					{mediaPreviewUrls.length > 0 && (
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
							{mediaPreviewUrls.map((url, index) => (
								<div key={index} className="relative group">
									<img
										src={url}
										alt={`Preview ${index}`}
										className="w-full h-32 object-cover rounded-md"
									/>
									<button
										type="button"
										onClick={() => removeMedia(index)}
										className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Post...
							</>
						) : (
							"Create Funding Post"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
