"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../_ui/Button";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
	content: z.string().min(10, "Description must be at least 10 characters"),
	areas: z.string().min(5, "Areas must be at least 5 characters"),
});

export default function GuidancePostForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
			areas: "",
		},
	});

	const onSubmit = async (values) => {
		setIsSubmitting(true);

		try {
			const postData = {
				type: "LOOKING_FOR_GUIDANCE",
				content: `Areas of guidance needed: ${values.areas}\n\n${values.content}`,
			};

			console.log("Submitting post data:", postData);

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createType3Post`,
				{
					postData,
				},
				{ withCredentials: true },
			);

			toast.success("Your guidance request has been created successfully!");
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
					name="areas"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Areas Needing Guidance</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., Product Strategy, Fundraising, Technical Architecture"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Specify the key areas where you need guidance or mentorship.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Detailed Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe your situation, the specific challenges you're facing, and what kind of guidance you're seeking..."
									className="min-h-[150px]"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Be specific about your challenges and what type of guidance
								would be most helpful.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Post...
							</>
						) : (
							"Request Guidance"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
