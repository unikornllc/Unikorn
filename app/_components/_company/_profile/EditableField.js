"use client";

import { useState, useRef, useEffect } from "react";
import { Edit, Check, X } from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import { Textarea } from "@/app/_components/_ui/Textarea";
import { Input } from "@/app/_components/_ui/Input";
import { cn } from "@/app/_utils/utils";

export default function EditableField({
	value,
	onSave,
	multiline = false,
	inline = false,
	className,
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);
	const inputRef = useRef(null);

	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditing]);

	const handleSave = () => {
		onSave(editValue);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditValue(value);
		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<div
				className={cn("flex items-start gap-2", inline ? "inline-flex" : "")}
			>
				{multiline ? (
					<Textarea
						ref={inputRef}
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						className={cn("min-h-[100px]", className)}
					/>
				) : (
					<Input
						ref={inputRef}
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						className={className}
					/>
				)}
				<div className="flex flex-col gap-2">
					<Button size="icon" variant="ghost" onClick={handleSave}>
						<Check className="h-4 w-4" />
					</Button>
					<Button size="icon" variant="ghost" onClick={handleCancel}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn("group relative", inline ? "inline-block" : "", className)}
		>
			{value || "Click to add"}
			<Button
				size="icon"
				variant="ghost"
				className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
				onClick={() => setIsEditing(true)}
			>
				<Edit className="h-4 w-4" />
			</Button>
		</div>
	);
}
