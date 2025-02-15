import React, { useState } from "react";
import AddIcon from "@/app/_icons/AddIcon";
import DeleteIcon from "@/app/_icons/DeleteIcon";
import SaveIcon from "@/app/_icons/SaveIcon";

const CompanyFiles = ({ files = [], onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFile, setNewFile] = useState(null);

  const handleDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onUpdate && onUpdate("files", updatedFiles);
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleAddSubmit = () => {
    if (newFile) {
      const uploadedFile = {
        id: newFile.lastModified.toString(),
        fileName: newFile.name,
        fileType: newFile.type,
        filePath: URL.createObjectURL(newFile),
        uploadedAt: new Date().toISOString(),
      };
      const updatedFiles = [...files, uploadedFile];
      onUpdate && onUpdate("files", updatedFiles);
      setNewFile(null);
      setIsAdding(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Company Files</h2>
      {files && files.length > 0 ? (
        files.map((file, index) => (
          <div key={index} className="mb-4 p-4 border rounded flex items-center">
            <div className="flex-grow">
              <p>
                <strong>File Name:</strong> {file.fileName}
              </p>
              <p>
                <strong>File Type:</strong> {file.fileType}
              </p>
              <p>
                <strong>Uploaded At:</strong>{" "}
                {new Date(file.uploadedAt).toLocaleString()}
              </p>
            </div>
            <div className="flex">
              <a
                href={file.filePath}
                download={file.fileName}
                className="text-blue-500 underline mr-2"
              >
                Download
              </a>
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
          No company files available. Click "Add File" to get started.
        </p>
      )}
      {isAdding && (
        <div className="mb-4 p-4 border rounded">
          <div className="mb-2">
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleAddSubmit}
              className="text-blue-500 underline mr-2"
              disabled={!newFile}
            >
              <SaveIcon />
            </button>
            <button
              onClick={() => {
                setNewFile(null);
                setIsAdding(false);
              }}
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

export default CompanyFiles;