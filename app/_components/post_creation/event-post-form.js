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
import { Switch } from "../_ui/Switch.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	startTime: z.string().min(1, "Start time is required"),
	endTime: z.string().optional(),
	isVirtual: z.boolean().default(false),
	location: z.string().optional(),
	virtualLink: z.string().optional(),
});

export default function EventPostForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			startTime: "",
			endTime: "",
			isVirtual: false,
			location: "",
			virtualLink: "",
		},
	});

	const isVirtual = form.watch("isVirtual");

	const onSubmit = async (values) => {
		setIsSubmitting(true);

		try {
			if (isVirtual && !values.virtualLink) {
				form.setError("virtualLink", {
					type: "manual",
					message: "Virtual link is required for virtual events",
				});
				setIsSubmitting(false);
				return;
			}

			if (!isVirtual && !values.location) {
				form.setError("location", {
					type: "manual",
					message: "Location is required for in-person events",
				});
				setIsSubmitting(false);
				return;
			}

			const postData = {
				type: "EVENT",
				content: values.description,
				eventDetails: {
					title: values.title,
					description: values.description,
					startTime: values.startTime,
					endTime: values.endTime || null,
					isVirtual: values.isVirtual,
					location: values.location || null,
					virtualLink: values.virtualLink || null,
				},
			};

			console.log("Submitting event data:", postData);

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createType4Post`,
				{
					postData,
				},
				{ withCredentials: true },
			);

			toast.success("Your event has been created successfully!");
			router.push("/newsfeed");
		} catch (error) {
			console.error("Error creating event:", error);
			toast.error("Failed to create event. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Event Title</FormLabel>
							<FormControl>
								<Input placeholder="Enter event title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Event Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe your event, its purpose, target audience, etc."
									className="min-h-[100px]"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						control={form.control}
						name="startTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Start Date & Time</FormLabel>
								<FormControl>
									<Input type="datetime-local" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="endTime"
						render={({ field }) => (
							<FormItem>
								<FormLabel>End Date & Time (Optional)</FormLabel>
								<FormControl>
									<Input type="datetime-local" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="isVirtual"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel className="text-base">Virtual Event</FormLabel>
								<FormDescription>
									Toggle if this is a virtual event rather than in-person
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				{isVirtual ? (
					<FormField
						control={form.control}
						name="virtualLink"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Virtual Meeting Link</FormLabel>
								<FormControl>
									<Input
										placeholder="e.g., Zoom, Google Meet, or Microsoft Teams link"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Provide a link where attendees can join the virtual event.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				) : (
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Event Location</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter the physical location of the event"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Provide the address or venue where the event will take place.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Event...
							</>
						) : (
							"Create Event"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
