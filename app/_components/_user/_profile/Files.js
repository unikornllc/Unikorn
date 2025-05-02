import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { set } from "react-hook-form";
import { useToast } from "@/app/_components/_hooks/useToast";

const Files = ({ username, editable }) => {
	const [userFiles, setUserFiles] = useState([]);
	const [addingFile, setAddingFile] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [loading, setLoading] = useState(false);

	const { toast } = useToast();

	const uploadFile = async (e) => {
		e.preventDefault();
		if (!selectedFile) return;

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("username", username);
		formData.append("fileName", "resume");

		try {
			setLoading(true);
			await axios
				.post(`${process.env.NEXT_PUBLIC_SERVER}/api/uploadFile`, formData, {
					withCredentials: true,
					headers: { "Content-Type": "multipart/form-data" },
				})
				.then((response) => {
					const uploadedFile = {
						id: response.data.id || Date.now(),
						fileName: response.data.fileName || "resume",
						fileType: response.data.fileType || selectedFile.type,
					};
					setUserFiles((prevFiles) => [...prevFiles, uploadedFile]);
					setSelectedFile(null);
					setAddingFile(false);
				});
		} catch (error) {
			console.error("Error uploading file:", error);
		} finally {
			setLoading(false);
		}
	};

	const deleteFile = async (fileName) => {
		try {
			setLoading(true);
			await axios.delete(`${process.env.NEXT_PUBLIC_SERVER}/api/deleteFile`, {
				params: { username, fileName },
				withCredentials: true,
			});

			setUserFiles((prevFiles) =>
				prevFiles.filter((file) => file.fileName !== fileName),
			);
		} catch (error) {
			console.error("Error deleting file:", error);
		} finally {
			setLoading(false);
		}
	};

	const downloadFile = async (fileName) => {
		try {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_SERVER}/api/getFile`,
				{
					params: { username, fileName },
					withCredentials: true,
				},
			);

			const fileData = response.data;

			const binaryString = atob(fileData.fileContent);
			const binaryLength = binaryString.length;
			const binaryArray = new Uint8Array(binaryLength);

			for (let i = 0; i < binaryLength; i++) {
				binaryArray[i] = binaryString.charCodeAt(i);
			}

			const blob = new Blob([binaryArray], { type: fileData.fileType });

			let fileExtension = fileData.fileType.split("/").pop();
			if (fileExtension === "plain") {
				fileExtension = "txt";
			}

			const downloadName = fileData.fileName.includes(".")
				? fileData.fileName
				: `${fileData.fileName}.${fileExtension}`;

			const link = document.createElement("a");
			link.href = window.URL.createObjectURL(blob);
			link.download = downloadName;
			link.click();

			window.URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	useEffect(() => {
		const fetchUserFiles = async () => {
			try {
				const response = await axios.get(
					`${process.env.NEXT_PUBLIC_SERVER}/api/getFile`,
					{
						params: { username, fileName: "resume" },
						withCredentials: true,
					},
				);

				if (response.data.fileName) {
					setUserFiles([response.data]);
				}
			} catch (error) {
				console.error("Error fetching user files:", error);
			}
		};

		fetchUserFiles();
	}, [username]);

	return (
		<div className="bg-white p-6 rounded-lg shadow mb-6">
			<div className="flex justify-between items-center mb-4">
				<h3 className="text-2xl font-semibold text-textPrimary">Resume</h3>
				{editable && userFiles.length < 1 && (
					<button
						className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
						onClick={() => setAddingFile(true)}
					>
						<PlusIcon className="w-5 h-5 text-gray-600" />
					</button>
				)}
			</div>

			{editable && addingFile && (
				<form onSubmit={uploadFile} className="mb-4">
					<input
						type="file"
						onChange={(e) => setSelectedFile(e.target.files[0])}
						className="border border-gray-300 p-2 rounded-md w-full mb-2"
						required
					/>
					<div className="flex">
						<button
							type="submit"
							className="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary mr-2"
							disabled={loading}
						>
							Upload
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
							onClick={() => {
								setAddingFile(false);
								setSelectedFile(null);
							}}
						>
							Cancel
						</button>
					</div>
				</form>
			)}

			<ul className="list-disc list-inside space-y-2">
				{userFiles &&
					userFiles.map((file, index) => (
						<li
							key={file.id || `file-${index}`}
							className="flex justify-between items-center"
						>
							<div>
								<span className="text-textSecondary">{file.fileName}</span>
							</div>
							<div className="flex space-x-2">
								<button
									className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
									onClick={() => downloadFile(file.fileName)}
								>
									<svg
										className="w-5 h-5 text-gray-600"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m0 0l-3-3m3 3l3-3m0-9h.01"
										/>
									</svg>
								</button>
								{editable && (
									<button
										className="p-2 text-red-500 hover:text-red-700"
										onClick={() => deleteFile(file.fileName)}
										disabled={loading}
									>
										<TrashIcon className="w-5 h-5" />
									</button>
								)}
							</div>
						</li>
					))}
			</ul>
		</div>
	);
};

export default Files;
