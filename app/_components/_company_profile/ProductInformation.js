import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import SaveIcon from "@/app/_icons/SaveIcon";

const ProductInformation = ({ productInformationList = [], onUpdate }) => {
	const [editingIndex, setEditingIndex] = useState(null);
	const [newProductInfo, setNewProductInfo] = useState({
		product: "",
		market: "",
		partnerships: [],
	});
	const [isAdding, setIsAdding] = useState(false);

	const handleChange = (index, field, value) => {
		const updatedList = [...productInformationList];
		updatedList[index] = { ...updatedList[index], [field]: value };
		onUpdate("productInformationList", updatedList);
	};

	const handlePartnershipChange = (productIndex, partnershipIndex, value) => {
		const updatedList = [...productInformationList];
		const updatedPartnerships = [...updatedList[productIndex].partnerships];
		updatedPartnerships[partnershipIndex] = value;
		updatedList[productIndex].partnerships = updatedPartnerships;
		onUpdate("productInformationList", updatedList);
	};

	const handleAddPartnership = (productIndex) => {
		const updatedList = [...productInformationList];
		updatedList[productIndex].partnerships.push("");
		onUpdate("productInformationList", updatedList);
	};

	const handleRemovePartnership = (productIndex, partnershipIndex) => {
		const updatedList = [...productInformationList];
		updatedList[productIndex].partnerships.splice(partnershipIndex, 1);
		onUpdate("productInformationList", updatedList);
	};

	const handleDelete = (index) => {
		const updatedList = productInformationList.filter((_, i) => i !== index);
		onUpdate("productInformationList", updatedList);
	};

	const toggleEdit = (index) => {
		setEditingIndex(editingIndex === index ? null : index);
	};

	const handleAddClick = () => {
		setIsAdding(true);
	};

	const handleAddSubmit = () => {
		const updatedList = [...(productInformationList || []), newProductInfo];
		onUpdate("productInformationList", updatedList);
		setNewProductInfo({ product: "", market: "", partnerships: [] });
		setIsAdding(false);
	};

	const handleNewProductInfoChange = (field, value) => {
		setNewProductInfo({ ...newProductInfo, [field]: value });
	};

	const handleNewPartnershipChange = (index, value) => {
		const updatedPartnerships = [...newProductInfo.partnerships];
		updatedPartnerships[index] = value;
		setNewProductInfo({ ...newProductInfo, partnerships: updatedPartnerships });
	};

	const handleAddNewPartnership = () => {
		setNewProductInfo({
			...newProductInfo,
			partnerships: [...newProductInfo.partnerships, ""],
		});
	};

	const handleRemoveNewPartnership = (index) => {
		const updatedPartnerships = [...newProductInfo.partnerships];
		updatedPartnerships.splice(index, 1);
		setNewProductInfo({ ...newProductInfo, partnerships: updatedPartnerships });
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold mb-4">Product Information</h2>
			{productInformationList && productInformationList.length > 0 ? (
				productInformationList.map((productInfo, index) => (
					<div key={index} className="mb-4 p-4 border rounded">
						<div className="flex items-center mb-2">
							<span className="font-medium w-1/3">Product:</span>
							{editingIndex === index ? (
								<input
									type="text"
									value={productInfo.product}
									onChange={(e) =>
										handleChange(index, "product", e.target.value)
									}
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
									value={productInfo.market}
									onChange={(e) =>
										handleChange(index, "market", e.target.value)
									}
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
													value={partnership}
													onChange={(e) =>
														handlePartnershipChange(
															index,
															pIndex,
															e.target.value,
														)
													}
													className="border rounded px-2 py-1 flex-grow mr-2"
												/>
												<button
													onClick={() => handleRemovePartnership(index, pIndex)}
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
									onClick={() => handleAddPartnership(index)}
									className="text-blue-500 underline mt-2"
								>
									Add Partnership
								</button>
							)}
						</div>
						<div className="flex justify-end">
							<button
								onClick={() => toggleEdit(index)}
								className="text-blue-500 underline mr-2"
							>
								{editingIndex === index ? "Save" : "Edit"}
							</button>
							<button
								onClick={() => handleDelete(index)}
								className="text-red-500 underline"
							>
								<DeleteIcon />
							</button>
						</div>
					</div>
				))
			) : (
				<p className="text-gray-500">
					No product information available. Click "Add Product" to get started.
				</p>
			)}
			{isAdding && (
				<div className="mb-4 p-4 border rounded">
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Product:</span>
						<input
							type="text"
							value={newProductInfo.product}
							onChange={(e) =>
								handleNewProductInfoChange("product", e.target.value)
							}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="flex items-center mb-2">
						<span className="font-medium w-1/3">Market:</span>
						<input
							type="text"
							value={newProductInfo.market}
							onChange={(e) =>
								handleNewProductInfoChange("market", e.target.value)
							}
							className="border rounded px-2 py-1 flex-grow mr-2"
						/>
					</div>
					<div className="mb-2">
						<span className="font-medium">Partnerships:</span>
						{newProductInfo.partnerships &&
						newProductInfo.partnerships.length > 0 ? (
							newProductInfo.partnerships.map((partnership, index) => (
								<div key={index} className="flex items-center mb-1">
									<input
										type="text"
										value={partnership}
										onChange={(e) =>
											handleNewPartnershipChange(index, e.target.value)
										}
										className="border rounded px-2 py-1 flex-grow mr-2"
									/>
									<button
										onClick={() => handleRemoveNewPartnership(index)}
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
							onClick={handleAddNewPartnership}
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
						<button
							onClick={() => setIsAdding(false)}
							className="text-red-500 underline"
						>
							<DeleteIcon />
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
