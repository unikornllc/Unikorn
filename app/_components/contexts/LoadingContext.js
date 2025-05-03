"use client";

import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext({
	isLoading: true,
	setIsLoading: () => {},
	sectionLoading: {},
	setSectionLoading: () => {},
	initializeSections: () => {},
});

export function LoadingProvider({
	children,
	initialSections = {},
	initialLoading = true,
}) {
	const [isLoading, setIsLoading] = useState(initialLoading);
	const [sectionLoading, setSectionLoading] = useState(initialSections);
	const [initializedSections, setInitializedSections] = useState({});

	const setSectionLoadingState = useCallback((section, state) => {
		setSectionLoading((prev) => ({
			...prev,
			[section]: state,
		}));
	}, []);

	// Use useCallback to prevent recreation of this function on each render
	const initializeSections = useCallback(
		(sections, defaultState = true) => {
			// Check if these sections have already been initialized to prevent infinite loops
			const newSections = sections.filter(
				(section) => !initializedSections[section],
			);

			if (newSections.length === 0) return; // Skip if all sections are already initialized

			// Mark these sections as initialized
			setInitializedSections((prev) => {
				const updated = { ...prev };
				newSections.forEach((section) => {
					updated[section] = true;
				});
				return updated;
			});

			// Set the loading state for new sections only
			setSectionLoading((prev) => {
				const updated = { ...prev };
				newSections.forEach((section) => {
					updated[section] = defaultState;
				});
				return updated;
			});
		},
		[initializedSections],
	);

	return (
		<LoadingContext.Provider
			value={{
				isLoading,
				setIsLoading,
				sectionLoading,
				setSectionLoading: setSectionLoadingState,
				initializeSections,
			}}
		>
			{children}
		</LoadingContext.Provider>
	);
}

export const useLoading = () => useContext(LoadingContext);
