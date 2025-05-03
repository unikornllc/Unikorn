"use client";

import { useState, useEffect } from "react";
import {
	AutoSkeleton,
	BasicCardSkeleton,
} from "@/app/_components/_ui/_loading/Skeleton";
import { useLoading } from "@/app/_components/contexts/LoadingContext";

export function LoadingWrapper({
	children,
	loading: externalLoading,
	sectionName,
	onLoad,
	className = "",
	count = 1,
}) {
	const { sectionLoading, setSectionLoading } = useLoading();

	// Determine loading state from context if sectionName is provided, otherwise use prop or default
	const [isLoading, setIsLoading] = useState(() => {
		if (sectionName && sectionLoading[sectionName] !== undefined) {
			return sectionLoading[sectionName];
		}
		return externalLoading !== undefined ? externalLoading : true;
	});

	const [hasRenderedOnce, setHasRenderedOnce] = useState(false);

	// Update local loading state when context or props change
	useEffect(() => {
		if (sectionName && sectionLoading[sectionName] !== undefined) {
			setIsLoading(sectionLoading[sectionName]);
		} else if (externalLoading !== undefined) {
			setIsLoading(externalLoading);
		}
	}, [sectionName, sectionLoading, externalLoading]);

	// If no external control is provided, component manages its own loading state
	useEffect(() => {
		if (externalLoading === undefined && sectionName === undefined) {
			// Set loading to false immediately - replace with actual data fetching
			setIsLoading(false);
			setHasRenderedOnce(true);
			if (onLoad) onLoad();
		}
	}, [externalLoading, sectionName, onLoad]);

	// Update context when loading state changes (if sectionName is provided)
	useEffect(() => {
		if (!isLoading && sectionName) {
			setSectionLoading(sectionName, false);
		}
	}, [isLoading, sectionName, setSectionLoading]);

	useEffect(() => {
		if (!isLoading) {
			setHasRenderedOnce(true);
		}
	}, [isLoading]);

	// For first render, use basic skeleton
	if (isLoading && !hasRenderedOnce) {
		return (
			<div className={className}>
				{Array(count)
					.fill(0)
					.map((_, i) => (
						<div key={i} className="mb-6">
							<BasicCardSkeleton />
						</div>
					))}
			</div>
		);
	}

	// For subsequent renders, use auto skeleton
	return (
		<AutoSkeleton
			isLoading={isLoading}
			className={className}
			fallback={
				<div className={className}>
					{Array(count)
						.fill(0)
						.map((_, i) => (
							<div key={i} className="mb-6">
								<BasicCardSkeleton />
							</div>
						))}
				</div>
			}
		>
			{children}
		</AutoSkeleton>
	);
}
