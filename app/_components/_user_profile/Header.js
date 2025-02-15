import React, { useState, useRef, useEffect } from "react";
import {
	PencilIcon,
	CameraIcon,
	TrashIcon,
	CogIcon,
} from "@heroicons/react/24/solid";
import AvatarEditor from "react-avatar-editor";
import Modal from "react-modal";
import axios from "axios";
import Webcam from "react-webcam";
import SettingsOverlay from "../_shared/_settings/Settings";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const Header = ({ user, editable }) => {
	const { username, name, title, unikornVerified } = user;
	const [userFile, setUserFile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [editor, setEditor] = useState(null);
	const [scale, setScale] = useState(1);
	const [filter, setFilter] = useState("none");
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const webcamRef = useRef(null);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	// const [isModalOpen, setIsModalOpen] = useState(false);

	const handleImageUpload = (e) => {
		setSelectedImage(e.target.files[0]);
		setIsEditing(true);
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
					`${process.env.NEXT_PUBLIC_SERVER}/api/uploadUserFile`,
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
		setIsEditing(false);
	};

	const deleteProfilePicture = async (fileId) => {
		try {
			if (userFile) {
				await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/deleteUserFile`, {
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
		setIsEditing(true);
	};

	const filterOptions = [
		"none",
		"grayscale(100%)",
		"sepia(100%)",
		"invert(100%)",
	];

	const handleOpenModal = () => setIsEditing(true);

	const handleCloseModal = () => {
		setIsEditing(false);
		setSelectedImage(null);
		setFilter("none");
		setScale(1);
	};

	useEffect(() => {
		if (isSettingsOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isSettingsOpen]);

	useEffect(() => {
		if (isEditing) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isEditing]);

	useEffect(() => {
		const fetchUserFile = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getUserFile`,
					{
						params: { username, fileName: "profile_picture" },
						withCredentials: true,
					},
				);
				const data = response.data;
				if (data && data.fileContent) {
					const imageSrc = `data:${data.mimeType};base64,${data.fileContent}`;
					setUserFile(imageSrc);
				}
			} catch (error) {
				console.error("Error fetching profile picture:", error);
			}
		};
		fetchUserFile();
	}, []);

	return (
		<div className="relative mb-6">
			<div className="h-48 bg-primary relative">
				{editable && (
					<button
						className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100"
						onClick={() => setIsSettingsOpen(true)}
					>
						<CogIcon className="w-6 h-6 text-gray-700" />
					</button>
				)}
			</div>
			<div className="absolute top-20 left-1/2 transform -translate-x-1/2">
				<div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white relative group">
					{userFile ? (
						<img
							src={userFile}
							alt={`${name}'s profile`}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="bg-gray-200 flex items-center justify-center h-full w-full">
							<span className="text-6xl text-gray-500">{name.charAt(0)}</span>
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
			</div>
			{editable && (
				<p
					className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 rounded-full px-3 py-1 text-sm font-medium shadow-lg transition duration-300 ${user.tier === "Standard"
						? "bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100"
						: "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white"
						}`}
				>
					{user.tier}
				</p>
			)}
			<div className="pt-24 pb-6 text-center">
				<h2 className="text-xl text-gray-600">{title}</h2>
				<h1 className="text-3xl font-bold">
					{name}{" "}
					{unikornVerified && (
						<span className="text-blue-500 inline-block ml-2">✔️</span>
					)}
				</h1>
			</div>
			{editable && (
				<Modal
					isOpen={isEditing}
					onRequestClose={handleCloseModal}
					contentLabel="Edit Profile Picture"
					className="fixed inset-0 z-50 flex items-center justify-center overflow-auto"
					overlayClassName="fixed inset-0 bg-black bg-opacity-50"
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
			{editable && isSettingsOpen && (
				<SettingsOverlay onClose={() => setIsSettingsOpen(false)} user={user} />
			)}
		</div>
	);
};

export default Header;
