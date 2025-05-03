"use client";

import { useRef, useLayoutEffect, useState } from "react";
import { cn } from "@/app/_utils/utils";

// Basic skeleton component
export function Skeleton({ className, ...props }) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
			{...props}
		/>
	);
}

// Auto-generating skeleton component
export function AutoSkeleton({
	children,
	isLoading,
	className = "",
	skeletonClassName = "bg-gray-200/80",
	preserveAspectRatio = true,
	depth = 5, // Increased depth to capture more nested elements
	fallback,
}) {
	const contentRef = useRef(null);
	const [dimensions, setDimensions] = useState([]);
	const [hasRendered, setHasRendered] = useState(false);
	const [hasAttemptedCapture, setHasAttemptedCapture] = useState(false);

	// Capture dimensions of the actual content when it's rendered
	useLayoutEffect(() => {
		if (!isLoading && contentRef.current) {
			// Use a small timeout to ensure the DOM is fully rendered
			const captureTimer = setTimeout(() => {
				const elements = extractElementDimensions(contentRef.current, depth);
				if (elements.length > 0) {
					setDimensions(elements);
					setHasRendered(true);
				}
				setHasAttemptedCapture(true);
			}, 50);

			return () => clearTimeout(captureTimer);
		}
	}, [isLoading, depth]);

	// Extract dimensions from DOM elements
	const extractElementDimensions = (element, depth, path = []) => {
		if (depth <= 0) return [];

		let elements = [];

		// Skip invisible elements
		const style = window.getComputedStyle(element);
		if (
			style.display === "none" ||
			style.visibility === "hidden" ||
			style.opacity === "0"
		) {
			return elements;
		}

		// Get element's dimensions and position
		const rect = element.getBoundingClientRect();
		const parentRect = element.parentElement
			? element.parentElement.getBoundingClientRect()
			: { top: 0, left: 0 };

		// Skip tiny elements
		if (rect.width < 5 || rect.height < 5) return elements;

		// Calculate relative position to parent
		const relativePosition = {
			top: rect.top - parentRect.top,
			left: rect.left - parentRect.left,
			width: rect.width,
			height: rect.height,
			tagName: element.tagName.toLowerCase(),
			className: element.className,
			borderRadius: style.borderRadius,
			isText:
				element.childNodes.length === 1 &&
				element.childNodes[0].nodeType === Node.TEXT_NODE,
			path: [...path],
		};

		elements.push(relativePosition);

		// Process children
		if (depth > 1) {
			Array.from(element.children).forEach((child, index) => {
				elements = [
					...elements,
					...extractElementDimensions(child, depth - 1, [...path, index]),
				];
			});
		}

		return elements;
	};

	// Render the skeleton based on captured dimensions
	const renderSkeleton = () => {
		if (dimensions.length === 0) {
			// Default skeleton before dimensions are captured
			return (
				fallback || <Skeleton className={`w-full h-32 ${skeletonClassName}`} />
			);
		}

		return dimensions
			.map((dim, index) => {
				// Skip rendering skeletons for certain elements
				if (dim.tagName === "button" || dim.tagName === "a") {
					return (
						<Skeleton
							key={`skeleton-${index}`}
							className={`absolute ${skeletonClassName}`}
							style={{
								top: `${dim.top}px`,
								left: `${dim.left}px`,
								width: `${dim.width}px`,
								height: `${dim.height}px`,
								borderRadius:
									dim.borderRadius !== "0px"
										? dim.borderRadius
										: dim.isText
											? "4px"
											: "0px",
							}}
						/>
					);
				}

				// For text elements, create thinner skeletons
				if (dim.isText) {
					return (
						<Skeleton
							key={`skeleton-${index}`}
							className={`absolute ${skeletonClassName}`}
							style={{
								top: `${dim.top}px`,
								left: `${dim.left}px`,
								width: `${dim.width}px`,
								height: `${Math.min(dim.height, 16)}px`,
								borderRadius: "4px",
							}}
						/>
					);
				}

				// For div elements that might be containers
				if (dim.tagName === "div" && dim.height > 20) {
					return (
						<Skeleton
							key={`skeleton-${index}`}
							className={`absolute ${skeletonClassName}`}
							style={{
								top: `${dim.top}px`,
								left: `${dim.left}px`,
								width: `${dim.width}px`,
								height: `${dim.height}px`,
								borderRadius:
									dim.borderRadius !== "0px" ? dim.borderRadius : "4px",
							}}
						/>
					);
				}

				return null;
			})
			.filter(Boolean);
	};

	return (
		<div className={`relative ${className}`}>
			{isLoading ? (
				<div className="w-full h-full">
					{hasRendered ? (
						<div
							className="relative"
							style={{
								height:
									dimensions.length > 0
										? `${Math.max(...dimensions.map((d) => d.top + d.height), 100)}px`
										: "auto",
							}}
						>
							{renderSkeleton()}
						</div>
					) : (
						fallback || (
							<Skeleton className={`w-full h-32 ${skeletonClassName}`} />
						)
					)}
				</div>
			) : (
				<div ref={contentRef}>{children}</div>
			)}
		</div>
	);
}

