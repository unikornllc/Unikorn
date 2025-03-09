"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/_ui/Select"

import { Plus, X } from "lucide-react"

const degreeOptions = ["NONE", "BA", "BSc", "MA", "MSc", "MBA", "PhD"]

export default function UserEducation({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEducation, setEditedEducation] = useState(user.education)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the user data
    // await fetch(`/api/user/${user.id}/education`, { method: 'PUT', body: JSON.stringify(editedEducation) })
    setIsEditing(false)
  }

  const handleAddEducation = () => {
    setEditedEducation([...editedEducation, { degree: "NONE", institution: "" }])
  }

  const handleRemoveEducation = (index) => {
    setEditedEducation(editedEducation.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Education</h2>
        {isOwnProfile && (
          isEditing ? (
            <div>
              <Button onClick={handleSave} className="mr-2">Save</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )
        )}
      </div>
      {isEditing ? (
        <div className="space-y-4">
          {editedEducation.map((education, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Select
                value={education.degree}
                onValueChange={(value) => {
                  const newEducation = [...editedEducation]
                  newEducation[index].degree = value
                  setEditedEducation(newEducation)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a degree" />
                </SelectTrigger>
                <SelectContent>
                  {degreeOptions.map((degree) => (
                    <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={education.institution}
                onChange={(e) => {
                  const newEducation = [...editedEducation]
                  newEducation[index].institution = e.target.value
                  setEditedEducation(newEducation)
                }}
                placeholder="Institution"
              />
              <Button onClick={() => handleRemoveEducation(index)} variant="ghost">
                <X size={20} />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddEducation}>
            <Plus size={20} className="mr-2" /> Add Education
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {user.education.map((education, index) => (
            <div key={index}>
              <p><strong>{education.degree}</strong> - {education.institution}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

