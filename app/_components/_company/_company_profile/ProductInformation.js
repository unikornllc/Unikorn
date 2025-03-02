import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import EditIcon from "@/app/_icons/EditIcon";
import SaveIcon from "@/app/_icons/SaveIcon";

const ProductInformation = ({ productInformationList = [], onUpdate }) => {
	const [localProductInfoList, setLocalProductInfoList] = useState(
		productInformationList,
	);
	const [editingIndex, setEditingIndex] = useState(null);
	const [tempProductInfo, setTempProductInfo] = useState({
		product: "",
		market: "",
		partnerships: [],
	});
	const [isAdding, setIsAdding] = useState(false);

	// Start editing an existing product information
	const startEditing = (index) => {
		setEditingIndex(index);
		setTempProductInfo({ ...localProductInfoList[index] });
	};

	// Cancel editing or adding
	const cancelEditing = () => {
		setEditingIndex(null);
		setTempProductInfo({ product: "", market: "", partnerships: [] });
		setIsAdding(false);
	};

	// Save changes to an existing product information
	const saveProductInfo = () => {
		const updatedList = [...localProductInfoList];
		updatedList[editingIndex] = tempProductInfo;
		setLocalProductInfoList(updatedList);
		setEditingIndex(null);
		setTempProductInfo({ product: "", market: "", partnerships: [] });
		// Update the backend and parent state
		onUpdate("productInformation", updatedList);
	};

	// Delete a product information entry
	const handleDelete = (index) => {
		const updatedList = localProductInfoList.filter((_, i) => i !== index);
		setLocalProductInfoList(updatedList);
		onUpdate("productInformation", updatedList);
	};

	// Handle changes to the product information fields
	const handleChange = (field, value) => {
		setTempProductInfo((prev) => ({ ...prev, [field]: value }));
	};

	// Handle changes to partnerships
	const handlePartnershipChange = (index, value) => {
		const updatedPartnerships = [...tempProductInfo.partnerships];
		updatedPartnerships[index] = value;
		setTempProductInfo((prev) => ({
			...prev,
			partnerships: updatedPartnerships,
		}));
	};

	// Add a new partnership
	const addPartnership = () => {
		setTempProductInfo((prev) => ({
			...prev,
			partnerships: [...prev.partnerships, ""],
		}));
	};

	// Remove a partnership
	const removePartnership = (index) => {
		const updatedPartnerships = [...tempProductInfo.partnerships];
		updatedPartnerships.splice(index, 1);
		setTempProductInfo((prev) => ({
			...prev,
			partnerships: updatedPartnerships,
		}));
	};

	// Start adding a new product information
	const handleAddClick = () => {
		setIsAdding(true);
		setTempProductInfo({ product: "", market: "", partnerships: [] });
	};

	// Save the new product information
	const handleAddSubmit = () => {
		const updatedList = [...localProductInfoList, tempProductInfo];
		setLocalProductInfoList(updatedList);
		setIsAdding(false);
		setTempProductInfo({ product: "", market: "", partnerships: [] });
		onUpdate("productInformation", updatedList);
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Product Information</h2>
			{localProductInfoList && localProductInfoList.length > 0 ? (
				localProductInfoList.map((productInfo, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Product:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={tempProductInfo.product}
									onChange={(e) => handleChange("product", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">
									{productInfo.product || "-"}
								</span>
							)}
						</div>
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Market:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={tempProductInfo.market}
									onChange={(e) => handleChange("market", e.target.value)}
									className="border rounded px-2 py-1 flex-grow mr-2"
								/>
							) : (
								<span className="flex-grow mr-2">
									{productInfo.market || "-"}
								</span>
							)}
						</div>
						<div className="mb-2">
							<span className="font-medium">Partnerships:</span>
							{productInfo.partnerships &&
							productInfo.partnerships.length > 0 ? (
								productInfo.partnerships.map((partnership, pIndex) => (
									<div key={pIndex} className="flex items-center mb-1">
										{editingIndex === index ? (
											<>
												<input
													type="text"
													value={tempProductInfo.partnerships[pIndex]}
													onChange={(e) =>
														handlePartnershipChange(pIndex, e.target.value)
													}
													className="border rounded px-2 py-1 flex-grow mr-2"
												/>
												<button
													onClick={() => removePartnership(pIndex)}
													className="text-red-500 underline"
												>
													<DeleteIcon />
												</button>
											</>
										) : (
											<span className="flex-grow mr-2">- {partnership}</span>
										)}
									</div>
								))
							) : (
								<p className="text-gray-500 ml-4">
									{editingIndex === index
										? "No partnerships. Click 'Add Partnership' to get started."
										: "No partnerships available."}
								</p>
							)}
							{editingIndex === index && (
								<button
									onClick={addPartnership}
									className="text-blue-500 underline mt-2"
								>
									Add Partnership
								</button>
							)}
						</div>
						<div className="flex justify-end">
							{editingIndex === index ? (
								<>
									<button
										onClick={saveProductInfo}
										className="text-blue-500 underline mr-2"
									>
										<SaveIcon />
									</button>
									<button
										onClick={cancelEditing}
										className="text-red-500 underline"
									>
										Cancel
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => startEditing(index)}
										className="text-blue-500 underline mr-2"
									>
										<EditIcon />
									</button>
									<button
										onClick={() => handleDelete(index)}
										className="text-red-500 underline"
									>
										<DeleteIcon />
									</button>
								</>
							)}
						</div>
					</div>
				))
			) : (
				<p className="text-gray-500">
					No product information available. Click "Add" to get started.
				</p>
			)}
			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Product:</span>
						<input
							type="text"
							value={tempProductInfo.product}
							onChange={(e) => handleChange("product", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Market:</span>
						<input
							type="text"
							value={tempProductInfo.market}
							onChange={(e) => handleChange("market", e.target.value)}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="mb-2">
						<span className="font-medium">Partnerships:</span>
						{tempProductInfo.partnerships &&
						tempProductInfo.partnerships.length > 0 ? (
							tempProductInfo.partnerships.map((partnership, index) => (
								<div key={index} className="flex items-center mb-1">
									<input
										type="text"
										value={partnership}
										onChange={(e) =>
											handlePartnershipChange(index, e.target.value)
										}
										className="border rounded px-2 py-1 flex-grow mr-2"
									/>
									<button
										onClick={() => removePartnership(index)}
										className="text-red-500 underline"
									>
										<DeleteIcon />
									</button>
								</div>
							))
						) : (
							<p className="text-gray-500 ml-4">No partnerships added yet.</p>
						)}
						<button
							onClick={addPartnership}
							className="text-blue-500 underline mt-2"
						>
							Add Partnership
						</button>
					</div>
					<div className="flex justify-end">
						<button
							onClick={handleAddSubmit}
							className="text-blue-500 underline mr-2"
						>
							<SaveIcon />
						</button>
						<button onClick={cancelEditing} className="text-red-500 underline">
							Cancel
						</button>
					</div>
				</div>
			)}
			{!isAdding && (
				<div className="text-right">
					<button
						onClick={handleAddClick}
						className="mt-2 px-4 py-2 text-black rounded"
					>
						<AddIcon />
					</button>
				</div>
			)}
		</div>
	);
};

export default ProductInformation;