// Simple fallback skeletons for first render
export function BasicProfileSkeleton() {
	return (
		<div className="space-y-4">
			{/* Cover photo */}
			<Skeleton className="h-80 w-full rounded-none" />

			<div className="container mx-auto px-4">
				<div className="relative">
					{/* Profile picture */}
					<div className="absolute -top-20 left-4 rounded-xl overflow-hidden border-4 border-white bg-white h-40 w-40 shadow-lg">
						<Skeleton className="h-full w-full" />
					</div>

					<div className="flex flex-col md:flex-row items-end gap-6 pt-6 mb-4">
						<div className="w-40 md:w-44"></div>

						<div className="flex-1 mt-24 md:mt-0">
							<Skeleton className="h-8 w-64 mb-4" />
							<Skeleton className="h-4 w-full max-w-3xl mb-2" />
							<Skeleton className="h-4 w-full max-w-3xl mb-2" />
							<Skeleton className="h-4 w-3/4 max-w-3xl mb-4" />

							<div className="flex flex-wrap gap-4 mt-4">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-5 w-40" />
								<Skeleton className="h-5 w-36" />
							</div>
						</div>

						<div className="md:ml-auto mt-4 md:mt-0">
							<Skeleton className="h-10 w-28" />
						</div>
					</div>

					<div className="flex items-center gap-4 py-4 border-t border-b mt-6">
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-10 w-10 rounded-full" />
						<Skeleton className="h-10 w-10 rounded-full" />
					</div>
				</div>
			</div>
		</div>
	);
}

export function BasicCardSkeleton() {
	return (
		<div className="rounded-lg border bg-card p-6 shadow-sm">
			<div className="space-y-3">
				<Skeleton className="h-6 w-1/3" />
				<Skeleton className="h-4 w-1/2" />
				<div className="pt-4 space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</div>
		</div>
	);
}

export function SkeletonText({ lines = 1, className, ...props }) {
	return (
		<div className="space-y-2" {...props}>
			{Array(lines)
				.fill(0)
				.map((_, i) => (
					<Skeleton
						key={i}
						className={cn(
							"h-4 w-full",
							i === lines - 1 && lines > 1 ? "w-4/5" : "",
							className,
						)}
					/>
				))}
		</div>
	);
}

export function SkeletonAvatar({ size = "md", ...props }) {
	const sizeClasses = {
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-12 w-12",
		xl: "h-16 w-16",
	};

	return (
		<Skeleton className={cn("rounded-full", sizeClasses[size])} {...props} />
	);
}

export function SkeletonCard({ className, ...props }) {
	return (
		<div
			className={cn("rounded-lg border bg-card p-4 shadow-sm", className)}
			{...props}
		>
			<div className="space-y-3">
				<Skeleton className="h-5 w-2/3" />
				<SkeletonText lines={3} />
			</div>
		</div>
	);
}

export function SkeletonCardWithHeader({ className, ...props }) {
	return (
		<div
			className={cn("rounded-lg border bg-card shadow-sm", className)}
			{...props}
		>
			<div className="p-6 border-b space-y-2">
				<Skeleton className="h-6 w-1/3" />
				<Skeleton className="h-4 w-1/2" />
			</div>
			<div className="p-6 space-y-4">
				<SkeletonText lines={4} />
			</div>
		</div>
	);
}

export function SkeletonProfile({ className, ...props }) {
	return (
		<div className={cn("space-y-4", className)} {...props}>
			{/* Cover photo */}
			<Skeleton className="h-80 w-full rounded-none" />

			<div className="container mx-auto px-4">
				<div className="relative -mt-24 mb-6 flex flex-col md:flex-row items-start md:items-end gap-6">
					{/* Profile picture */}
					<Skeleton className="h-40 w-40 rounded-xl border-4 border-white" />

					<div className="flex-1 space-y-3">
						<Skeleton className="h-8 w-1/3" />
						<SkeletonText lines={2} />

						<div className="flex flex-wrap gap-4 pt-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-16" />
						</div>

						<div className="flex flex-wrap gap-2 pt-2">
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-6 w-28 rounded-full" />
						</div>
					</div>

					<Skeleton className="h-10 w-28" />
				</div>

				<div className="flex items-center gap-4 py-4 border-t border-b">
					<Skeleton className="h-10 w-10 rounded-full" />
					<Skeleton className="h-10 w-10 rounded-full" />
					<Skeleton className="h-10 w-10 rounded-full" />
				</div>
			</div>
		</div>
	);
}

export function SkeletonSection({ className, ...props }) {
	return (
		<div className={cn("space-y-6", className)} {...props}>
			<SkeletonCardWithHeader />
			<SkeletonCardWithHeader />
		</div>
	);
}

export function SkeletonPersonCard() {
	return (
		<div className="flex items-center gap-4">
			<SkeletonAvatar size="lg" />
			<div className="space-y-2">
				<Skeleton className="h-5 w-32" />
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-3 w-40" />
			</div>
		</div>
	);
}
