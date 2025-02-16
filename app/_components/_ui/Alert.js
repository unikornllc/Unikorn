import * as React from "react";
import { cn } from "@/app/_utils/utils"


const Alert = React.forwardRef(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"rounded-lg border border-red-600 bg-red-50 text-red-700 p-4",
			className
		)}
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("text-lg font-medium", className)}
		{...props}
	/>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm mt-1", className)}
		{...props}
	/>
));
AlertDescription.displayName = "AlertDescription";

const AlertCircle = React.forwardRef(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			"flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-red-600",
			className
		)}
		{...props}
	/>
));
AlertCircle.displayName = "AlertCircle";

export { Alert, AlertDescription, AlertTitle, AlertCircle };

