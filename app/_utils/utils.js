import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}
export function formatDate(date) {
	console.log("Formatting date:", date);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

export function truncateText(text, maxLength) {
	maxLength = maxLength || 100;
	if (!text || text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
}

export function calculateFundingProgress(fund) {
	if (!fund) return 0;
	const progress =
		((fund.totalPortions - fund.remainingPortions) / fund.totalPortions) * 100;
	return Math.round(progress);
}

export function getInitials(name) {
	if (!name) return "";
	return name
		.split(" ")
		.map((part) => part.charAt(0))
		.join("")
		.toUpperCase()
		.slice(0, 2);
}
