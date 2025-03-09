"use client";

import { useState } from "react";
import axios from "axios";
import { useToast } from "@/app/_components/_hooks/useToast";

const validateData = (modelType, data) => {
	const errors = [];

	switch (modelType) {
		case "expertise":
			if (!data.field?.trim()) {
				errors.push("Field is required");
			}
			break;

		case "education":
			if (!data.institution?.trim()) {
				errors.push("Institution is required");
			}
			if (!data.degree) {
				errors.push("Degree is required");
			}
			break;

		case "corporateExperience":
			if (!data.jobTitle?.trim()) {
				errors.push("Job title is required");
			}
			if (!data.companyName?.trim()) {
				errors.push("Company name is required");
			}
			if (!data.startDate) {
				errors.push("Start date is required");
			}
			if (!data.responsibilities?.trim()) {
				errors.push("Responsibilities are required");
			}
			break;

		case "startupExperience":
			if (!data.startupName?.trim()) {
				errors.push("Startup name is required");
			}
			if (!data.role?.trim()) {
				errors.push("Role is required");
			}
			if (!data.description?.trim()) {
				errors.push("Description is required");
			}
			break;

		case "certificationsCourses":
			if (!data.title?.trim()) {
				errors.push("Title is required");
			}
			if (!data.institution?.trim()) {
				errors.push("Institution is required");
			}
			if (!data.completionDate) {
				errors.push("Completion date is required");
			}
			if (!data.focusArea?.trim()) {
				errors.push("Focus area is required");
			}
			break;

		case "language":
			if (!data.language?.trim()) {
				errors.push("Language is required");
			}
			if (!data.proficiency) {
				errors.push("Proficiency level is required");
			}
			break;

		case "interest":
			if (!data.name?.trim()) {
				errors.push("Interest Name is required");
			}
			break;
		case "socialMedia":
			if (!data.platform) {
				errors.push("Platform is required");
			}
			if (!data.url?.trim()) {
				errors.push("URL is required");
			} else if (!isValidUrl(data.url)) {
				errors.push("Please enter a valid URL");
			}
			break;

		default:
			errors.push("Invalid model type");
	}

	return errors;
};

const isValidUrl = (url) => {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
};

const formatModelName = (modelType) => {
	return modelType
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const useUpdateItem = () => {
	// const [loading, setLoading] = useState(false);
	const { toast } = useToast();

	const updateItem = async (modelType, itemId, updateData) => {
		// Validate data first
		console.log(updateData);
		const validationErrors = validateData(modelType, updateData);
		if (validationErrors.length > 0) {
			const errorMessage = validationErrors
				.map((error) => `• ${error}`)
				.join("\n");
			toast({
				title: "error",
				description: errorMessage,
				variant: "destructive",
			});
			throw new Error(errorMessage);
		}

		try {
			// setLoading(true);

			const response = await axios.put(
				`${process.env.NEXT_PUBLIC_SERVER}/api/updateUserItem`,
				{
					model: modelType,
					id: itemId,
					data: updateData,
				},
				{ withCredentials: true },
			);

			toast({
				title: "Success",
				description: `${formatModelName(modelType)} updated successfully`,
				variant: "success",
			});
			return response.data[modelType];
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "An error occurred while updating";
			toast({
				title: "Error",
				description: errorMessage,
				variant: "destructive",
			});
			throw error;
		}
	};

	return { updateItem };
};
