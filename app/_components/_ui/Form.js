import React, { createContext, useContext, forwardRef, useId } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext } from "react-hook-form";

import { cn } from "@/app/_utils/utils.js";
import { Label } from "./Label.js";

const Form = FormProvider;

const FormFieldContext = createContext({});

export function FormField(props) {
	const { name, ...rest } = props;
	return (
		<FormFieldContext.Provider value={{ name }}>
			<Controller name={name} {...rest} />
		</FormFieldContext.Provider>
	);
}

export function useFormField() {
	const fieldContext = useContext(FormFieldContext);
	const itemContext = useContext(FormItemContext);
	const { getFieldState, formState } = useFormContext();

	if (!fieldContext) {
		throw new Error("useFormField should be used within <FormField>");
	}

	const fieldState = getFieldState(fieldContext.name, formState);
	const { id } = itemContext;

	return {
		id,
		name: fieldContext.name,
		formItemId: `${id}-form-item`,
		formDescriptionId: `${id}-form-item-description`,
		formMessageId: `${id}-form-item-message`,
		...fieldState,
	};
}

const FormItemContext = createContext({});

export const FormItem = forwardRef(function FormItem(
	{ className, ...props },
	ref,
) {
	const id = useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div ref={ref} className={cn("space-y-2", className)} {...props} />
		</FormItemContext.Provider>
	);
});
FormItem.displayName = "FormItem";

export const FormLabel = forwardRef(function FormLabel(
	{ className, ...props },
	ref,
) {
	const { error, formItemId } = useFormField();
	return (
		<Label
			ref={ref}
			className={cn(error && "text-destructive", className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
});
FormLabel.displayName = "FormLabel";

export const FormControl = forwardRef(function FormControl({ ...props }, ref) {
	const { error, formItemId, formDescriptionId, formMessageId } =
		useFormField();

	return (
		<Slot
			ref={ref}
			id={formItemId}
			aria-describedby={
				!error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props}
		/>
	);
});
FormControl.displayName = "FormControl";

export const FormDescription = forwardRef(function FormDescription(
	{ className, ...props },
	ref,
) {
	const { formDescriptionId } = useFormField();

	return (
		<p
			ref={ref}
			id={formDescriptionId}
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
});
FormDescription.displayName = "FormDescription";

export const FormMessage = forwardRef(function FormMessage(
	{ className, children, ...props },
	ref,
) {
	const { error, formMessageId } = useFormField();
	const body = error ? String(error.message) : children;

	if (!body) {
		return null;
	}

	return (
		<p
			ref={ref}
			id={formMessageId}
			className={cn("text-sm font-medium text-destructive", className)}
			{...props}
		>
			{body}
		</p>
	);
});
FormMessage.displayName = "FormMessage";

export { Form, FormFieldContext, FormItemContext };
