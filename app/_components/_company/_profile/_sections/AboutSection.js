"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/app/_components/_ui/Card";
import { Button } from "@/app/_components/_ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import { Label } from "@/app/_components/_ui/Label";
import { Input } from "@/app/_components/_ui/Input";
import { Textarea } from "@/app/_components/_ui/Textarea";
import {
	Edit,
	Building,
	Globe,
	MapPin,
	Calendar,
	Users,
	Briefcase,
	Plus,
} from "lucide-react";
import EditableField from "@/app/_components/_company/_profile/EditableField";
import { formatDate } from "@/app/_utils/utils";

export default function AboutSection({ company, isOwner, updateCompany }) {
	const [isEditingAbout, setIsEditingAbout] = useState(false);
	const [isEditingProduct, setIsEditingProduct] = useState(false);
	const [isAddingProduct, setIsAddingProduct] = useState(false);

	const [aboutInfo, setAboutInfo] = useState({
		description: company.description,
		name: company.name,
		website: company.website,
		hqLocation: company.hqLocation,
		founded: company.founded,
		type: company.type,
		industry: company.industry,
		tier: company.tier,
	});

	const [productInfo, setProductInfo] = useState(
		company.productInformation && company.productInformation.length > 0
			? {
					id: company.productInformation[0].id,
					product: company.productInformation[0].product,
					market: company.productInformation[0].market,
					partnerships: company.productInformation[0].partnerships.join(", "),
				}
			: {
					product: "",
					market: "",
					partnerships: "",
				},
	);

	const [newProduct, setNewProduct] = useState({
		product: "",
		market: "",
		partnerships: "",
	});

	const handleSaveAbout = () => {
		updateCompany(aboutInfo);
		setIsEditingAbout(false);
	};

	const handleSaveProduct = () => {
		const partnerships = productInfo.partnerships
			.split(",")
			.map((p) => p.trim())
			.filter((p) => p);

		const updatedProduct = {
			id: productInfo.id,
			product: productInfo.product,
			market: productInfo.market,
			partnerships: partnerships,
			companyId: company.id,
		};

		const updatedProductInfo = company.productInformation
			? company.productInformation.map((p) =>
					p.id === updatedProduct.id ? updatedProduct : p,
				)
			: [updatedProduct];

		updateCompany({ productInformation: updatedProductInfo });
		setIsEditingProduct(false);
	};

	const handleAddProduct = () => {
		if (!newProduct.product || !newProduct.market) return;

		const partnerships = newProduct.partnerships
			.split(",")
			.map((p) => p.trim())
			.filter((p) => p);

		const product = {
			id: Date.now().toString(),
			product: newProduct.product,
			market: newProduct.market,
			partnerships: partnerships,
			companyId: company.id,
		};

		const updatedProductInfo = company.productInformation
			? [...company.productInformation, product]
			: [product];

		updateCompany({ productInformation: updatedProductInfo });
		setNewProduct({ product: "", market: "", partnerships: "" });
		setIsAddingProduct(false);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>About {company.name}</CardTitle>
						<CardDescription>Company overview and details</CardDescription>
					</div>
					{isOwner && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditingAbout(true)}
						>
							<Edit className="h-4 w-4 mr-2" />
							Edit
						</Button>
					)}
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-medium mb-2">Overview</h3>
							{isOwner ? (
								<EditableField
									value={company.description}
									onSave={(value) => updateCompany({ description: value })}
									multiline
									className="text-gray-600"
								/>
							) : (
								<p className="text-gray-600">{company.description}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="text-lg font-medium mb-4">Company Details</h3>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<Building className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Legal Name</h4>
											<p className="text-gray-600">{company.name}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Globe className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Website</h4>
											<p className="text-gray-600">{company.website}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Headquarters</h4>
											<p className="text-gray-600">{company.hqLocation}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Founded</h4>
											<p className="text-gray-600">
												{formatDate(company.founded)}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 className="text-lg font-medium mb-4">
									Additional Information
								</h3>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<Briefcase className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Company Type</h4>
											<p className="text-gray-600">{company.type}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Users className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Company Size</h4>
											<p className="text-gray-600">51-200 employees</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Building className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Industry</h4>
											<p className="text-gray-600">{company.industry}</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<Building className="h-5 w-5 text-gray-500 mt-0.5" />
										<div>
											<h4 className="font-medium">Tier</h4>
											<p className="text-gray-600">{company.tier}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Product Information</CardTitle>
						<CardDescription>
							Details about products and markets
						</CardDescription>
					</div>
					{isOwner && (
						<div className="flex gap-2">
							{company.productInformation &&
								company.productInformation.length > 0 && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setIsEditingProduct(true)}
									>
										<Edit className="h-4 w-4 mr-2" />
										Edit
									</Button>
								)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsAddingProduct(true)}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Product
							</Button>
						</div>
					)}
				</CardHeader>
				<CardContent>
					{company.productInformation &&
					company.productInformation.length > 0 ? (
						<div className="space-y-6">
							{company.productInformation.map((product) => (
								<Card key={product.id}>
									<CardContent className="p-6">
										<div>
											<h3 className="text-lg font-medium">Product</h3>
											<p className="text-gray-600">{product.product}</p>
										</div>

										<div>
											<h3 className="text-lg font-medium">Market</h3>
											<p className="text-gray-600">{product.market}</p>
										</div>

										<div>
											<h3 className="text-lg font-medium">Partnerships</h3>
											<div className="flex flex-wrap gap-2 mt-2">
												{product.partnerships.map((partnership, index) => (
													<div
														key={index}
														className="bg-gray-100 px-3 py-1 rounded-full text-sm"
													>
														{partnership}
													</div>
												))}
											</div>
										</div>
									</CardContent>{" "}
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							<p>No product information available</p>
							{isOwner && (
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => setIsAddingProduct(true)}
								>
									Add Product Information
								</Button>
							)}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Edit About Dialog */}
			<Dialog open={isEditingAbout} onOpenChange={setIsEditingAbout}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit About Information</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="about-description" className="text-right pt-2">
								Description
							</Label>
							<Textarea
								id="about-description"
								value={aboutInfo.description}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, description: e.target.value })
								}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="about-name" className="text-right">
								Legal Name
							</Label>
							<Input
								id="about-name"
								value={aboutInfo.name}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, name: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="about-website" className="text-right">
								Website
							</Label>
							<Input
								id="about-website"
								value={aboutInfo.website}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, website: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="about-location" className="text-right">
								Headquarters
							</Label>
							<Input
								id="about-location"
								value={aboutInfo.hqLocation}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, hqLocation: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="about-type" className="text-right">
								Company Type
							</Label>
							<select
								id="about-type"
								value={aboutInfo.type}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, type: e.target.value })
								}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Profit">Profit</option>
								<option value="NonProfit">NonProfit</option>
								<option value="Private">Private</option>
								<option value="Public">Public</option>
							</select>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="about-industry" className="text-right">
								Industry
							</Label>
							<Input
								id="about-industry"
								value={aboutInfo.industry}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, industry: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="about-tier" className="text-right">
								Tier
							</Label>
							<select
								id="about-tier"
								value={aboutInfo.tier}
								onChange={(e) =>
									setAboutInfo({ ...aboutInfo, tier: e.target.value })
								}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Hunter">Hunter</option>
								<option value="Holder">Holder</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditingAbout(false)}>
							Cancel
						</Button>
						<Button onClick={handleSaveAbout}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Product Dialog */}
			<Dialog open={isEditingProduct} onOpenChange={setIsEditingProduct}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Product Information</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="product-name" className="text-right">
								Product
							</Label>
							<Input
								id="product-name"
								value={productInfo.product}
								onChange={(e) =>
									setProductInfo({ ...productInfo, product: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="product-market" className="text-right">
								Market
							</Label>
							<Input
								id="product-market"
								value={productInfo.market}
								onChange={(e) =>
									setProductInfo({ ...productInfo, market: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="product-partnerships" className="text-right pt-2">
								Partnerships
							</Label>
							<Textarea
								id="product-partnerships"
								value={productInfo.partnerships}
								onChange={(e) =>
									setProductInfo({
										...productInfo,
										partnerships: e.target.value,
									})
								}
								placeholder="Comma-separated list of partnerships"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsEditingProduct(false)}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveProduct}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Add Product Dialog */}
			<Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Product Information</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="new-product-name" className="text-right">
								Product
							</Label>
							<Input
								id="new-product-name"
								value={newProduct.product}
								onChange={(e) =>
									setNewProduct({ ...newProduct, product: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="new-product-market" className="text-right">
								Market
							</Label>
							<Input
								id="new-product-market"
								value={newProduct.market}
								onChange={(e) =>
									setNewProduct({ ...newProduct, market: e.target.value })
								}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label
								htmlFor="new-product-partnerships"
								className="text-right pt-2"
							>
								Partnerships
							</Label>
							<Textarea
								id="new-product-partnerships"
								value={newProduct.partnerships}
								onChange={(e) =>
									setNewProduct({ ...newProduct, partnerships: e.target.value })
								}
								placeholder="Comma-separated list of partnerships"
								className="col-span-3"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsAddingProduct(false)}>
							Cancel
						</Button>
						<Button onClick={handleAddProduct}>Add Product</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
