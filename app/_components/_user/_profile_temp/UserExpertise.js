"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Plus, X } from "lucide-react"

export default function UserExpertise({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedExpertise, setEditedExpertise] = useState(user.expertise)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the user data
    // await fetch(`/api/user/${user.id}/expertise`, { method: 'PUT', body: JSON.stringify(editedExpertise) })
    setIsEditing(false)
  }

  const handleAddExpertise = () => {
    setEditedExpertise([...editedExpertise, { field: "" }])
  }

  const handleRemoveExpertise = (index) => {
    setEditedExpertise(editedExpertise.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expertise</h2>
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
      {isEditing ? (
        <div className="space-y-4">
          {editedExpertise.map((expertise, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={expertise.field}
                onChange={(e) => {
                  const newExpertise = [...editedExpertise]
                  newExpertise[index].field = e.target.value
                  setEditedExpertise(newExpertise)
                }}
                placeholder="Expertise field"
              />
              <Button onClick={() => handleRemoveExpertise(index)} variant="ghost">
                <X size={20} />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddExpertise}>
            <Plus size={20} className="mr-2" /> Add Expertise
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {user.expertise.map((expertise, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-0.5 rounded">
              {expertise.field}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

