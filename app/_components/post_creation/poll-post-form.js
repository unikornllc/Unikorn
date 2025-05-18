"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "../_ui/Input.js";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
	question: z.string().min(5, "Question must be at least 5 characters"),
	options: z
		.array(z.object({ text: z.string().min(1, "Option cannot be empty") }))
		.min(2, "At least two options are required"),
});

export default function PollPostForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			question: "",
			options: [{ text: "" }, { text: "" }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "options",
	});

	const addOption = () => append({ text: "" });

	const onSubmit = async (values) => {
		setIsSubmitting(true);
		try {
			const postData = {
				type: "POLL",
				content: values.question,
				pollDetails: {
					question: values.question,
					options: values.options.map((opt) => opt.text),
				},
			};

			console.log("Submitting poll data:", postData);

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createType5Post`,
				{
					postData,
				},
				{ withCredentials: true },
			);

			toast.success("Your poll has been created successfully!");
			router.push("/newsfeed");
		} catch (error) {
			console.error("Error creating poll:", error);
			toast.error("Failed to create poll. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="question"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Poll Question</FormLabel>
							<FormControl>
								<Input placeholder="Enter your question" {...field} />
							</FormControl>
							<FormDescription>
								Ask a clear, concise question for your poll.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<FormLabel>Poll Options</FormLabel>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addOption}
							disabled={fields.length >= 10}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Option
						</Button>
					</div>

					<FormDescription>
						Add at least two options for people to vote on.
					</FormDescription>

					{fields.map((field, index) => (
						<div key={field.id} className="flex items-center gap-2">
							<FormField
								control={form.control}
								name={`options.${index}.text`}
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormControl>
											<Input placeholder={`Option ${index + 1}`} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{index >= 2 && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => remove(index)}
									className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}
						</div>
					))}

					{form.formState.errors.options?.message && (
						<p className="text-sm font-medium text-destructive">
							{form.formState.errors.options.message}
						</p>
					)}
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating Poll...
							</>
						) : (
							"Create Poll"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
