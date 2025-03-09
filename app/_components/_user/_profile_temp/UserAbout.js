"use client"

import { useState } from "react"
import { Button } from "@/app/_components/_ui/Button"
import { Textarea } from "@/app/_components/_ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/_ui/Select"

export default function UserAbout({ user, isOwnProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAbout, setEditedAbout] = useState({
    description: user.description,
    title: user.title,
  })

  const handleSave = async () => {
    // In a real app, send a PUT request to update the user data
    // await fetch(`/api/user/${user.id}/about`, { method: 'PUT', body: JSON.stringify(editedAbout) })
    setIsEditing(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">About</h2>
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
          <Select value={editedAbout.title} onValueChange={(value) => setEditedAbout({ ...editedAbout, title: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select a title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr">Mr</SelectItem>
              <SelectItem value="Mrs">Mrs</SelectItem>
              <SelectItem value="Ms">Ms</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            value={editedAbout.description}
            onChange={(e) => setEditedAbout({ ...editedAbout, description: e.target.value })}
            placeholder="Tell us about yourself"
            maxLength={300}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {user.title}
          </p>
          <p>{user.description}</p>
        </div>
      )}
    </div>
  )
}

