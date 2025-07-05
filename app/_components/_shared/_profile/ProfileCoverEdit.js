import React, { useState, useRef, useEffect } from "react";
import {
	PencilIcon,
	CameraIcon,
	TrashIcon,
	XMarkIcon,
} from "@heroicons/react/24/solid";
import Modal from "react-modal";
import axios from "axios";
import Webcam from "react-webcam";
import AvatarEditor from "react-avatar-editor";
import { Button } from "@/app/_components/_ui/Button";

import { Transition } from "@headlessui/react";
import { useToast } from "@/app/_components/_hooks/useToast";
import DeleteButton from "@/app/_components/_ui/DeleteButton";

const ProfileCoverEdit = ({ account, editable }) => {
	const { username, name } = account;
	const [profilePicture, setProfilePicture] = useState(null);
	const [coverImage, setCoverImage] = useState(null);
	const [uploadedCoverImage, setUploadedCoverImage] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isEditingCover, setIsEditingCover] = useState(false);
	const [tempProfileImage, setTempProfileImage] = useState(null);
	const [editor, setEditor] = useState(null);
	const [scale, setScale] = useState(1);
	const [filter, setFilter] = useState("none");
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const webcamRef = useRef(null);
	const { toast } = useToast();
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setTempProfileImage(reader.result);
				setScale(1);
				setFilter("none");
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveProfile = async () => {
		if (!tempProfileImage) {
			setIsEditing(false);
			return;
		}
		let imageToSave;

		if (editor) {
			const canvas = editor.getImageScaledToCanvas().toDataURL();
			imageToSave = canvas;
		} else {
			imageToSave = tempProfileImage;
		}
		const response = await fetch(imageToSave);
		const blob = await response.blob();
		const formData = new FormData();
		formData.append("file", blob, "profile_picture.png");
		formData.append("username", username);
		formData.append("fileName", "profile_picture");

		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/uploadProfilePicture`,
				formData,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			setProfilePicture(imageToSave);
			setTempProfileImage(null);
			setEditor(null);
			setIsEditing(false);
		} catch (error) {
			toast({
				title: "Failed",
				description: error?.response?.data?.message,
				variant: "destructive",
			});
		}
	};

	const handleProfileImageDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.classList.remove("border-blue-500", "bg-blue-50");
		const dt = e.dataTransfer;
		const files = dt.files;

		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith("image/")) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setTempProfileImage(reader.result);
					setScale(1);
					setFilter("none");
				};
				reader.readAsDataURL(file);
			}
		}
	};

	const handleCoverImageUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedCoverImage(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSaveCover = async () => {
		if (!uploadedCoverImage) {
			setIsEditingCover(false);
			return;
		}
		const response = await fetch(uploadedCoverImage);
		const blob = await response.blob();
		const formData = new FormData();

		formData.append("file", blob, "cover_picture.png");
		formData.append("username", username);
		formData.append("fileName", "cover_picture");

		try {
			await axios.post(
				`${process.env.NEXT_PUBLIC_SERVER}/api/uploadProfilePicture`,
				formData,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			setCoverImage(uploadedCoverImage);
			setIsEditingCover(false);
		} catch (error) {
			toast({
				title: "Failed",
				description: error?.response?.data?.message,
				variant: "destructive",
			});
		}
	};

	const deleteProfilePicture = async () => {
		try {
			await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/deleteFile`, {
				params: { username, fileName: "profile_picture" },
				withCredentials: true,
			});
			setProfilePicture(null);
			setTempProfileImage(null);
			setIsEditing(false);
		} catch (error) {
			console.error("Error deleting profile picture:", error);
		}
	};

	const deleteCoverPicture = async () => {
		try {
			if (!uploadedCoverImage && coverImage) {
				await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/deleteFile`, {
					params: { username, fileName: "cover_picture" },
					withCredentials: true,
				});
				setCoverImage(null);
				setIsEditingCover(false);
			}
			setUploadedCoverImage(null);
		} catch (error) {
			console.error("Error deleting cover image:", error);
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
		setIsEditing(true);
	};

	const filterOptions = [
		"none",
		"grayscale(100%)",
		"sepia(100%)",
		"invert(100%)",
	];

	const handleCloseModal = () => {
		setIsEditing(false);
		setSelectedImage(null);
		setFilter("none");
		setScale(1);
	};

	const handleCloseCoverModal = () => {
		setIsEditingCover(false);
	};

	useEffect(() => {
		if (isEditing || isEditingCover || isCameraOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isEditing, isEditingCover, isCameraOpen]);
	useEffect(() => {
		const fetchProfilePicture = async () => {
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
					setProfilePicture(imageSrc);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};

		const fetchCoverImage = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getFile`,
					{
						params: { username, fileName: "cover_picture" },
						withCredentials: true,
					},
				);
				const data = response.data;
				if (data && data.fileContent) {
					const imageSrc = `data:${data.mimeType};base64,${data.fileContent}`;
					setCoverImage(imageSrc);
				}
			} catch (error) {
				console.error("Error fetching cover image:", error);
			}
		};

		fetchProfilePicture();
		fetchCoverImage();
	}, [username]);

	return (
		<div className="relative">
			<div className="relative h-60 w-full bg-gradient-to-r from-blue-500 to-purple-600 overflow-hidden group">
				{coverImage ? (
					<img
						src={coverImage}
						alt={`${name}'s cover`}
						className="object-cover w-full h-full"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
				)}

				<div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
					{editable && (
						<button
							className="px-4 py-2 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors flex items-center"
							onClick={() => setIsEditingCover(true)}
						>
							<PencilIcon className="h-4 w-4 mr-2" />
							Edit Cover Photo
						</button>
					)}
				</div>
			</div>

			<div className="container mx-auto px-4 relative">
				<div className="absolute -top-20 left-1/2 transform -translate-x-1/2 md:left-4 md:transform-none rounded-xl overflow-hidden border-4 border-white bg-white h-40 w-40 shadow-lg z-10 rounded-full overflow-hidden border-4 border-white group">
					{profilePicture ? (
						<img
							src={profilePicture}
							alt={`${name}'s profile`}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="bg-gray-200 flex items-center justify-center h-full w-full">
							<span className="text-6xl text-gray-500">
								{name.charAt(0).toUpperCase()}
							</span>
						</div>
					)}

					<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
						{editable && (
							<div className="flex space-x-4">
								<button
									className="p-2 bg-white rounded-full hover:bg-gray-100"
									onClick={() => setIsEditing(true)}
								>
									<PencilIcon className="w-6 h-6 text-gray-600" />
								</button>
								{/* <button
									className="p-2 bg-white rounded-full hover:bg-gray-100"
									onClick={() => {
									}}
								>
									<TrashIcon className="w-6 h-6 text-red-600" />
								</button> */}
							</div>
						)}
					</div>
				</div>
			</div>
			{editable && (
				<Modal
					isOpen={isEditing}
					onRequestClose={handleCloseModal}
					contentLabel="Edit Profile Picture"
					className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
					overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
					ariaHideApp={false}
				>
					<Transition
						appear
						show={isEditing}
						as={React.Fragment}
						enter="transform transition ease-in-out duration-300"
						enterFrom="opacity-0 scale-90"
						enterTo="opacity-100 scale-100"
						leave="transform transition ease-in-out duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-90"
					>
						<div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
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
								{tempProfileImage ? (
									<div>
										<AvatarEditor
											ref={(ref) => setEditor(ref)}
											image={tempProfileImage}
											width={250}
											height={250}
											border={20}
											borderRadius={0}
											scale={scale}
											rotate={0}
											style={{ filter }}
											className="overflow-hidden"
										/>
										<div className="mt-4 w-full">
											<label className="block text-gray-700 mb-1">Zoom</label>
											<input
												type="range"
												min="1"
												max="3"
												step="0.01"
												value={scale}
												onChange={(e) =>
													setScale(Number.parseFloat(e.target.value))
												}
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
										<div className="mt-4 flex space-x-2">
											<Button
												variant="destructive"
												onClick={() => {
													setTempProfileImage(null);
													setFilter("none");
													setScale(1);
												}}
											>
												<TrashIcon className="w-4 h-4 mr-2" />
												Remove
											</Button>
										</div>
									</div>
								) : (
									<div
										className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors w-full"
										onDragOver={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onDragEnter={(e) => {
											e.preventDefault();
											e.stopPropagation();
											e.currentTarget.classList.add(
												"border-blue-500",
												"bg-blue-50",
											);
										}}
										onDragLeave={(e) => {
											e.preventDefault();
											e.stopPropagation();
											e.currentTarget.classList.remove(
												"border-blue-500",
												"bg-blue-50",
											);
										}}
										onDrop={handleProfileImageDrop}
										onClick={() =>
											document.getElementById("profile-upload-modal").click()
										}
									>
										<div className="mb-4 mx-auto relative h-40 w-40 overflow-hidden">
											{profilePicture ? (
												<img
													src={profilePicture}
													alt="Profile preview"
													className="object-cover w-full h-full"
												/>
											) : (
												<div className="bg-gray-200 flex items-center justify-center h-full w-full ">
													<span className="text-6xl text-gray-500">
														{name.charAt(0).toUpperCase()}
													</span>
												</div>
											)}
										</div>
										<p className="text-gray-500 mb-2">
											Drag and drop a new profile picture or click to browse
										</p>
										<input
											type="file"
											accept="image/*"
											className="hidden"
											id="profile-upload-modal"
											onChange={handleImageUpload}
										/>
										<div className="flex justify-center space-x-4">
											<Button
												type="button"
												variant="outline"
												className="mr-2"
												onClick={(e) => {
													e.stopPropagation();
													document
														.getElementById("profile-upload-modal")
														.click();
												}}
											>
												<CameraIcon className="w-4 h-4 mr-2" />
												Upload Photo
											</Button>
											<Button
												type="button"
												variant="outline"
												onClick={(e) => {
													e.stopPropagation();
													setIsCameraOpen(true);
													setIsEditing(false);
												}}
											>
												<CameraIcon className="w-4 h-4 mr-2" />
												Use Camera
											</Button>
											{profilePicture && (
												<div
													onClick={(e) => {
														e.stopPropagation();
													}}
													className="ml-2 p-0 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center cursor-pointer"
												>
													<DeleteButton
														onDelete={() => deleteProfilePicture()}
														itemType="Profile Image"
														size="small"
														color="white"
														className="w-full h-full flex items-center justify-center"
													/>
												</div>
											)}
										</div>
									</div>
								)}

								<div className="mt-6 flex space-x-4">
									<button
										className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
										onClick={() => {
											setTempProfileImage(null);
											setIsEditing(false);
											setFilter("none");
											setScale(1);
										}}
									>
										Cancel
									</button>
									<button
										className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
										onClick={handleSaveProfile}
									>
										Save
									</button>
								</div>
							</div>
						</div>
					</Transition>
				</Modal>
			)}

			{editable && (
				<Modal
					isOpen={isCameraOpen}
					onRequestClose={() => setIsCameraOpen(false)}
					contentLabel="Use Camera"
					className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
					overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
					ariaHideApp={false}
				>
					<Transition
						appear
						show={isCameraOpen}
						as={React.Fragment}
						enter="transform transition ease-in-out duration-300"
						enterFrom="opacity-0 scale-90"
						enterTo="opacity-100 scale-100"
						leave="transform transition ease-in-out duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-90"
					>
						<div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-semibold">Take a Photo</h2>
								<button
									className="p-2 rounded-full hover:bg-gray-100"
									onClick={() => setIsCameraOpen(false)}
									aria-label="Close"
								>
									<XMarkIcon className="w-6 h-6 text-gray-600" />
								</button>
							</div>

							<div className="flex flex-col items-center">
								<Webcam
									audio={false}
									ref={webcamRef}
									screenshotFormat="image/png"
									width={250}
									height={250}
									className="rounded-lg overflow-hidden"
								/>
								<div className="mt-6 flex space-x-4">
									<button
										className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
										onClick={() => {
											const imageSrc = webcamRef.current.getScreenshot();
											setTempProfileImage(imageSrc);
											setIsCameraOpen(false);
											setIsEditing(true);
										}}
									>
										Capture Photo
									</button>
									<button
										className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
										onClick={() => {
											setIsCameraOpen(false);
											setIsEditing(true);
										}}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</Transition>
				</Modal>
			)}

			{editable && (
				<Modal
					isOpen={isEditingCover}
					onRequestClose={handleCloseCoverModal}
					contentLabel="Edit Cover Photo"
					className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
					overlayClassName="fixed inset-0 bg-black bg-opacity-75 z-40"
					ariaHideApp={false}
				>
					<Transition
						appear
						show={isEditingCover}
						as={React.Fragment}
						enter="transform transition ease-in-out duration-300"
						enterFrom="opacity-0 scale-90"
						enterTo="opacity-100 scale-100"
						leave="transform transition ease-in-out duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-90"
					>
						<div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-semibold">Edit Cover Photo</h2>
								<button
									className="p-2 rounded-full hover:bg-gray-100"
									onClick={handleCloseCoverModal}
									aria-label="Close"
								>
									<XMarkIcon className="w-6 h-6 text-gray-600" />
								</button>
							</div>

							<div className="space-y-4">
								<div
									className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
									onDragOver={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onDragEnter={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.currentTarget.classList.add(
											"border-blue-500",
											"bg-blue-50",
										);
									}}
									onDragLeave={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.currentTarget.classList.remove(
											"border-blue-500",
											"bg-blue-50",
										);
									}}
									onDrop={(e) => {
										e.preventDefault();
										e.stopPropagation();
										e.currentTarget.classList.remove(
											"border-blue-500",
											"bg-blue-50",
										);

										const dt = e.dataTransfer;
										const files = dt.files;

										if (files && files.length > 0) {
											const file = files[0];
											if (file.type.startsWith("image/")) {
												const reader = new FileReader();
												reader.onloadend = () => {
													setUploadedCoverImage(reader.result);
												};
												reader.readAsDataURL(file);
											}
										}
									}}
									onClick={() =>
										document.getElementById("cover-upload").click()
									}
								>
									<div className="mb-4 relative h-40 w-full overflow-hidden rounded-md">
										{coverImage || uploadedCoverImage ? (
											<img
												src={uploadedCoverImage || coverImage}
												alt="Cover preview"
												className="object-cover w-full h-full"
											/>
										) : (
											<div className="w-full h-40 bg-gray-200 flex items-center justify-center">
												<span className="text-gray-500">
													No cover image selected
												</span>
											</div>
										)}
									</div>
									<p className="text-gray-500 mb-2">
										Drag and drop a new cover photo or click to browse
									</p>
									<input
										type="file"
										accept="image/*"
										className="hidden"
										id="cover-upload"
										onChange={handleCoverImageUpload}
									/>
									<label
										htmlFor="cover-upload"
										className="cursor-pointer"
										onClick={(e) => e.stopPropagation()}
									>
										<Button
											type="button"
											variant="outline"
											className="mr-2"
											onClick={(e) => {
												e.stopPropagation();
												document.getElementById("cover-upload").click();
											}}
										>
											<CameraIcon className="w-4 h-4 mr-2" />
											Choose File
										</Button>
									</label>
									{!uploadedCoverImage && coverImage && (
										<div
											onClick={(e) => {
												e.stopPropagation();
											}}
											className="ml-2 p-0 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center cursor-pointer"
										>
											<DeleteButton
												onDelete={() => deleteCoverPicture()}
												itemType="Cover Image"
												size="small"
												color="white"
												className="w-full h-full flex items-center justify-center"
											/>
										</div>
									)}
								</div>
							</div>

							<div className="flex justify-end mt-4 space-x-2">
								<Button variant="outline" onClick={handleCloseCoverModal}>
									Cancel
								</Button>
								<Button onClick={handleSaveCover}>Save Changes</Button>
							</div>
						</div>
					</Transition>
				</Modal>
			)}
		</div>
	);
};

export default ProfileCoverEdit;
