"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { FileText, Trash2 } from "lucide-react"


export default function CompanyFiles({ company, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedFiles, setEditedFiles] = useState(company.company_file)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the company data
    // await fetch(`/api/company/${company.id}/files`, { method: 'PUT', body: JSON.stringify(editedFiles) })
    setIsEditing(false)
  }

  const handleFileUpload = (event) => {
    // In a real app, you would handle file upload to a server here
    const file = event.target.files[0]
    if (file) {
      setEditedFiles([
        ...editedFiles,
        {
          fileName: file.name,
          filePath: URL.createObjectURL(file),
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
        },
      ])
    }
  }

  const handleRemoveFile = (index) => {
    setEditedFiles(editedFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Files</h2>
        {isOwnProfile &&
          (isEditing ? (
            <div>
              <Button onClick={handleSave} className="mr-2">
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ))}
      </div>
      {isEditing && <Input type="file" onChange={handleFileUpload} className="mb-4" />}
      <ul className="space-y-2">
        {editedFiles && editedFiles.map((file, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText size={20} className="mr-2" />
              <a
                href={file.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {file.fileName}
              </a>
            </div>
            {isEditing && (
              <Button variant="ghost" onClick={() => handleRemoveFile(index)}>
                <Trash2 size={20} className="text-red-500" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}


