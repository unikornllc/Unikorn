"use client";

import React, { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
	content: z.string().min(10, "Description must be at least 10 characters"),
	role: z.string().min(3, "Role title must be at least 3 characters"),
	skills: z.string().min(5, "Skills must be at least 5 characters"),
});

export default function PartnerPostForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content: "",
			role: "",
			skills: "",
		},
	});

	const onSubmit = async (values) => {
		setIsSubmitting(true);

		try {
			const postData = {
				type: "LOOKING_FOR_PARTNER",
				content: `${values.role}\n\nSkills: ${values.skills}\n\n${values.content}`,
			};

			console.log("Submitting post data:", postData);

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createType2Post`,
				{
					postData,
				},
				{ withCredentials: true },
			);

			toast.success(
				"Your partner/employee post has been created successfully!",
			);
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
					name="role"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Role Title</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., Co-Founder, CTO, Marketing Specialist"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Specify the role or position you're looking to fill.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="skills"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Required Skills</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., React, Node.js, Marketing, Business Development"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								List the key skills or qualifications you're looking for.
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
									placeholder="Describe the role, responsibilities, compensation, equity, and any other relevant details..."
									className="min-h-[150px]"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Provide a comprehensive description of what you're looking for
								in a partner or employee.
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
							"Create Partner Post"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
