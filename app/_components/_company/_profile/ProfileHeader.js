"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Edit,
	MapPin,
	Calendar,
	Globe,
	CheckCircle,
	MessageSquare,
	Users,
	Briefcase,
} from "lucide-react";
import { Button } from "@/app/_components/_ui/Button";
import { Badge } from "@/app/_components/_ui/Badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/app/_components/_ui/Dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/app/_components/_ui/Tooltip";
import { Input } from "@/app/_components/_ui/Input";
import { Label } from "@/app/_components/_ui/Label";
import { Textarea } from "@/app/_components/_ui/Textarea";
import EditableField from "@/app/_components/_company/_profile/EditableField";
import SocialLinks from "@/app/_components/_company/_profile/SocialLinks";
import { formatDate } from "@/app/_utils/utils";
import {
	PencilIcon,
	CameraIcon,
	TrashIcon,
	CogIcon,
} from "@heroicons/react/24/solid";
import Webcam from "react-webcam";
import AvatarEditor from "react-avatar-editor";
import Modal from "react-modal";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function ProfileHeader({ company, isOwner, updateCompany }) {
	const [isFollowing, setIsFollowing] = useState(false);
	const [followerCount, setFollowerCount] = useState(1234);

	const [isEditingCompanyInfo, setIsEditingCompanyInfo] = useState(false);
	const [companyInfo, setCompanyInfo] = useState({
		name: company.name || "",
		description: company.description || "",
		hqLocation: company.hqLocation || "",
		website: company.website || "",
		industry: company.industry || "",
		type: company.type || "Private",
	});

	const [coverImage, setCoverImage] = useState(null);
	const [profileImage, setProfileImage] = useState(null);
	const [isEditingCover, setIsEditingCover] = useState(false);
	const [isEditingProfile, setIsEditingProfile] = useState(false);

	const [isEditingImage, setIsEditingImage] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [editor, setEditor] = useState(null);
	const [scale, setScale] = useState(1);
	const [filter, setFilter] = useState("none");
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const webcamRef = useRef(null);

	const handleImageUpload = (e) => {
		setSelectedImage(e.target.files[0]);
		setIsEditingImage(true);
		setIsCameraOpen(false);
	};
	const handleSave = async () => {
		if (editor) {
			const canvas = editor.getImageScaledToCanvas().toDataURL();
			const blob = await (await fetch(canvas)).blob();
			const formData = new FormData();
			formData.append("file", blob, "profile_picture.png");
			formData.append("username", username);
			formData.append("fileName", "profile_picture");

			try {
				const response = await axios.post(
					`${process.env.NEXT_PUBLIC_SERVER}/api/uploadFile`,
					formData,
					{
						withCredentials: true,
						headers: {
							"Content-Type": "multipart/form-data",
						},
					},
				);
				window.location.reload();
			} catch (error) {
				console.error("Error uploading profile picture:", error);
			}
		}
		setIsEditingImage(false);
	};
	const deleteProfilePicture = async (fileId) => {
		try {
			if (userFile) {
				await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/deleteFile`, {
					params: { username, fileName: "profile_picture" },
					withCredentials: true,
				});
				window.location.reload();
			}
		} catch (error) {
			console.error("Error deleting profile picture:", error);
		}
	};
	const capturePhoto = () => {
		const imageSrc = webcamRef.current.getScreenshot();
		const byteString = atob(imageSrc.split(",")[1]);
		const mimeString = imageSrc.split(",")[0].split(":")[1].split(";")[0];
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uintArray = new Uint8Array(arrayBuffer);
		for (let i = 0; i < byteString.length; i++) {
			uintArray[i] = byteString.charCodeAt(i);
		}
		const blob = new Blob([uintArray], { type: mimeString });
		setSelectedImage(blob);
		setIsCameraOpen(false);
		setIsEditingImage(true);
	};
	const filterOptions = [
		"none",
		"grayscale(100%)",
		"sepia(100%)",
		"invert(100%)",
	];
	const handleOpenModal = () => setIsEditingImage(true);
	const handleCloseModal = () => {
		setIsEditingImage(false);
		setSelectedImage(null);
		setFilter("none");
		setScale(1);
	};
	useEffect(() => {
		if (isEditingImage) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isEditingImage]);
	useEffect(() => {
		const fetchUserFile = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getFile`,
					{
						params: { username, fileName: "profile_picture" },
						withCredentials: true,
					},
				);
				const data = response.data;
				if (data && data.fileContent) {
					const imageSrc = `data:${data.mimeType};base64,${data.fileContent}`;
					setProfileImage(imageSrc);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		fetchUserFile();
	}, []);

	const handleFollow = () => {
		if (isFollowing) {
			// In a real app, you would call an API here
			setFollowerCount(followerCount - 1);
		} else {
			// In a real app, you would call an API here
			setFollowerCount(followerCount + 1);
		}
		setIsFollowing(!isFollowing);
	};

	const handleSaveCompanyInfo = () => {
		updateCompany(companyInfo);
		setIsEditingCompanyInfo(false);
	};

	const handleSaveCover = () => {
		// In a real app, you would upload the image to a server
		updateCompany({ coverImage: coverImage });
		setIsEditingCover(false);
	};

	const handleSaveProfile = () => {
		// In a real app, you would upload the image to a server
		updateCompany({ profileImage: profileImage });
		setIsEditingProfile(false);
	};

	return (
		<div className="relative">
			{/* Cover Photo */}
			<div className="relative h-60 w-full bg-gradient-to-r from-purple-500 to-indigo-600 overflow-hidden">
				{/* <Image
					src={company.coverImage || coverImage}
					alt={`${company.name} cover`}
					className="object-cover w-full h-full"
					width={1600}
					height={800}
					priority
				/> */}

				{isOwner && (
					<Button
						variant="secondary"
						size="sm"
						className="absolute bottom-4 right-4 z-10"
						onClick={() => {
							setIsEditingCover(true);
						}}
					>
						<Edit className="h-4 w-4 mr-2" />
						Edit Cover
					</Button>
				)}
			</div>

			{/* Profile Section */}

			<div className="container mx-auto px-4 relative">
				<div className="flex flex-col md:flex-row items-end gap-6 pt-6 mb-4">
					<div className="absolute -top-20 left-4 md:left-4 rounded-xl overflow-hidden border-4 border-white bg-white h-40 w-40 shadow-lg z-10 w-36 h-36 rounded-full overflow-hidden border-4 border-white group">
						{profileImage ? (
							<img
								src={profileImage}
								alt={`${company.name}'s profile`}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="bg-gray-200 flex items-center justify-center h-full w-full">
								<span className="text-6xl text-gray-500">
									{company.name.charAt(0).toUpperCase()}
								</span>
							</div>
						)}
						<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
							{isOwner && (
								<div className="flex space-x-4">
									<button
										className="p-2 bg-white rounded-full hover:bg-gray-100"
										onClick={() => setIsEditingImage(true)}
									>
										<PencilIcon className="w-6 h-6 text-gray-600" />
									</button>
									<button
										className="p-2 bg-white rounded-full hover:bg-gray-100"
										onClick={deleteProfilePicture}
									>
										<TrashIcon className="w-6 h-6 text-red-600" />
									</button>
								</div>
							)}
						</div>
					</div>
					{/* Company name and verification badge */}
					<div className="md:ml-44 flex items-center gap-2 flex-wrap mt-24 md:mt-0">
						<h1 className="text-3xl font-bold">{company.name}</h1>

						{company.verified && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger>
										<Badge
											variant="outline"
											className="bg-blue-50 text-blue-600 border-blue-200"
										>
											<CheckCircle className="h-3.5 w-3.5 mr-1" />
											Verified
										</Badge>
									</TooltipTrigger>
									<TooltipContent>
										<p>This company has been verified by Unikorn</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</div>

					{/* Action buttons */}
					<div className="md:ml-auto mt-4 md:mt-0">
						{!isOwner ? (
							<div className="flex gap-3">
								<Button
									variant={isFollowing ? "outline" : "default"}
									onClick={handleFollow}
								>
									{isFollowing ? "Following" : "Follow"}
								</Button>
								<Button variant="outline">
									<MessageSquare className="h-4 w-4 mr-2" />
									Message
								</Button>
							</div>
						) : (
							<Button
								variant="outline"
								onClick={() => {
									setIsEditingCompanyInfo(true);
								}}
							>
								<Edit className="h-4 w-4 mr-2" />
								Edit Company Info
							</Button>
						)}
					</div>
				</div>

				{/* Second row with description and other info */}
				<div className="ml-0 md:ml-44 space-y-4">
					<p className="text-gray-600 max-w-3xl">{company.description}</p>

					{/* Company details */}
					<div className="flex flex-wrap gap-4 text-sm text-gray-500">
						<div className="flex items-center">
							<MapPin className="h-4 w-4 mr-1" />

							<span>{company.hqLocation}</span>
						</div>

						<div className="flex items-center">
							<Calendar className="h-4 w-4 mr-1" />
							<span>Founded {formatDate(company.founded)}</span>
						</div>

						<div className="flex items-center">
							<Briefcase className="h-4 w-4 mr-1" />
							<span>{company.type} Company</span>
						</div>

						<div className="flex items-center">
							<Globe className="h-4 w-4 mr-1" />
							<Link
								href={company.website}
								target="_blank"
								className="text-blue-600 hover:underline"
							>
								{company.website.replace(/^https?:\/\//, "")}
							</Link>
						</div>

						<div className="flex items-center">
							<Users className="h-4 w-4 mr-1" />
							<span>{followerCount} followers</span>
						</div>
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 pt-2">
						{company.industry && (
							<Badge variant="secondary">{company.industry}</Badge>
						)}
						{/* Additional industry tags would go here */}
						<Badge variant="secondary">Technology</Badge>
						<Badge variant="secondary">SaaS</Badge>
						<Badge variant="secondary">Fintech</Badge>
					</div>
				</div>

				{/* Social links */}
				<div className="mt-6">
					<SocialLinks isOwner={isOwner} />
				</div>
			</div>

			{/* Edit Cover Dialog */}
			<Dialog open={isEditingCover} onOpenChange={setIsEditingCover}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Cover Photo</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
							<div className="mb-4 relative h-40 w-full overflow-hidden rounded-md">
								<Image
									src={coverImage || "/placeholder.svg"}
									alt="Cover preview"
									className="object-cover w-full h-full"
									width={600}
									height={200}
								/>
							</div>
							<p className="text-gray-500 mb-2">
								Drag and drop a new cover photo or click to browse
							</p>
							<Input
								type="file"
								accept="image/*"
								className="hidden"
								id="cover-upload"
								onChange={(e) => {
									const file = e.target.files[0];
									if (file) {
										// In a real app, you would upload the file to a server
										// For now, we'll just create a local URL
										const url = URL.createObjectURL(file);
										setCoverImage(url);
									}
								}}
							/>
							<Label htmlFor="cover-upload" className="cursor-pointer">
								<Button type="button" variant="outline" className="mr-2">
									Choose File
								</Button>
							</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsEditingCover(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveCover}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Profile Dialog */}
			<Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Update Profile Picture</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
							<div className="mb-4 mx-auto relative h-40 w-40 overflow-hidden rounded-full">
								{/* <Image
									src={profileImage || "/placeholder.svg"}
									alt="Profile preview"
									className="object-cover w-full h-full"
									width={160}
									height={160}
								/> */}
								<div className="bg-gray-200 flex items-center justify-center h-full w-full rounded-full">
									<span className="text-6xl text-gray-500">
										{company.name.charAt(0).toUpperCase()}
									</span>
								</div>
							</div>
							<p className="text-gray-500 mb-2">
								Drag and drop a new profile picture or click to browse
							</p>
							<Input
								type="file"
								accept="image/*"
								className="hidden"
								id="profile-upload"
								onChange={(e) => {
									const file = e.target.files[0];
									if (file) {
										// In a real app, you would upload the file to a server
										// For now, we'll just create a local URL
										const url = URL.createObjectURL(file);
										setProfileImage(url);
									}
								}}
							/>
							<Label htmlFor="profile-upload" className="cursor-pointer">
								<Button type="button" variant="outline" className="mr-2">
									Choose File
								</Button>
							</Label>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsEditingProfile(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveProfile}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Company Info Dialog */}
			<Dialog
				open={isEditingCompanyInfo}
				onOpenChange={setIsEditingCompanyInfo}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Company Information</DialogTitle>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-name" className="text-right">
								Company Name
							</Label>
							<Input
								id="company-name"
								value={companyInfo.name}
								onChange={(e) => {
									setCompanyInfo(
										Object.assign({}, companyInfo, { name: e.target.value }),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-start gap-4">
							<Label htmlFor="company-description" className="text-right pt-2">
								Description
							</Label>
							<Textarea
								id="company-description"
								value={companyInfo.description}
								onChange={(e) => {
									setCompanyInfo(
										Object.assign({}, companyInfo, {
											description: e.target.value,
										}),
									);
								}}
								className="col-span-3 min-h-[100px]"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-location" className="text-right">
								Headquarters
							</Label>
							<Input
								id="company-location"
								value={companyInfo.hqLocation}
								onChange={(e) => {
									setCompanyInfo(
										Object.assign({}, companyInfo, {
											hqLocation: e.target.value,
										}),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-website" className="text-right">
								Website
							</Label>
							<Input
								id="company-website"
								value={companyInfo.website}
								onChange={(e) => {
									setCompanyInfo(
										Object.assign({}, companyInfo, { website: e.target.value }),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-industry" className="text-right">
								Industry
							</Label>
							<Input
								id="company-industry"
								value={companyInfo.industry}
								onChange={(e) => {
									setCompanyInfo(
										Object.assign({}, companyInfo, {
											industry: e.target.value,
										}),
									);
								}}
								className="col-span-3"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="company-type" className="text-right">
								Company Type
							</Label>
							<select
								id="company-type"
								value={companyInfo.type}
								onChange={(e) => {
									setCompanyInfo(
										Object.assign({}, companyInfo, { type: e.target.value }),
									);
								}}
								className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="Profit">Profit</option>
								<option value="NonProfit">NonProfit</option>
								<option value="Private">Private</option>
								<option value="Public">Public</option>
							</select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setIsEditingCompanyInfo(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={handleSaveCompanyInfo}>Save Changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{isOwner && (
				<Modal
					isOpen={isEditingImage}
					onRequestClose={handleCloseModal}
					contentLabel="Edit Profile Picture"
					className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
					overlayClassName="fixed inset-0 bg-black bg-opacity-50"
					ariaHideApp={false}
				>
					<Transition
						appear
						show={isEditingImage}
						as={React.Fragment}
						enter="transform transition ease-in-out duration-300"
						enterFrom="opacity-0 scale-90"
						enterTo="opacity-100 scale-100"
						leave="transform transition ease-in-out duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-90"
					>
						<div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
							{/* Modal header */}
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-semibold">Edit Profile Picture</h2>
								<button
									className="p-2 rounded-full hover:bg-gray-100"
									onClick={handleCloseModal}
									aria-label="Close"
								>
									<XMarkIcon className="w-6 h-6 text-gray-600" />
								</button>
							</div>

							<div className="flex flex-col items-center">
								{selectedImage ? (
									<div>
										<AvatarEditor
											ref={(ref) => setEditor(ref)}
											image={selectedImage}
											width={250}
											height={250}
											border={20}
											borderRadius={125}
											scale={scale}
											rotate={0}
											style={{ filter }}
											className="rounded-full overflow-hidden"
										/>
										<div className="mt-4 w-full">
											<label className="block text-gray-700 mb-1">Zoom</label>
											<input
												type="range"
												min="1"
												max="3"
												step="0.01"
												value={scale}
												onChange={(e) => setScale(parseFloat(e.target.value))}
												className="w-full accent-primary"
											/>
										</div>
										<div className="mt-4 w-full">
											<label className="block text-gray-700 mb-1">Filter</label>
											<select
												value={filter}
												onChange={(e) => setFilter(e.target.value)}
												className="border border-gray-300 p-2 rounded-md w-full"
											>
												<option value="none">None</option>
												<option value="grayscale(100%)">Grayscale</option>
												<option value="sepia(100%)">Sepia</option>
												<option value="invert(100%)">Invert</option>
											</select>
										</div>
									</div>
								) : isCameraOpen ? (
									<div>
										<Webcam
											audio={false}
											ref={webcamRef}
											screenshotFormat="image/png"
											width={250}
											height={250}
											className="rounded-lg overflow-hidden"
										/>
										<button
											className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
											onClick={capturePhoto}
										>
											Capture Photo
										</button>
										<button
											className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
											onClick={() => setIsCameraOpen(false)}
										>
											Cancel
										</button>
									</div>
								) : (
									<div>
										<div className="flex space-x-4">
											<button
												className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center transition-colors"
												onClick={() =>
													document.getElementById("fileInput").click()
												}
											>
												<CameraIcon className="w-6 h-6 text-gray-600 mr-2" />
												Upload Photo
											</button>
											<button
												className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center transition-colors"
												onClick={() => setIsCameraOpen(true)}
											>
												<CameraIcon className="w-6 h-6 text-gray-600 mr-2" />
												Use Camera
											</button>
										</div>
										<input
											type="file"
											id="fileInput"
											accept="image/*"
											onChange={handleImageUpload}
											style={{ display: "none" }}
										/>
									</div>
								)}
								{selectedImage && (
									<div className="mt-6 flex space-x-4">
										<button
											className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
											onClick={handleSave}
										>
											Save
										</button>
										<button
											className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
											onClick={() => {
												setSelectedImage(null);
												setFilter("none");
												setScale(1);
											}}
										>
											Cancel
										</button>
									</div>
								)}
							</div>
						</div>
					</Transition>
				</Modal>
			)}
		</div>
	);
}
