"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Input } from "@/app/_components/_ui/Input"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/_ui/Select"
import { Plus, X } from "lucide-react"

const proficiencyLevels = ["Beginner", "Intermediate", "Proficient"]

export default function UserLanguages({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLanguages, setEditedLanguages] = useState(user.language)

  const handleSave = async () => {
    // In a real app, send a PUT request to update the user data
    // await fetch(`/api/user/${user.id}/languages`, { method: 'PUT', body: JSON.stringify(editedLanguages) })
    setIsEditing(false)
  }

  const handleAddLanguage = () => {
    setEditedLanguages([...editedLanguages, { language: "", proficiency: "Beginner" }])
  }

  const handleRemoveLanguage = (index) => {
    setEditedLanguages(editedLanguages.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Languages</h2>
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
          {editedLanguages.map((lang, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={lang.language}
                onChange={(e) => {
                  const newLanguages = [...editedLanguages]
                  newLanguages[index].language = e.target.value
                  setEditedLanguages(newLanguages)
                }}
                placeholder="Language"
              />
              <Select
                value={lang.proficiency}
                onValueChange={(value) => {
                  const newLanguages = [...editedLanguages]
                  newLanguages[index].proficiency = value
                  setEditedLanguages(newLanguages)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  {proficiencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => handleRemoveLanguage(index)} variant="ghost">
                <X size={20} />
              </Button>
            </div>
          ))}
          <Button onClick={handleAddLanguage}>
            <Plus size={20} className="mr-2" /> Add Language
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {user.language.map((lang, index) => (
            <div key={index}>
              <p>
                <strong>{lang.language}</strong> - {lang.proficiency}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

