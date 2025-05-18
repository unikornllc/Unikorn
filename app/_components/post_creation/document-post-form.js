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
import { Card, CardContent } from "../_ui/Card.js";
import { FileText, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const formSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	content: z.string().optional(),
});

export default function DocumentPostForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [file, setFile] = useState(null);
	const [fileError, setFileError] = useState(null);

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});

	const handleFileChange = (e) => {
		setFileError(null);

		if (e.target.files && e.target.files.length > 0) {
			const selectedFile = e.target.files[0];

			const allowedTypes = [
				"application/pdf",
				"application/vnd.ms-powerpoint",
				"application/vnd.openxmlformats-officedocument.presentationml.presentation",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				"application/vnd.ms-excel",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			];

			if (!allowedTypes.includes(selectedFile.type)) {
				setFileError(
					"Only PDF, PPT, PPTX, DOC, DOCX, XLS, and XLSX files are allowed",
				);
				return;
			}

			if (selectedFile.size > 10 * 1024 * 1024) {
				setFileError("File size must be less than 10MB");
				return;
			}

			setFile(selectedFile);
		}
	};

	const removeFile = () => {
		setFile(null);
		setFileError(null);
	};

	const getFileExtension = (file) => {
		return file.name.split(".").pop().toLowerCase() || "";
	};

	const onSubmit = async (values) => {
		if (!file) {
			setFileError("Please upload a document file");
			return;
		}

		setIsSubmitting(true);

		try {
			const fileUrl = "https://example.com/sample.pdf";

			const postData = {
				type: "DOCUMENT",
				content: values.content,
				documentDetails: {
					title: values.title,
					fileUrl,
					fileType: getFileExtension(file),
				},
			};

			console.log("Submitting document data:", postData);

			const res = await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/createType6Post`,
				{
					postData,
				},
				{ withCredentials: true },
			);

			toast.success("Your document has been uploaded successfully!");
			router.push("/newsfeed");
		} catch (error) {
			console.error("Error uploading document:", error);
			toast.error("Failed to upload document. Please try again.");
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
							<FormLabel>Document Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter a title for your document"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Give your document a descriptive title.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div>
					<FormLabel>Upload Document</FormLabel>
					<div className="mt-2">
						{!file ? (
							<Card className="border-dashed">
								<CardContent className="p-4 flex items-center justify-center">
									<label className="cursor-pointer flex flex-col items-center justify-center w-full py-6">
										<Upload className="h-8 w-8 text-muted-foreground mb-2" />
										<span className="text-sm font-medium mb-1">
											Click to upload a document
										</span>
										<span className="text-xs text-muted-foreground">
											PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX (Max 10MB)
										</span>
										<Input
											type="file"
											accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
											className="hidden"
											onChange={handleFileChange}
										/>
									</label>
								</CardContent>
							</Card>
						) : (
							<div className="flex items-center p-4 border rounded-md">
								<FileText className="h-8 w-8 text-primary mr-3" />
								<div className="flex-1">
									<p className="text-sm font-medium truncate">{file.name}</p>
									<p className="text-xs text-muted-foreground">
										{(file.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={removeFile}
									className="text-muted-foreground hover:text-foreground"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}

						{fileError && (
							<p className="text-sm font-medium text-destructive mt-2">
								{fileError}
							</p>
						)}
					</div>
				</div>

				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description (Optional)</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Add a description for your document..."
									className="min-h-[100px]"
									{...field}
								/>
							</FormControl>
							<FormDescription>
								Provide context about the document you're sharing.
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
								Uploading Document...
							</>
						) : (
							"Upload Document"
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}
