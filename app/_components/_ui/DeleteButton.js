import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import { useToast } from "@/app/_components/_hooks/useToast";

const DeleteButton = ({
	onDelete,
	itemType = "item",
	loading = false,
	size = "normal",
	className = "",
	disabled = false,
}) => {
	const [showDialog, setShowDialog] = useState(false);
	const { toast } = useToast();

	const handleConfirmDelete = async () => {
		try {
			await onDelete();
			toast({
				title: "Success",
				description: `${itemType} deleted successfully`,
				// variant: "success",
			});
		} catch (error) {
			toast({
				title: "Failed",
				description:
					error.response?.data?.message || "An error occurred while deleting",
				variant: "destructive",
			});
			console.error("Error deleting item:", error);
		} finally {
			setShowDialog(false);
		}
	};

	const iconSizes = {
		small: "w-4 h-4",
		normal: "w-5 h-5",
	};

	const buttonStyles = {
		small: "p-1",
		normal: "p-2",
	};

	return (
		<>
			<button
				className={`text-red-500 hover:text-red-700 ${buttonStyles[size]} ${className}`}
				onClick={() => setShowDialog(true)}
				disabled={disabled || loading}
			>
				<TrashIcon className={iconSizes[size]} />
			</button>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Delete</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this {itemType}? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<button
							type="button"
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
							onClick={() => setShowDialog(false)}
							disabled={loading}
						>
							Cancel
						</button>
						<button
							type="button"
							className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
							onClick={handleConfirmDelete}
							disabled={loading}
						>
							Delete
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DeleteButton;
